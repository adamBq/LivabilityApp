"use client"

import { useState } from "react"
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
 * "important".  Unchecked factors still matter, just less (0.5).
 */
function buildWeights(selections: Record<string, boolean>) {
  return {
    crime: selections.crime ? 1 : 0.5,
    weather: selections.weather ? 1 : 0.5,
    publicTransportation: selections.transport ? 1 : 0.5,
    familyDemographics: selections.family ? 1 : 0.5,
  }
}

export default function FindSuburb() {
  const [address, setAddress] = useState("")
  const [important, setImportant] = useState({
    crime: true,
    weather: false,
    transport: false,
    family: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<
    | null
    | {
        overallScore: number
        breakdown: {
          crimeScore: number
          weatherScore: number
          transportScore: number
          familyScore: number
        }
        // full income object
        income?: Record<string, any>
      }
  >(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchLivability() {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const body = {
        address,
        weights: buildWeights(important),
      }

      // Livability score POST
      const livRes = await fetch(
        "https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/livability_score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
          },
          body: JSON.stringify(body),
        }
      )
      if (!livRes.ok) throw new Error("Failed to retrieve livability score")
      const livData = await livRes.json()

      console.log(livData)

      // Income lookup via GET (raw suburb name to preserve spaces)
      let incomeData: Record<string, any> | undefined
      try {
        const suburbName = address.split(",")[1]?.trim() || address.trim()
        const incomeUrl =
          `https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/family/income/${suburbName}`
        const incomeRes = await fetch(incomeUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
          },
        })
        if (incomeRes.ok) {
          incomeData = await incomeRes.json()
        }
      } catch (err) {
        console.warn("Income lookup failed:", err)
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

      <p className="mb-4 font-semibold text-gray-700">What matters most to you?</p>
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {/* Safety */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-4 shadow-sm hover:border-red-400">
          <input
            type="checkbox"
            checked={important.crime}
            onChange={(e) => setImportant({ ...important, crime: e.target.checked })}
          />
          <ShieldCheck className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">Safety</span>
        </label>

        {/* Weather */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-4 shadow-sm hover:border-red-400">
          <input
            type="checkbox"
            checked={important.weather}
            onChange={(e) => setImportant({ ...important, weather: e.target.checked })}
          />
          <CloudRainWind className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">Weather</span>
        </label>

        {/* Transport */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-4 shadow-sm hover:border-red-400">
          <input
            type="checkbox"
            checked={important.transport}
            onChange={(e) => setImportant({ ...important, transport: e.target.checked })}
          />
          <Train className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">Public Transport</span>
        </label>

        {/* Family */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-4 shadow-sm hover:border-red-400">
          <input
            type="checkbox"
            checked={important.family}
            onChange={(e) => setImportant({ ...important, family: e.target.checked })}
          />
          <Users className="h-5 w-5 text-red-600" />
          <span className="text-sm font-medium text-gray-700">Family & Community</span>
        </label>
      </div>

      <Button
        disabled={isLoading || !address}
        className="mb-12 bg-red-600 hover:bg-red-700"
        onClick={fetchLivability}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
          </>
        ) : (
          "Get My Score"
        )}
      </Button>

      {error && (
        <p className="mb-8 rounded bg-red-50 p-4 text-center text-sm text-red-700 shadow-inner">
          {error}
        </p>
      )}

      {result && (
        <>
          <Card className="mb-8 border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-3xl text-red-600">
                Overall Score: {result.overallScore} / 10
              </CardTitle>
              <CardDescription>Higher is better</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Safety</p>
                <p className="text-xl font-semibold text-gray-700">
                  {result.breakdown.crimeScore}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Extreme Weather</p>
                <p className="text-xl font-semibold text-gray-700">
                  {result.breakdown.weatherScore}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Transport</p>
                <p className="text-xl font-semibold text-gray-700">
                  {result.breakdown.transportScore}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Family & Community</p>
                <p className="text-xl font-semibold text-gray-700">
                  {result.breakdown.familyScore}
                </p>
              </div>
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
