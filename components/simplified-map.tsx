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

import suburbData from "@/data/nsw-suburbs-coords-final-scores.json" assert { type: "json" }

// ────────────────────────────────────────────────────────────
//  Constants & helpers
// ────────────────────────────────────────────────────────────

const EXCLUDE_FROM_DISPLAY = ["CADGEE", "ARATULA", "WASHPOOL"]
const displayPoints = suburbData.filter((s) => !EXCLUDE_FROM_DISPLAY.includes(s.suburb))

function scoreToColor(score: number): string {
  const t = Math.max(0, Math.min(10, score)) / 10
  const r = Math.round(255 * (1 - t))
  const g = Math.round(255 * t)
  return `rgb(${r},${g},0)`
}

function idw(lat: number, lon: number, k = 8, power = 2) {
  const dists = suburbData.map(({ coordinate, score }) => ({
    d: L.latLng(lat, lon).distanceTo(L.latLng(coordinate.lat, coordinate.lon)),
    score,
    coord: coordinate,
  }))
  dists.sort((a, b) => a.d - b.d)
  const nearest = dists.slice(0, k)
  if (nearest[0].d < 1) return { value: nearest[0].score, nearest }
  let num = 0,
    den = 0
  nearest.forEach(({ d, score }) => {
    const w = 1 / Math.pow(d, power)
    num += w * score
    den += w
  })
  return { value: den ? num / den : undefined, nearest }
}

// ────────────────────────────────────────────────────────────
//  Main component
// ────────────────────────────────────────────────────────────

interface SimplifiedMapProps {
  onSuburbSelect?: (id: string) => void
  selectedSuburbId?: string
}

export default function SimplifiedMap({ onSuburbSelect, selectedSuburbId }: SimplifiedMapProps) {
  const [hover, setHover] = useState<{
    latlng: LatLng
    pos: L.Point
    value: number
    lines: [number, number][]
  } | null>(null)
  const [overMarker, setOverMarker] = useState(false)

  // Track the cursor and compute IDW on the fly
  function CursorTracker() {
    const map = useMap()
    const raf = useRef<number | null>(null)
    useMapEvents({
      mousemove: (e) => {
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
          const { value, nearest } = idw(e.latlng.lat, e.latlng.lng)
          const containerPoint = map.latLngToContainerPoint(e.latlng)
          setHover({
            latlng: e.latlng,
            pos: containerPoint,
            value: value ?? 0,
            lines: nearest.slice(0, 3).map((n) => [n.coord.lat, n.coord.lon]),
          })
        })
      },
      mouseout: () => setHover(null),
    })
    return null
  }

  return (
    <MapContainer
      center={[-32.5, 147] as LatLngExpression}
      zoom={6}
      className={`h-full w-full ${!overMarker ? "cursor-crosshair" : ""}`}
      scrollWheelZoom
      preferCanvas
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* suburb markers */}
      {displayPoints.map((s) => (
        <CircleMarker
          key={s.suburb}
          center={[s.coordinate.lat, s.coordinate.lon] as LatLngExpression}
          radius={6}
          pathOptions={{
            color: selectedSuburbId === s.suburb ? "#000" : "#333",
            weight: 1,
            fillColor: scoreToColor(s.score),
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

      {/* helper polylines to nearest 3 suburbs */}
      {hover && !overMarker &&
        hover.lines.map((latlon, i) => (
          <Polyline
            key={i}
            positions={[[latlon[0], latlon[1]], [hover.latlng.lat, hover.latlng.lng]]}
            pathOptions={{ color: "#555", weight: 0.5, dashArray: "3" }}
          />
        ))}

      <CursorTracker />

      {hover && !overMarker && (
        <div
          className="pointer-events-none absolute z-[1000] rounded bg-white/80 px-2 py-1 text-xs text-gray-800 shadow"
          style={{ left: hover.pos.x + 12, top: hover.pos.y - 12 }}
        >
          Est. score: {hover.value.toFixed(2)}
        </div>
      )}
    </MapContainer>
  )
}
