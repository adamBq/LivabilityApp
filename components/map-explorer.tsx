"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { idw } from "@/components/simplified-map"

/* client‑only Leaflet map */
const SimplifiedMap = dynamic(() => import("@/components/simplified-map"), { ssr: false })

interface Item {
  name: string
  lat: number
  lon: number
  id?: string      // present when it’s one of our built‑in suburbs
  score: number
}

export default function MapExplorer() {
  /* ───────── state ───────── */
  const [query, setQuery]        = useState("")
  const [results, setResults]    = useState<Item[]>([])
  const [history, setHistory]    = useState<Item[]>([])
  const [selectedId, setSel]     = useState<string | undefined>()
  const [pin, setPin]            = useState<{lat:number;lon:number;score:number}|null>(null)

  /* ───────── search helpers ───────── */
  const geocode = async (text: string): Promise<Item|null> => {
    const u = new URL("https://nominatim.openstreetmap.org/search")
    u.searchParams.set("format", "json")
    u.searchParams.set("countrycodes", "au")
    u.searchParams.set("limit", "1")
    u.searchParams.set("q", text)
    const r = await fetch(u.toString(), { headers:{ "User-Agent":"livability-app" } })
    const j = await r.json()
    if (!j.length) return null
    const first = j[0]
    const sc = idw(+first.lat, +first.lon).value ?? 0
    return { name: first.display_name, lat:+first.lat, lon:+first.lon, score:sc }
  }

  const search = async () => {
    if (query.trim().length < 3) return setResults([])
    // try local subset (you can wire your own function here)
    // const local = getSuburbsByName(query).map((s:any)=>({...s, score:s.score})) as Item[]
    const local: Item[] = []
    if (local.length) return setResults(local)

    const g = await geocode(query)
    setResults(g ? [g] : [])
  }

  const select = (item: Item) => {
    if (item.id) setSel(item.id)
    setPin({ lat:item.lat, lon:item.lon, score:item.score })
    if (!history.find(h=>h.name===item.name)) setHistory([item, ...history])
  }

  /* ───────── UI ───────── */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* LEFT ─ search + map */}
      <div className="order-2 lg:order-1">
        <div className="mb-4 flex items-center gap-2">
          <Input
            placeholder="Search for a suburb…"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && search()}
            className="border-red-200"
          />
          <Button onClick={search} className="bg-red-600 hover:bg-red-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {results.length>0 && (
          <div className="mb-4 rounded-md border border-red-200 bg-white p-2">
            <h3 className="mb-2 font-medium text-red-600">Search Results</h3>
            <ul className="divide-y divide-gray-100">
              {results.map(r=>(
                <li key={r.name} className="py-2">
                  <button onClick={()=>select(r)} className="w-full text-left hover:text-red-600">
                    {r.name} <span className="text-gray-500">— {r.score.toFixed(2)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="aspect-[4/3] overflow-hidden rounded-lg border border-red-200 bg-white">
          <SimplifiedMap selectedSuburbId={selectedId} pin={pin||undefined} />
        </div>
      </div>

      {/* RIGHT ─ history */}
      <div className="order-1 lg:order-2 flex flex-col">
        <Card className="border-red-200 shadow-md">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600">Search History</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {history.length===0 ? (
              <p className="text-sm text-gray-600">
                When you search for suburbs your <strong>history</strong> will be displayed here
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {history.map(h=>(
                  <li key={h.name} className="py-2">
                    <button onClick={()=>select(h)} className="w-full text-left hover:text-red-600">
                      {h.name} <span className="text-gray-500">— {h.score.toFixed(2)}</span>
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
