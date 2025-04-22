"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Check, MapPin, Award, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

// your ten scenario questions array (id/ question/ options…)
import { questions } from "./questions"

// 1) Call our Next.js API which returns { weights, suburbs }
async function fetchAIRecommendations(answers: Record<string, string>) {
  const res = await fetch("/api/get-suburbs-from-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  })
  if (!res.ok) throw new Error("AI lookup failed")
  return res.json() as Promise<{
    weights: { crime: number; familyDemographics: number; weather: number }
    suburbs: string[]
  }>
}

// 2) Call your livability lambda using the URL in NEXT_PUBLIC_LIVABILITY_API_URL
async function fetchLivability(
  suburb: string,
  weights: { crime: number; familyDemographics: number; weather: number },
) {

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_LIVABILITY_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        address: `${suburb}, NSW`,
        weights
      }),
    })

    // Log status, headers, and raw body for debugging
    const text = await response.text()
    console.log(`Livability API response for ${suburb}: status=${response.status} ${response.statusText}`)
    console.log(`Livability API response headers for ${suburb}:`, Object.fromEntries(response.headers))
    console.log(`Livability API response body for ${suburb}:`, text)

    if (!response.ok) {
      // Include body in error
      throw new Error(`Failed scoring ${suburb}: status=${response.status} ${response.statusText}, body=${text}`)
    }

    // Parse JSON
    const data = JSON.parse(text) as { overallScore: number }
    return data
  } catch (error) {
    console.error(`Error calling livability API for ${suburb}:`, error)
    throw error
  }
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const q = questions[step]
  const selected = answers[q.id] || ""

  function handleAnswer(val: string) {
    setAnswers((a) => ({ ...a, [q.id]: val }))
  }

  async function handleNext() {
    if (step < questions.length - 1) {
      return setStep((s) => s + 1)
    }
    setLoading(true)
    try {
      // get weights + top 5
      const { weights, suburbs } = await fetchAIRecommendations(answers)

      // score each suburb
      const scored = await Promise.all(
        suburbs.map(async (name) => {
          const { overallScore } = await fetchLivability(name, weights)
          return { name, score: overallScore }
        }),
      )

      // pick top 3
      setResults(scored.sort((a, b) => b.score - a.score).slice(0, 3))
    } catch (e) {
      console.error(e)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handlePrev() {
    if (step > 0) setStep((s) => s - 1)
  }

  function handleRestart() {
    setStep(0)
    setAnswers({})
    setResults(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Finding Your Perfect Match</h3>
          <p className="text-gray-600">We're analyzing your preferences to find the best suburbs for you...</p>
        </div>
      </div>
    )
  }

  if (results) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Your Ideal Suburbs</h1>
          <p className="text-gray-600">Based on your preferences, here are your top matches</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {results.map((result, index) => (
            <Card
              key={result.name}
              className={`overflow-hidden border-t-4 ${
                index === 0 ? "border-t-red-600" : index === 1 ? "border-t-red-500" : "border-t-red-400"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {index === 0 && <Award className="h-5 w-5 text-red-600" />}
                      {result.name}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1" />
                        <span>Match Score</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="bg-red-50 text-red-700 font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-red-100">
                    {Math.round(result.score)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Livability Score</span>
                    <span className="font-medium">{result.score.toFixed(1)}/100</span>
                  </div>
                  <Progress
                    value={result.score}
                    className="h-2 bg-gray-100"
                    indicatorClassName={index === 0 ? "bg-red-600" : index === 1 ? "bg-red-500" : "bg-red-400"}
                  />
                </div>

                <div className="mt-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <BarChart className="h-4 w-4 text-red-500" />
                    <span>
                      {index === 0
                        ? "Perfect match for your preferences"
                        : index === 1
                          ? "Great match for your lifestyle"
                          : "Good option to consider"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleRestart} className="bg-red-600 hover:bg-red-700 text-white px-6">
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Find Your Ideal Suburb</h1>
        <p className="text-gray-600">Answer a few quick scenarios…</p>
      </div>

      <div className="mb-4 text-sm text-gray-500 flex justify-between">
        <span>
          Question {step + 1} of {questions.length}
        </span>
        <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{q.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selected} onValueChange={handleAnswer} className="space-y-3">
            {q.options.map((opt) => (
              <div
                key={opt.value}
                className={`p-4 border rounded-lg transition ${
                  selected === opt.value ? "bg-red-50 border-red-600" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                <Label htmlFor={opt.value} className="flex justify-between items-center">
                  <span>{opt.label}</span>
                  {selected === opt.value && <Check className="text-red-600" />}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
            <ChevronLeft /> Previous
          </Button>
          <Button onClick={handleNext} disabled={!selected}>
            {step < questions.length - 1 ? (
              <>
                Next <ChevronRight />
              </>
            ) : (
              "See Results"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}