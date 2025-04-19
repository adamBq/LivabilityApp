// app/search/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  ShieldCheck,
  CloudRainWind,
  Train,
  Users,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**  
 * Simple helper that bumps a factor's weight to 1 when the user marks it as
 * "important". Unchecked factors still matter, just less (0.5).
 */
function buildWeights(selections: Record<string, boolean>) {
  return {
    crime: selections.crime ? 1 : 0.5,
    weather: selections.weather ? 1 : 0.5,
    publicTransportation: selections.transport ? 1 : 0.5,
    familyDemographics: selections.family ? 1 : 0.5,
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [address, setAddress] = useState("")
  const [important, setImportant] = useState({
    crime: true,
    weather: false,
    transport: false,
    family: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    overallScore: number
    breakdown: {
      crimeScore: number
      weatherScore: number
      transportScore: number
      familyScore: number
    }
    income?: Record<string, any>
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // On mount, read ?address=... and fire fetch
  useEffect(() => {
    const param = searchParams.get("address")
    if (param) {
      const decoded = decodeURIComponent(param)
      setAddress(decoded)
      fetchLivability(decoded)
    }
  }, [searchParams.toString()])

  async function fetchLivability(addr: string = address) {
    if (!addr) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // 1) POST livability score
      const livRes = await fetch(
        "https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/livability_score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
          },
          body: JSON.stringify({
            address: addr,
            weights: buildWeights(important),
          }),
        }
      )
      if (!livRes.ok) throw new Error("Failed to retrieve livability score")
      const livData = await livRes.json()

      // 2) GET income
      let incomeData: Record<string, any> | undefined
      try {
        const suburb = addr.split(",")[1]?.trim() || addr.trim()
        const incRes = await fetch(
          `https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/family/income/${suburb}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
            },
          }
        )
        if (incRes.ok) incomeData = await incRes.json()
      } catch {
        console.warn("Income lookup failed")
      }

      setResult({
        overallScore: livData.overallScore,
        breakdown: {
          crimeScore: livData.breakdown.crimeScore,
          weatherScore: livData.breakdown.weatherScore,
          transportScore: livData.breakdown.transportScore,
          familyScore: livData.breakdown.familyScore,
        },
        income: incomeData,
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-20">
      <h1 className="mb-8 text-center text-4xl font-bold text-red-600">
        Livability Search
      </h1>

      {/* Address input */}
      <label className="mb-4 block text-lg font-semibold text-gray-700">
        Address or Suburb
      </label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="15 Jersey Road, Strathfield"
        className="mb-8 w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
      />

      {/* Criteria toggles */}
      <p className="mb-4 font-semibold text-gray-700">
        What matters most to you?
      </p>
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          ["crime", <ShieldCheck className="h-5 w-5 text-red-600" />, "Safety"],
          ["weather", <CloudRainWind className="h-5 w-5 text-red-600" />, "Weather"],
          ["transport", <Train className="h-5 w-5 text-red-600" />, "Public Transport"],
          ["family", <Users className="h-5 w-5 text-red-600" />, "Family & Community"],
        ].map(([key, icon, label]) => (
          <label
            key={key as string}
            className="flex items-center gap-2 rounded-lg border p-4 hover:border-red-400"
          >
            <input
              type="checkbox"
              checked={(important as any)[key as string]}
              onChange={(e) =>
                setImportant({ ...important, [key as string]: e.target.checked })
              }
            />
            {icon}
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Manual trigger, if desired */}
      <Button
        onClick={() => fetchLivability()}
        disabled={isLoading || !address}
        className="mb-12 bg-red-600 hover:bg-red-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating...
          </>
        ) : (
          "Get My Score"
        )}
      </Button>

      {error && (
        <p className="mb-8 rounded bg-red-50 p-4 text-center text-red-700">
          {error}
        </p>
      )}

      {result && (
        <>
          <Card className="mb-8 border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-3xl text-red-600">
                Overall Score: {result.overallScore.toFixed(2)} / 10
              </CardTitle>
              <CardDescription>Higher is better</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-6 pt-6">
              {Object.entries(result.breakdown).map(([k, v]) => (
                <div key={k} className="text-center">
                  <p className="text-sm text-gray-500">
                    {k.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-xl font-semibold text-gray-700">
                    {(v as number).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {result.income && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Income Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Average weekly household income:{" "}
                  <span className="font-semibold">
                    ${result.income.average_income_range}
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
