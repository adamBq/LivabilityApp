"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSuburbData, getPropertyData } from "@/lib/api"
import toast from "react-hot-toast"
import {
  ShieldCheck,
  CloudRainWind,
  Train,
  Users,
  // Loader2,
} from "lucide-react"

type CompareMode = "suburb" | "property"

interface LivabilityBreakdown {
  crimeScore: number;
  weatherScore: number;
  familyScore: number;
  transportScore: number;
}

interface ComparisonItem {
  name: string;
  overallScore: number;
  breakdown: LivabilityBreakdown;
  income: number;
  population: number;
}

export default function ComparePage() {
  const [selectedSuburbs, setSelectedSuburbs] = useState<ComparisonItem[]>([])
  const [selectedProperties, setSelectedProperties] = useState<ComparisonItem[]>([])
  const [mode, setMode] = useState<CompareMode>("suburb")
  const [searchQuery, setSearchQuery] = useState("")

  const [important, setImportant] = useState({
    crime: true,
    weather: true,
    transport: true,
    family: true,
  })

  const [suburbHistory, setSuburbHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('suburbHistory') || '[]');
  })
  const [propertyHistory, setPropertyHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('propertyHistory') || '[]');
  })

  const selectedHistory = mode === 'suburb' ? suburbHistory : propertyHistory
  const selectedItems = mode === "suburb" ? selectedSuburbs : selectedProperties;
  let loading = false;

  useEffect(() => {
    localStorage.setItem('suburbHistory', JSON.stringify(suburbHistory));
  }, [suburbHistory]);
  
  useEffect(() => {
    localStorage.setItem('propertyHistory', JSON.stringify(propertyHistory));
  }, [propertyHistory]);

  function buildWeights(selections: Record<string, boolean>) {
    return {
      crime: selections.crime ? 1 : 0.5,
      weather: selections.weather ? 1 : 0.5,
      publicTransportation: selections.transport ? 1 : 0.5,
      familyDemographics: selections.family ? 1 : 0.5,
    }
  }

  const handleSearch = async (item: string) => {
    if (loading) {
      toast.error('Already searching')
      return
    }

    if (item.trim().length === 0) {
      toast.error("No input");
      return;
    }
  
    const input = item.trim();
  
    const isSuburb = mode === "suburb";
  
    const selectedItems = isSuburb ? selectedSuburbs : selectedProperties;
    const setSelectedItems = isSuburb ? setSelectedSuburbs : setSelectedProperties;
    const fetchData = isSuburb ? getSuburbData : getPropertyData

    if (mode === 'suburb' && input.split(' ').length > 3) {
      toast.error("Please enter a valid suburb")
      return
    }
    else if (mode === 'property' && input.split(' ').length < 3) {
      toast.error("Please enter a valid address")
      return
    }
    const currentMode = isSuburb ? "Suburb" : "Property";
  
    if (selectedItems.length >= 6) {
      toast.error("Compare limit reached");
      return;
    }
  
    if (
      selectedItems.some((s) => s.name.toLowerCase() === input.toLowerCase())
    ) {
      toast.error(`Duplicate ${currentMode.toLowerCase()}`);
      return;
    }

    loading = true;
    const weights = buildWeights(important);
  
    const promise = fetchData(input, weights);
  
    toast.promise(promise, {
      loading: `Fetching ${currentMode.toLowerCase()} data...`,
      success: (data) => {
        setSelectedItems([...selectedItems, data]);
        updateHistory(data.name);
        loading = false;
        return `${currentMode} added!`;
      },
      error: () => {
        loading = false;
        return `Unable to generate score`;
      }
    });
  };

  const handleRemove = (item: string) => {
    if (mode === 'suburb') 
      setSelectedSuburbs(selectedSuburbs.filter((s) => s.name.toLowerCase() !== item.toLowerCase()))
    else
      setSelectedProperties(selectedProperties.filter((s) => s.name.toLowerCase() !== item.toLowerCase()))

  }

  const updateHistory = (item: string) => {
    if (selectedHistory.some((s: string) => s.toLowerCase() === item.toLowerCase())) return

    const setSelectedHistory = mode === 'suburb' ? setSuburbHistory : setPropertyHistory

    setSelectedHistory([item, ...selectedHistory].slice(0, 6))
  }

  const searchHistoryItem = (item: string) => {
    setSearchQuery(item);
    handleSearch(item)
  }

  // const handleWeightChange = (key: keyof typeof weights, value: number) => {
  //   setWeights((prev: any) => ({ ...prev, [key]: value }));
  // };

  const factors = [
    { key: "crime", Icon: ShieldCheck, label: "Safety" },
    { key: "weather", Icon: CloudRainWind, label: "Weather" },
    { key: "transport", Icon: Train, label: "Public Transport" },
    { key: "family", Icon: Users, label: "Family & Community" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-600">Compare Suburbs</h1>
        <p className="mt-2 text-gray-600">
          Select up to three suburbs or properties to compare their livability scores and features side by side.
        </p>
        <div className="w-fit mt-2 flex z-[1000] right-2 top-2 space-x-1 rounded bg-white/90 p-1 shadow">
          {[
            { key: "suburb", label: "Suburb" },
            { key: "property", label: "Property" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setMode(option.key as CompareMode)}
              className={`rounded px-2 py-1 text-xs font-medium ${
                mode === option.key ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={`Search for a ${mode === "suburb" ? "suburb" : "property"} to compare`}
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value)}}
                className="border-red-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery)
                  }
                }}
              />
              <Button onClick={() => handleSearch(searchQuery)} className="bg-red-600 hover:bg-red-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedItems.map((item) => (
                <Card key={item.name} className="border-red-200 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between bg-red-50 pb-2">
                    <CardTitle className="text-red-600">{item.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.name)}
                      className="h-8 w-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-lg font-medium">Livability Score</span>
                      <span className="text-2xl font-bold text-red-600">{item.overallScore}/10</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Safety</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-red-600"
                              style={{ width: `${item.breakdown.crimeScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{item.breakdown.crimeScore}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Weather</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-red-600"
                              style={{ width: `${item.breakdown.weatherScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{item.breakdown.weatherScore}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Family Friendly</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-red-600"
                              style={{ width: `${item.breakdown.familyScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{item.breakdown.familyScore}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Public Transport</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-red-600"
                              style={{ width: `${item.breakdown.transportScore * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{item.breakdown.transportScore}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {/* {mode === "suburb" ?
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Median House Price</span>
                          <span className="font-medium">$100,000</span>
                        </div>
                        :
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Estimated House Price</span>
                          <span className="font-medium">$100,000</span>
                        </div>
                      } */}
                      {mode === "suburb" &&
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Average Household Income</span>
                            <span className="font-medium">${item.income.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Population</span>
                            <span className="font-medium">{item.population.toLocaleString()}</span>
                          </div>
                        </>
                      }
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty placeholders for remaining slots */}
              {Array.from({ length: 6 - selectedItems.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-6 text-center"
                >
                  <div>
                    <p className="text-gray-500">Select a {mode === "suburb" ? "suburb" : "property"} to compare</p>
                    <p className="mt-2 text-sm text-gray-400">
                      {selectedItems.length === 0
                        ? "You can compare up to 3 suburbs"
                        : `${6 - selectedItems.length} more ${
                            6 - selectedItems.length === 1 ? "slot" : "slots"
                          } available`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-6 text-center">
              <h3 className="text-lg font-medium text-red-600">No {mode === "suburb" ? "Suburbs" : "Properties"} Selected</h3>
              <p className="mt-2 text-gray-500">Search and select {mode === "suburb" ? "suburbs" : "properties"} above to start comparing them side by side.</p>
              <p className="mt-1 text-sm text-gray-400">You can compare up to 6 {mode === "suburb" ? "suburbs" : "properties"} at once.</p>
            </div>
          )}
        </div>
        <div className="order-1 lg:order-2 flex flex-col gap-[1em]">
          <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-600">Search History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedHistory.length === 0 ? (
                <p className="text-sm text-gray-600">
                  When you search for suburbs your <strong>history</strong> will be displayed here
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {selectedHistory.map((item: string) => (
                    <li key={item} className="py-2">
                      <button onClick={() => searchHistoryItem(item)} className="w-full text-left hover:text-red-600">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-600">What&rsquo;s important</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
            <div className="mb-8 grid gap-4 md:grid-cols-1">
              {factors.map(({ key, Icon, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-lg border p-4 hover:border-red-400"
                >
                  <input
                    type="checkbox"
                    checked={important[key as keyof typeof important]}
                    onChange={(e) =>
                      setImportant({ ...important, [key]: e.target.checked })
                    }
                  />
                  <Icon className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
