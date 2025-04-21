"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  MapPin,
  BarChart2,
  HelpCircle,
  ShieldCheck,
  Train,
  Sun,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState("")

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?address=${encodeURIComponent(searchInput.trim())}`)
    }
  }

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
            Discover the most livable suburbs in New South Wales based on your
            preferences for safety, transportation, weather, and family
            demographics.
          </p>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter address or suburb"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <Button
              size="lg"
              className="bg-red-600 px-6 py-3 text-lg hover:bg-red-700"
              onClick={handleSearch}
              disabled={!searchInput.trim()}
            >
              Search
            </Button>
          </div>

          <div className="mt-16 animate-bounce">
            <button
              onClick={() => {
                document
                  .getElementById("about-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }}
              className="m-auto flex flex-col items-center text-gray-500 transition-colors hover:text-red-600"
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
            <h2 className="mb-4 text-4xl font-bold text-red-600">
              About NSW Livability Explorer
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Our mission is to help home buyers, investors, real estate agents,
              and insurers understand how livable each suburb in New South
              Wales is.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Interactive Map</h3>
              <p className="text-gray-600">
                Explore our interactive map of NSW that outlines all suburbs.
                Click on any suburb to see its livability score and detailed
                data about crime rates, weather, public transportation, and
                family demographics.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <BarChart2 className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Compare Suburbs</h3>
              <p className="text-gray-600">
                Use our comparison tool to evaluate up to three suburbs side by
                side. Compare livability scores, housing prices, and other
                important statistics to make an informed decision.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Find Your Ideal Suburb</h3>
              <p className="text-gray-600">
                Take our quiz to discover your dream suburb. Answer a few
                questions about your preferences, and we&aposll recommend the most
                suitable suburbs for you in NSW.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="mb-8 text-lg text-gray-600">
              Currently available for NSW, with plans to expand to all of
              Australia in the future.
            </p>
            <Button asChild size="lg" className="bg-red-600 px-8 hover:bg-red-700">
              <Link href="/map">Explore the Map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Livability Score Explanation Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-red-600">
              What Is the Livability Score?
            </h2>
            <p className="mx-auto max-w-4xl text-lg text-gray-600">
              A single 0-10 score that captures how comfortable life feels in
              any NSW suburb or property <br/>— powered by the freshest public data.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {/* Safety */}
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <CardTitle className="text-red-600">Safety</CardTitle>
                <CardDescription>Latest crime statistics</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-gray-600">
                We ingest monthly BOSCAR reports to gauge offence rates and
                weight violent and property crime separately, giving you a clear
                sense of security.
              </CardContent>
            </Card>

            {/* Transport */}
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Train className="h-7 w-7" />
                </div>
                <CardTitle className="text-red-600">Public Transport</CardTitle>
                <CardDescription>Access &amp; frequency</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-gray-600">
              Using Google Maps transit data, we measure how many bus, train,
                light‑rail and ferry services you can reach within a
                10‑minute walk, plus their peak‑hour frequency.
              </CardContent>
            </Card>

            {/* Weather */}
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Sun className="h-7 w-7" />
                </div>
                <CardTitle className="text-red-600">Climate Comfort</CardTitle>
                <CardDescription>Sunshine &amp; rainfall</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-gray-600">
              We track severe storms, flood‑prone zones and other climate
                hazards to score how often extreme events disrupt everyday
                life.
              </CardContent>
            </Card>

            {/* Family & Community */}
            <Card className="border-red-200 shadow-md">
              <CardHeader className="bg-red-50">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-red-600">Family &amp; Community</CardTitle>
                <CardDescription>Population &amp; income</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-gray-600">
                ABS census figures reveal median household income, family size
                and age mix, helping you find suburbs with the vibe you want.
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Each factor is normalised and weighted, then blended into an
              easy‑to‑compare score — so you can focus on lifestyle, not
              spreadsheets.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
