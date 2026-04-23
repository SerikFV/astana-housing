import { useState, useMemo, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import { useApartments } from '../hooks/useApartments'
import { getPrice, formatPrice } from '../utils'
import { useNavigate } from 'react-router-dom'
import type { Apartment } from '../types'
import L from 'leaflet'

const DISTRICTS = ['Есильский р-н', 'Нура р-н', 'Алматы р-н', 'Сарыарка р-н', 'Байқоңыр р-н', 'Сарайшык р-н']

function RouteLayer({ userPos, dest, mode }: { userPos: [number, number] | null; dest: [number, number] | null; mode: 'walking' | 'driving' }) {
  const map = useMap()
  const routeRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!userPos || !dest) return
    const profile = mode === 'walking' ? 'foot' : 'driving'
    const color = mode === 'walking' ? '#2ECC71' : '#D4AF37'

    // Try OSRM first, fallback to straight line
    const osrmProfile = mode === 'walking' ? 'foot' : 'driving'
    fetch(`https://router.project-osrm.org/route/v1/${osrmProfile}/${userPos[1]},${userPos[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(data => {
        if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null }
        if (data.routes?.[0]) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
          routeRef.current = L.polyline(coords, { color, weight: mode === 'walking' ? 3 : 5, dashArray: mode === 'walking' ? '8, 8' : undefined }).addTo(map)
          map.fitBounds(routeRef.current.getBounds(), { padding: [40, 40] })
        } else {
          // fallback: straight line
          routeRef.current = L.polyline([userPos, dest], { color, weight: 3, dashArray: '6, 6' }).addTo(map)
          map.fitBounds(routeRef.current.getBounds(), { padding: [40, 40] })
        }
      })
      .catch(() => {
        // fallback: straight line if OSRM fails
        if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null }
        routeRef.current = L.polyline([userPos, dest], { color, weight: 3, dashArray: '6, 6' }).addTo(map)
        map.fitBounds(routeRef.current.getBounds(), { padding: [40, 40] })
      })
    void profile
    return () => { if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null } }
  }, [userPos, dest, mode, map])

  return null
}

export default function MapPage() {
  const { apartments, loading } = useApartments()
  const navigate = useNavigate()
  const [district, setDistrict] = useState('all')
  const [rooms, setRooms] = useState('all')
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [routeDest, setRouteDest] = useState<[number, number] | null>(null)
  const [routeMode, setRouteMode] = useState<'walking' | 'driving'>('driving')

  const filtered = useMemo(() => {
    return apartments
      .filter(a => a.latitude && a.longitude)
      .filter(a => district === 'all' || a.district === district)
      .filter(a => {
        if (rooms === 'all') return true
        const r = parseInt(rooms)
        if (r === 4) return (a.rooms || 0) >= 4
        return a.rooms === r
      })
      .slice(0, 300)
  }, [apartments, district, rooms])

  const handleRoute = (apt: Apartment, mode: 'walking' | 'driving') => {
    setRouteMode(mode)
    if (!userPos) {
      navigator.geolocation?.getCurrentPosition(
        pos => {
          const p: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserPos(p)
          setRouteDest([apt.latitude!, apt.longitude!])
        },
        () => alert('Геолокация қолжетімді емес')
      )
    } else {
      setRouteDest([apt.latitude!, apt.longitude!])
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ color: '#D4AF37', fontSize: 18 }}>Жүктелуде...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar title="Карта" />
      <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <select value={district} onChange={e => setDistrict(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 14, minWidth: 200 }}>
          <option value="all">Барлық аудандар</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', '1', '2', '3', '4'].map(r => (
            <button key={r} onClick={() => setRooms(r)} style={{
              padding: '8px 16px', borderRadius: 20, border: '1px solid #e0e0e0',
              background: rooms === r ? '#D4AF37' : '#fff',
              color: rooms === r ? '#fff' : '#666', fontSize: 13, cursor: 'pointer', fontWeight: 600
            }}>{r === 'all' ? 'Барлығы' : r === '4' ? '4+' : r}</button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#666' }}>{filtered.length} маркер</span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={[51.18, 71.45]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filtered.map(apt => (
            <CircleMarker key={apt.id}
              center={[apt.latitude!, apt.longitude!]}
              radius={14}
              pathOptions={{ fillColor: '#D4AF37', color: '#fff', weight: 2, fillOpacity: 0.9 }}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                    {apt.residential_complex_name || `Пәтер #${apt.id}`}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{apt.address}</div>
                  <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: 15, marginBottom: 10 }}>{formatPrice(getPrice(apt))}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => handleRoute(apt, 'walking')} style={popupBtn}>🚶 Жаяу</button>
                    <button onClick={() => handleRoute(apt, 'driving')} style={popupBtn}>🚗 Көлік</button>
                    <button onClick={() => navigate(`/apartments/${apt.id}`)} style={{ ...popupBtn, background: '#D4AF37', color: '#fff', border: 'none' }}>📄 Толығырақ</button>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {userPos && routeDest && <RouteLayer userPos={userPos} dest={routeDest} mode={routeMode} />}
        </MapContainer>
      </div>
      <div style={{ height: 70 }} />
      <Navbar />
    </div>
  )
}

const popupBtn: React.CSSProperties = {
  padding: '5px 10px', borderRadius: 6, border: '1px solid #e0e0e0',
  background: '#fff', fontSize: 12, cursor: 'pointer'
}
