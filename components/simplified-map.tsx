"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet"
import L, { LatLngExpression, LatLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"

import suburbData from "@/data/nsw-suburb-scores-new.json" assert { type: "json" }

// ────────────────────────────────────────────────────────────
// helpers
// ────────────────────────────────────────────────────────────
const EXCLUDE = ["CADGEE", "ARATULA", "WASHPOOL"]
const displayPoints = suburbData.filter((s) => !EXCLUDE.includes(s.suburb))

// const scoreToColor = (v: number) => {
//   const t = Math.max(0, Math.min(10, v)) / 10
//   return `rgb(${Math.round(255 * (1 - t))},${Math.round(255 * t)},0)`
// }
const scoreToColor = (v: number) => {
  // Clamp score to [4, 10]
  const clamped = Math.max(6.5, Math.min(10, v))

  // Map [4, 10] → [0, 1]
  const t = Math.pow((clamped - 6) / 6.5, 0.7)

  // Same red-to-green ramp
  return `rgb(${Math.round(255 * (1 - t))},${Math.round(255 * t)},0)`
}

const idw = (lat: number, lon: number, k = 8, p = 2) => {
  const ds = suburbData.map(({ coordinate, score }) => ({
    d: L.latLng(lat, lon).distanceTo(L.latLng(coordinate.lat, coordinate.lon)),
    score,
    coord: coordinate,
  }))
  ds.sort((a, b) => a.d - b.d)
  const nearest = ds.slice(0, k)
  if (nearest[0].d < 1) return { value: nearest[0].score, nearest }
  let num = 0,
    den = 0
  nearest.forEach(({ d, score }) => {
    const w = 1 / Math.pow(d, p)
    num += w * (score ? score : 1)
    den += w
  })
  return { value: den ? num / den : undefined, nearest }
}

// ────────────────────────────────────────────────────────────
// types
// ────────────────────────────────────────────────────────────
interface SimplifiedMapProps {
  onSuburbSelect?: (id: string) => void
  selectedSuburbId?: string
  pin?: { lat: number; lon: number; score?: number }
}

type ViewMode = "points" | "heat"

// ────────────────────────────────────────────────────────────
// component
// ────────────────────────────────────────────────────────────
export default function SimplifiedMap({ onSuburbSelect, selectedSuburbId, pin }: SimplifiedMapProps) {
  const [hover, setHover] = useState<
    | { latlng: LatLng; pos: L.Point; value: number; lines: [number, number][] }
    | null
  >(null)
  const [overMarker, setOverMarker] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [mode, setMode] = useState<ViewMode>("points")

  /* ───────── heat‑layer ───────── */
  function HeatLayer() {
    const map = useMap()
    const layerRef = useRef<L.Layer | null>(null)

    // create a dedicated low‑z pane for the heatmap once
    useEffect(() => {
      if (!map.getPane("heatPane")) {
        const p = map.createPane("heatPane")
        p.style.zIndex = "300" // below markerPane (600) & overlayPane (400)
      }
    }, [map])

    const baseRadius = 18
    const build = () => {
      const zoom = map.getZoom()
      const radius = baseRadius * (zoom / 6)
      const pts: [number, number, number][] = suburbData.map((s) => [s.coordinate.lat, s.coordinate.lon, (s.score ? s.score : 1) / 10])
      return (L as any).heatLayer(pts, {
        radius,
        blur: radius * 0.8,
        minOpacity: 0.5,
        pane: "heatPane",
        gradient: { 0: "#ff7070", 0.4: "#ffd866", 0.8: "#7dd87d" },
      })
    }

    useEffect(() => {
      if (mode === "heat") {
        if (layerRef.current) map.removeLayer(layerRef.current)
        layerRef.current = build().addTo(map)
        const rebuild = () => {
          if (layerRef.current) map.removeLayer(layerRef.current)
          layerRef.current = build().addTo(map)
        }
        map.on("zoomend", rebuild)
        return () => {
          map.off("zoomend", rebuild)
          if (layerRef.current) map.removeLayer(layerRef.current)
        }
      } else if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }, [map, mode])
    return null
  }

  /* ───────── cursor tracker ───────── */
  function CursorTracker() {
    const map = useMap()
    const raf = useRef<number | null>(null)
    useMapEvents({
      mousedown: () => setIsPanning(true),
      dragend: () => setIsPanning(false),
      mouseup: () => setIsPanning(false),
      mousemove: (e) => {
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
          const { value, nearest } = idw(e.latlng.lat, e.latlng.lng)
          setHover({
            latlng: e.latlng,
            pos: map.latLngToContainerPoint(e.latlng),
            value: value ?? 0,
            lines: nearest.slice(0, 3).map((n) => [n.coord.lat, n.coord.lon]),
          })
        })
      },
      mouseout: () => setHover(null),
    })
    return null
  }

  const showMarkers = mode === "points"

  function LegendPoint() {
    return (
      <div className="absolute bottom-2 left-2 z-[30] w-36 rounded bg-white/90 p-2 shadow">
        <div className="text-sm font-medium mb-1">Livability score</div>
        <div className="h-2 w-full rounded"
             style={{ background: 'linear-gradient(to right,rgb(203, 62, 62), #ff4d4d, #3bb273)' }}/>
        <div className="flex justify-between text-xs mt-1">
          <span>0</span><span>5</span><span>10</span>
        </div>
      </div>
    )
  }

  function LegendHeat() {
    return (
      <div className="absolute bottom-2 left-2 z-[30] w-36 rounded bg-white/90 p-2 shadow">
        <div className="text-sm font-medium mb-1">Livability score</div>
        <div className="h-2 w-full rounded"
             style={{ background: 'linear-gradient(to right, #ff4d4d, #3bb273)' }}/>
        <div className="flex justify-between text-xs mt-1">
          <span>0</span><span>5</span><span>10</span>
        </div>
      </div>
    )
  }
  
  
  return (
    <div className="relative h-full w-full">
      {/* mode buttons */}
      <div className="absolute right-2 top-2 z-[30] space-x-1 rounded bg-white/90 p-1 shadow">
        {[
          { key: "points", label: "Exact Points" },
          { key: "heat", label: "Heatmap" },
        ].map((b) => (
          <button
            key={b.key}
            onClick={() => setMode(b.key as ViewMode)}
            className={`rounded px-2 py-1 text-xs font-medium ${
              mode === b.key ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      {mode === "points" ? <LegendPoint /> : <LegendHeat />}

      <MapContainer
        center={[-32.5, 147] as LatLngExpression}
        zoom={6}
        className="h-full w-full z-[20]"
        style={{ cursor: overMarker ? "pointer" : isPanning ? "grabbing" : "crosshair" }}
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer />

        {/* suburb dots */}
        {showMarkers &&
          displayPoints.map((s) => (
            <CircleMarker
              key={s.suburb}
              center={[s.coordinate.lat, s.coordinate.lon] as LatLngExpression}
              radius={6}
              pathOptions={{
                color: selectedSuburbId === s.suburb ? "#000" : "#333",
                weight: 1,
                fillColor: scoreToColor(s.score ? s.score : 1),
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: () => onSuburbSelect?.(s.suburb),
                mouseover: () => setOverMarker(true),
                mouseout: () => setOverMarker(false),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1} className="text-xs">
                {`${s.suburb}: ${s.score}`}
              </Tooltip>
            </CircleMarker>
          ))}

        {/* search pin (always on top via markerPane) */}
        {pin && (
          <CircleMarker
            center={[pin.lat, pin.lon] as LatLngExpression}
            radius={9}
            pane="markerPane"
            pathOptions={{ color: "#1d4ed8", weight: 2, fillColor: "#3b82f6", fillOpacity: 0.95 }}
          >
            {pin.score !== undefined && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -12]}
                opacity={1}
                className="rounded bg-white px-2 py-[1px] text-[10px] font-medium text-gray-800 shadow"
              >
                Est. score {pin.score.toFixed(2)}
              </Tooltip>
            )}
          </CircleMarker>
        )}

        {/* helper lines */}
        {showMarkers && hover && !overMarker &&
          hover.lines.map((latlon, i) => (
            <Polyline
              key={i}
              interactive={false}
              positions={[[latlon[0], latlon[1]], [hover.latlng.lat, hover.latlng.lng]] as LatLngExpression[]}
              pathOptions={{ color: "#555", weight: 0.5, dashArray: "3" }}
            />
          ))}

        <CursorTracker />

        {hover && !overMarker && (
          <div
            className="pointer-events-none absolute z-[400] rounded bg-white/80 px-2 py-1 text-xs text-gray-800 shadow"
            style={{ left: hover.pos.x + 12, top: hover.pos.y - 12 }}
          >
            Est. score: {hover.value.toFixed(2)}
          </div>
        )}
      </MapContainer>
    </div>
  )
}

// expose IDW helper
export { idw }
