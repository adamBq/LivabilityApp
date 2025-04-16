"use client"

import Link from "next/link"
import { ArrowDown, MapPin, BarChart2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-red-600 md:text-6xl lg:text-7xl">
            Find Your Perfect Suburb in NSW
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Discover the most livable suburbs in New South Wales based on your preferences for safety, transportation,
            weather, and family demographics.
          </p>
          <Button asChild size="lg" className="bg-red-600 px-8 py-6 text-lg hover:bg-red-700">
            <Link href="/map">Get Started Now</Link>
          </Button>

          <div className="mt-16 animate-bounce">
            <button
              onClick={() => {
                document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="flex flex-col items-center text-gray-500 transition-colors hover:text-red-600"
            >
              <span className="mb-2 text-sm">Learn More</span>
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-red-600">About NSW Livability Explorer</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Our mission is to help home buyers, investors, real estate agents, and insurers understand how livable
              each suburb in New South Wales is.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Interactive Map</h3>
              <p className="text-gray-600">
                Explore our interactive map of NSW that outlines all suburbs. Click on any suburb to see its livability
                score and detailed data about crime rates, weather, public transportation, and family demographics.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Compare Suburbs</h3>
              <p className="text-gray-600">
                Use our comparison tool to evaluate up to three suburbs side by side. Compare livability scores, housing
                prices, and other important statistics to make an informed decision.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Find Your Ideal Suburb</h3>
              <p className="text-gray-600">
                Take our quiz to discover your dream suburb. Answer a few questions about your preferences, and we'll
                recommend the most suitable suburbs for you in NSW.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="mb-8 text-lg text-gray-600">
              Currently available for NSW, with plans to expand to all of Australia in the future.
            </p>
            <Button asChild size="lg" className="bg-red-600 px-8 hover:bg-red-700">
              <Link href="/map">Explore the Map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-red-600">Our Features</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Discover all the tools we offer to help you find your perfect suburb
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-600">Explore the Map</CardTitle>
                <CardDescription>Interactive map of NSW with detailed suburb information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Click on any suburb to see its livability score and details.</p>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/map">Explore Map</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-600">Compare Suburbs</CardTitle>
                <CardDescription>Side-by-side comparison of up to three suburbs</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Compare livability scores, amenities, and more between suburbs.</p>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/compare">Compare Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-600">Find Your Ideal Suburb</CardTitle>
                <CardDescription>Take our quiz to discover your perfect match</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Answer a few questions and we'll recommend suburbs that match your lifestyle.</p>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href="/quiz">Take the Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
