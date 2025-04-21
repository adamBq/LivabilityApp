"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { findMatchingSuburbs } from "@/lib/api"

const questions = [
  {
    id: "budget",
    question: "What is your budget for housing?",
    options: [
      { value: "low", label: "Under $500,000" },
      { value: "medium", label: "$500,000 - $1,000,000" },
      { value: "high", label: "$1,000,000 - $2,000,000" },
      { value: "very-high", label: "Over $2,000,000" },
    ],
  },
  {
    id: "commute",
    question: "How important is commute time to you?",
    options: [
      { value: "not-important", label: "Not important" },
      { value: "somewhat-important", label: "Somewhat important" },
      { value: "important", label: "Important" },
      { value: "very-important", label: "Very important" },
    ],
  },
  {
    id: "safety",
    question: "How important is safety to you?",
    options: [
      { value: "not-important", label: "Not important" },
      { value: "somewhat-important", label: "Somewhat important" },
      { value: "important", label: "Important" },
      { value: "very-important", label: "Very important" },
    ],
  },
  {
    id: "schools",
    question: "How important are good schools to you?",
    options: [
      { value: "not-important", label: "Not important" },
      { value: "somewhat-important", label: "Somewhat important" },
      { value: "important", label: "Important" },
      { value: "very-important", label: "Very important" },
    ],
  },
  {
    id: "lifestyle",
    question: "What type of lifestyle do you prefer?",
    options: [
      { value: "urban", label: "Urban - I love the city life" },
      { value: "suburban", label: "Suburban - I want space but close to amenities" },
      { value: "rural", label: "Rural - I want peace and quiet" },
      { value: "coastal", label: "Coastal - I want to be near the beach" },
    ],
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<any[] | null>(null)

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Get results
      // In a real app, this would call the API with all the answers
      const matchingSuburbs = findMatchingSuburbs(answers)
      setResults(matchingSuburbs)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResults(null)
  }

  const currentQuestionData = questions[currentQuestion]
  const currentAnswer = answers[currentQuestionData?.id] || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Find Your Ideal Suburb</h1>
        <p className="mt-2 text-gray-600">
          Answer a few questions and we&apos;ll recommend the best suburbs for you in NSW.
        </p>
      </div>

      {!results ? (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex justify-between text-sm font-medium text-gray-500">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>

          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-xl text-red-600">{currentQuestionData.question}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
                {currentQuestionData.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center rounded-lg border p-4 transition-colors ${
                      currentAnswer === option.value
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-200 hover:bg-red-50/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <Label htmlFor={option.value} className="flex w-full cursor-pointer items-center justify-between">
                      <span>{option.label}</span>
                      {currentAnswer === option.value && <Check className="h-5 w-5 text-red-600" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} disabled={!currentAnswer} className="bg-red-600 hover:bg-red-700">
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "See Results"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <Card className="mb-8 border-red-200 shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-xl text-red-600">Your Ideal Suburbs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-600">
                Based on your preferences, we&apos;ve found these suburbs that match your criteria:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((suburb) => (
                  <div
                    key={suburb.id}
                    className="rounded-lg border border-red-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <h3 className="mb-2 text-lg font-medium text-red-600">{suburb.name}</h3>
                    <div className="mb-3 flex items-center">
                      <div className="mr-2 text-2xl font-bold">{suburb.score}</div>
                      <div className="text-sm text-gray-500">Livability Score</div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Match</span>
                        <span className="font-medium">{suburb.match}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Median Price</span>
                        <span className="font-medium">${suburb.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lifestyle</span>
                        <span className="font-medium">{suburb.lifestyle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 bg-gray-50 px-6 py-4">
              <Button onClick={handleRestart} className="bg-red-600 hover:bg-red-700">
                Take the Quiz Again
              </Button>
            </CardFooter>
          </Card>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-gray-600">
              Want to explore these suburbs in more detail? Visit our{" "}
              <a href="/map" className="font-medium text-red-600 hover:underline">
                interactive map
              </a>{" "}
              or{" "}
              <a href="/compare" className="font-medium text-red-600 hover:underline">
                compare them side by side
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
