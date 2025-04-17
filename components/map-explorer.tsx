"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSuburbsByName } from "@/lib/api"

// 🧠 client‑only map
const SimplifiedMap = dynamic(() => import("@/components/simplified-map"), { ssr: false })

export function MapExplorer() {
  /* ───────── state ───────── */
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSuburb, setSelectedSuburb] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  /* ───────── search helpers ───────── */
  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setSearchResults(getSuburbsByName(searchQuery))
    } else {
      setSearchResults([])
    }
  }

  const selectSuburb = (suburb: any) => {
    setSelectedSuburb(suburb)
    // push to history top if not already present
    setHistory((prev) => {
      if (prev.find((h) => h.id === suburb.id)) return prev
      return [suburb, ...prev]
    })
  }

  /* ───────── UI ───────── */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* map + search area */}
      <div className="order-2 lg:order-1">
        {/* search bar */}
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search for a suburb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-red-200"
          />
          <Button onClick={handleSearch} className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* live results list */}
        {searchResults.length > 0 && (
          <div className="mb-4 rounded-md border border-red-200 bg-white p-2">
            <h3 className="mb-2 font-medium text-red-600">Search Results</h3>
            <ul className="divide-y divide-gray-100">
              {searchResults.map((suburb) => (
                <li key={suburb.id} className="py-2">
                  <button
                    onClick={() => selectSuburb(suburb)}
                    className="w-full text-left hover:text-red-600"
                  >
                    {suburb.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* map */}
        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-red-200 bg-white">
          <SimplifiedMap
            onSuburbSelect={(id) => {
              // keep highlight logic consistent
              const s = searchResults.find((r) => r.id === id) || history.find((h) => h.id === id)
              if (s) selectSuburb(s)
            }}
            selectedSuburbId={selectedSuburb?.id}
          />
        </div>
      </div>

      {/* history panel (right column) */}
      <div className="order-1 lg:order-2 flex flex-col">
        <Card className="border-red-200 shadow-md">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600">Search History</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {history.length === 0 ? (
              <p className="text-sm text-gray-600">
                When you search for suburbs your <strong>history</strong> will be displayed here
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {history.map((suburb) => (
                  <li key={suburb.id} className="py-2">
                    <button
                      onClick={() => selectSuburb(suburb)}
                      className="w-full text-left hover:text-red-600"
                    >
                      {suburb.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
