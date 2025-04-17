"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getSuburbData, getSuburbsByName } from "@/lib/api"
import SimplifiedMap from "@/components/simplified-map"

export function MapExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSuburb, setSelectedSuburb] = useState<any>(null)
  const [weights, setWeights] = useState({
    crime: 25,
    weather: 25,
    publicTransportation: 25,
    familyDemographics: 25,
  })

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

  // Handle suburb selection from map
  const handleSuburbSelect = (suburbId: string) => {
    // In a real app, this would call the API with the current weights
    const suburbData = getSuburbData(suburbId, weights)
    setSelectedSuburb(suburbData)
  }

  // Handle weight changes
  const handleWeightChange = (category: keyof typeof weights, value: number) => {
    setWeights((prev) => {
      const newWeights = { ...prev, [category]: value }

      // If we have a selected suburb, update its score based on new weights
      if (selectedSuburb) {
        // In a real app, this would call the API with the updated weights
        const updatedSuburb = getSuburbData(selectedSuburb.id, newWeights)
        setSelectedSuburb(updatedSuburb)
      }

      return newWeights
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="order-2 lg:order-1">
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search for a suburb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-red-200"
          />
          <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mb-4 rounded-md border border-red-200 bg-white p-2">
            <h3 className="mb-2 font-medium text-red-600">Search Results</h3>
            <ul className="divide-y divide-gray-100">
              {searchResults.map((suburb) => (
                <li key={suburb.id} className="py-2">
                  <button onClick={() => handleSuburbSelect(suburb.id)} className="w-full text-left hover:text-red-600">
                    {suburb.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-red-200 bg-white">
          <SimplifiedMap onSuburbSelect={handleSuburbSelect} selectedSuburbId={selectedSuburb?.id} />
        </div>
      </div>

      <div className="order-1 lg:order-2 flex flex-col">
        <Card className="border-red-200 shadow-md mb-6">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600">Customize Weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="crime-weight">Crime</Label>
                <span className="text-sm font-medium">{weights.crime}%</span>
              </div>
              <Slider
                id="crime-weight"
                min={0}
                max={100}
                step={5}
                value={[weights.crime]}
                onValueChange={(value) => handleWeightChange("crime", value[0])}
                className="[&>span:first-child]:bg-red-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="weather-weight">Weather</Label>
                <span className="text-sm font-medium">{weights.weather}%</span>
              </div>
              <Slider
                id="weather-weight"
                min={0}
                max={100}
                step={5}
                value={[weights.weather]}
                onValueChange={(value) => handleWeightChange("weather", value[0])}
                className="[&>span:first-child]:bg-red-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="transport-weight">Public Transportation</Label>
                <span className="text-sm font-medium">{weights.publicTransportation}%</span>
              </div>
              <Slider
                id="transport-weight"
                min={0}
                max={100}
                step={5}
                value={[weights.publicTransportation]}
                onValueChange={(value) => handleWeightChange("publicTransportation", value[0])}
                className="[&>span:first-child]:bg-red-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="family-weight">Family Demographics</Label>
                <span className="text-sm font-medium">{weights.familyDemographics}%</span>
              </div>
              <Slider
                id="family-weight"
                min={0}
                max={100}
                step={5}
                value={[weights.familyDemographics]}
                onValueChange={(value) => handleWeightChange("familyDemographics", value[0])}
                className="[&>span:first-child]:bg-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {selectedSuburb && (
          <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-600">{selectedSuburb.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium">Livability Score</span>
                <span className="text-2xl font-bold text-red-600">{selectedSuburb.score}/100</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-gray-50 p-2">
                    <div className="text-sm text-gray-500">Crime Rate</div>
                    <div className="font-medium">{selectedSuburb.crimeRate}</div>
                  </div>
                  <div className="rounded-md bg-gray-50 p-2">
                    <div className="text-sm text-gray-500">Weather</div>
                    <div className="font-medium">{selectedSuburb.weather}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-gray-50 p-2">
                    <div className="text-sm text-gray-500">Public Transport</div>
                    <div className="font-medium">{selectedSuburb.publicTransport}</div>
                  </div>
                  <div className="rounded-md bg-gray-50 p-2">
                    <div className="text-sm text-gray-500">Family Friendly</div>
                    <div className="font-medium">{selectedSuburb.familyFriendly}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
