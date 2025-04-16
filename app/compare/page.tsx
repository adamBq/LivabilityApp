"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSuburbsByName, getSuburbData } from "@/lib/api"

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSuburbs, setSelectedSuburbs] = useState<any[]>([])

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      // In a real app, this would call the API
      const results = getSuburbsByName(searchQuery)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  // Handle suburb selection
  const handleSelectSuburb = (suburbId: string) => {
    if (selectedSuburbs.length >= 3) return

    // Check if already selected
    if (selectedSuburbs.some((s) => s.id === suburbId)) return

    // In a real app, this would call the API
    const suburbData = getSuburbData(suburbId)
    setSelectedSuburbs([...selectedSuburbs, suburbData])
    setSearchResults([])
    setSearchQuery("")
  }

  // Handle suburb removal
  const handleRemoveSuburb = (suburbId: string) => {
    setSelectedSuburbs(selectedSuburbs.filter((s) => s.id !== suburbId))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-600">Compare Suburbs</h1>
        <p className="mt-2 text-gray-600">
          Select up to three suburbs to compare their livability scores and features side by side.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search for a suburb to compare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-red-200"
          />
          <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-2 rounded-md border border-red-200 bg-white p-2">
            <h3 className="mb-2 font-medium text-red-600">Search Results</h3>
            <ul className="divide-y divide-gray-100">
              {searchResults.map((suburb) => (
                <li key={suburb.id} className="py-2">
                  <button
                    onClick={() => handleSelectSuburb(suburb.id)}
                    className="w-full text-left hover:text-red-600"
                    disabled={selectedSuburbs.length >= 3}
                  >
                    {suburb.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedSuburbs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedSuburbs.map((suburb) => (
            <Card key={suburb.id} className="border-red-200 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between bg-red-50 pb-2">
                <CardTitle className="text-red-600">{suburb.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSuburb(suburb.id)}
                  className="h-8 w-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-lg font-medium">Livability Score</span>
                  <span className="text-2xl font-bold text-red-600">{suburb.score}/100</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Safety</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-600"
                          style={{ width: `${suburb.metrics.safety}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{suburb.metrics.safety}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Public Transport</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-600"
                          style={{ width: `${suburb.metrics.transport}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{suburb.metrics.transport}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Weather</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-600"
                          style={{ width: `${suburb.metrics.weather}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{suburb.metrics.weather}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Family Friendly</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-600"
                          style={{ width: `${suburb.metrics.family}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{suburb.metrics.family}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Median House Price</span>
                    <span className="font-medium">${suburb.housePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Population</span>
                    <span className="font-medium">{suburb.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Schools</span>
                    <span className="font-medium">{suburb.schools}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty placeholders for remaining slots */}
          {Array.from({ length: 3 - selectedSuburbs.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex aspect-[3/4] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-6 text-center"
            >
              <div>
                <p className="text-gray-500">Select a suburb to compare</p>
                <p className="mt-2 text-sm text-gray-400">
                  {selectedSuburbs.length === 0
                    ? "You can compare up to 3 suburbs"
                    : `${3 - selectedSuburbs.length} more ${
                        3 - selectedSuburbs.length === 1 ? "slot" : "slots"
                      } available`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-6 text-center">
          <h3 className="text-lg font-medium text-red-600">No Suburbs Selected</h3>
          <p className="mt-2 text-gray-500">Search and select suburbs above to start comparing them side by side.</p>
          <p className="mt-1 text-sm text-gray-400">You can compare up to 3 suburbs at once.</p>
        </div>
      )}
    </div>
  )
}
