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
import "leaflet.heat" // ← heat‑layer plugin

import suburbData from "@/data/nsw-suburbs-coords-final-scores.json" assert { type: "json" }

// ────────────────────────────────────────────────────────────
//  Constants & helpers
// ────────────────────────────────────────────────────────────
const EXCLUDE_FROM_DISPLAY = ["CADGEE", "ARATULA", "WASHPOOL"]
const displayPoints = suburbData.filter((s) => !EXCLUDE_FROM_DISPLAY.includes(s.suburb))

function scoreToColor(score: number) {
  const t = Math.max(0, Math.min(10, score)) / 10
  return `rgb(${Math.round(255 * (1 - t))},${Math.round(255 * t)},0)`
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

type ViewMode = "points" | "heat"

export default function SimplifiedMap({ onSuburbSelect, selectedSuburbId }: SimplifiedMapProps) {
  const [hover, setHover] = useState<
    | {
        latlng: LatLng
        pos: L.Point
        value: number
        lines: [number, number][]
      }
    | null
  >(null)
  const [overMarker, setOverMarker] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [mode, setMode] = useState<ViewMode>("points")

  /* ───────── Heat‑layer management ───────── */
  function HeatLayer() {
    const map = useMap()
    const layerRef = useRef<L.Layer | null>(null)
    const baseRadius = 18 // tweak here
    const build = () => {
      const zoom = map.getZoom()
      const radius = baseRadius * (zoom / 6) // scale a bit with zoom
      const pts: [number, number, number][] = suburbData.map((s) => [
        s.coordinate.lat,
        s.coordinate.lon,
        s.score / 10,
      ])
      return (L as any).heatLayer(pts, {
        radius,
        blur: radius * 0.8,
        minOpacity: 0.5,
        gradient: {
          0.0: "#ff7070",
          0.4: "#ffd866",
          0.8: "#7dd87d",
        },
      })
    }

    useEffect(() => {
      if (mode === "heat") {
        if (layerRef.current) map.removeLayer(layerRef.current)
        layerRef.current = build().addTo(map)
        const handle = () => {
          if (layerRef.current) map.removeLayer(layerRef.current)
          layerRef.current = build().addTo(map)
        }
        map.on("zoomend", handle)
        return () => {
          map.off("zoomend", handle)
          if (layerRef.current) map.removeLayer(layerRef.current)
        }
      } else if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }, [map, mode])
    return null
  }

  /* ───────── Cursor tracker & IDW ───────── */
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

  const showMarkers = mode === "points"
  const showLines = mode === "points"

  return (
    <div className="relative h-full w-full">
      {/* mode toggle */}
      <div className="absolute right-2 top-2 z-[1000] space-x-1 rounded bg-white/90 p-1 shadow">
        {([
          { key: "points", label: "Exact Points" },
          { key: "heat", label: "Heatmap" },
        ] as { key: ViewMode; label: string }[]).map((b) => (
          <button
            key={b.key}
            onClick={() => setMode(b.key)}
            className={`px-2 py-1 text-xs font-medium ${
              mode === b.key ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } rounded`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <MapContainer
        center={[-32.5, 147] as LatLngExpression}
        zoom={6}
        className="h-full w-full"
        style={{ cursor: overMarker ? "pointer" : isPanning ? "grabbing" : "crosshair" }}
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <HeatLayer />

        {/* suburb markers */}
        {showMarkers &&
          displayPoints.map((s) => (
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
        {showLines && hover && !overMarker &&
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
            className="pointer-events-none absolute z-[1000] rounded bg-white/80 px-2 py-1 text-xs text-gray-800 shadow"
            style={{ left: hover.pos.x + 12, top: hover.pos.y - 12 }}
          >
            Est. score: {hover.value.toFixed(2)}
          </div>
        )}
      </MapContainer>
    </div>
  )
}
