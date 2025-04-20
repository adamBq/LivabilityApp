export const dynamic = "force-dynamic";

import MapExplorer from "@/components/map-explorer"

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-600">Explore NSW Suburbs</h1>
        <p className="mt-2 text-gray-600">
          Click on any suburb on the map to see its livability score and details, or search for a specific suburb.
        </p>
      </div>

      <MapExplorer />
    </div>
  )
}
