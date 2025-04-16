"use client"

import { useState } from "react"

interface SimplifiedMapProps {
  onSuburbSelect: (suburbId: string) => void
  selectedSuburbId?: string
}

export function SimplifiedMap({ onSuburbSelect, selectedSuburbId }: SimplifiedMapProps) {
  // This is a simplified map component
  // In a real application, you would use a proper mapping library like Leaflet or Mapbox
  // with actual GeoJSON data for NSW suburbs

  const [hoveredSuburb, setHoveredSuburb] = useState<string | null>(null)

  // Mock suburb data - in a real app this would be GeoJSON data
  const mockSuburbs = [
    { id: "sydney", name: "Sydney", x: 50, y: 50, width: 30, height: 30 },
    { id: "parramatta", name: "Parramatta", x: 30, y: 40, width: 25, height: 25 },
    { id: "newcastle", name: "Newcastle", x: 70, y: 20, width: 25, height: 25 },
    { id: "wollongong", name: "Wollongong", x: 60, y: 70, width: 25, height: 25 },
    { id: "penrith", name: "Penrith", x: 15, y: 35, width: 20, height: 20 },
    { id: "gosford", name: "Gosford", x: 60, y: 30, width: 20, height: 20 },
    { id: "bathurst", name: "Bathurst", x: 20, y: 15, width: 20, height: 20 },
    { id: "wagga", name: "Wagga Wagga", x: 20, y: 80, width: 20, height: 20 },
    { id: "albury", name: "Albury", x: 30, y: 90, width: 20, height: 20 },
    { id: "tamworth", name: "Tamworth", x: 40, y: 10, width: 20, height: 20 },
  ]

  return (
    <div className="relative h-full w-full bg-gray-50">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        {/* NSW outline - simplified */}
        <path
          d="M5,20 C10,10 30,5 50,5 C70,5 90,15 95,30 C100,45 95,70 85,85 C75,95 50,95 30,90 C10,85 0,60 5,20 Z"
          fill="#f9fafb"
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />

        {/* Render each suburb as a rectangle */}
        {mockSuburbs.map((suburb) => (
          <rect
            key={suburb.id}
            x={suburb.x}
            y={suburb.y}
            width={suburb.width}
            height={suburb.height}
            rx="2"
            fill={selectedSuburbId === suburb.id ? "#ef4444" : hoveredSuburb === suburb.id ? "#fecaca" : "#fee2e2"}
            stroke={selectedSuburbId === suburb.id ? "#b91c1c" : "#ef4444"}
            strokeWidth="0.5"
            onClick={() => onSuburbSelect(suburb.id)}
            onMouseEnter={() => setHoveredSuburb(suburb.id)}
            onMouseLeave={() => setHoveredSuburb(null)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Suburb labels */}
        {mockSuburbs.map((suburb) => (
          <text
            key={`label-${suburb.id}`}
            x={suburb.x + suburb.width / 2}
            y={suburb.y + suburb.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="2"
            fill={selectedSuburbId === suburb.id ? "white" : "#111827"}
            pointerEvents="none"
          >
            {suburb.name}
          </text>
        ))}
      </svg>

      <div className="absolute bottom-2 right-2 rounded bg-white p-2 text-xs text-gray-500 shadow-sm">
        This is a simplified map for demonstration purposes.
      </div>
    </div>
  )
}
