"use client"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMapEvents,
} from "react-leaflet"
import L, { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"

// NOTE: adjust the path below to wherever you place the JSON file.
import suburbData from "@/data/nsw-suburbs-coords-final-scores.json" assert { type: "json" }

/***********************************************************
 * Helper utilities                                        *
 ***********************************************************/

// Convert score (0‑10) to a red→yellow→green gradient
function scoreToColor(score: number): string {
  const t = Math.max(0, Math.min(10, score)) / 10 // 0‑1
  // r: 255→0, g: 0→255 across the range
  const r = Math.round(255 * (1 - t))
  const g = Math.round(255 * t)
  return `rgb(${r},${g},0)`
}

// Very lightweight inverse‑distance‑weighted interpolation
function idw(lat: number, lon: number, k = 8, power = 2): number | undefined {
  const distances = suburbData.map(({ coordinate, score }) => {
    const d = L.latLng(lat, lon).distanceTo(L.latLng(coordinate.lat, coordinate.lon))
    return { d, score }
  })
  distances.sort((a, b) => a.d - b.d)
  const nearest = distances.slice(0, k)
  if (nearest[0].d < 1) return nearest[0].score // cursor on a point
  let num = 0,
    den = 0
  nearest.forEach(({ d, score }) => {
    const w = 1 / Math.pow(d, power)
    num += w * score
    den += w
  })
  return den ? num / den : undefined
}

/***********************************************************
 * React‑Leaflet component                                 *
 ***********************************************************/

interface SimplifiedMapProps {
  onSuburbSelect?: (suburbId: string) => void
  selectedSuburbId?: string
}

export default function SimplifiedMap({
  onSuburbSelect,
  selectedSuburbId,
}: SimplifiedMapProps) {
  const [hoverScore, setHoverScore] = useState<number | undefined>(undefined)

  // Inner component to hook mousemove once map exists
  function MouseMoveHandler() {
    useMapEvents({
      mousemove: (e) => setHoverScore(idw(e.latlng.lat, e.latlng.lng)),
      mouseout: () => setHoverScore(undefined),
    })
    return null
  }

  return (
    <MapContainer
      center={[-32.5, 147] as LatLngExpression}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Plot known suburb points */}
      {suburbData.map((s) => (
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
          }}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={1} className="text-xs">
            {`${s.suburb}: ${s.score}`}
          </Tooltip>
        </CircleMarker>
      ))}

      <MouseMoveHandler />

      {/* floating info panel */}
      <div className="leaflet-top leaflet-right p-2 pointer-events-none">
        <div className="rounded bg-white/85 px-3 py-1 text-sm text-gray-800 shadow">
          {hoverScore === undefined ? "Move cursor over NSW" : `Est. score: ${hoverScore.toFixed(2)}`}
        </div>
      </div>
    </MapContainer>
  )
}

/***********************************************************
 * Usage notes                                             *
 ***********************************************************
 * • Place `nsw-suburbs-coords-final-scores.json` in `src/data` (or update import).
 * • Install deps: `npm i react-leaflet leaflet` and `@types/leaflet`.
 * • Ensure Leaflet’s CSS is imported once globally (e.g. in `layout.tsx`).
 * • This IDW is CPU‑light; for smoother coloured surfaces use the `leaflet-idw` or
 *   `leaflet.heat` plugins.
 */
