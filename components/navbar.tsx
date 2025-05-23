"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Map,
  BarChart2,
  HelpCircle,
  // ① NEW — magnifier icon for Search
  Search as SearchIcon,
} from "lucide-react"          // lucide‑react icons are tree‑shaken :contentReference[oaicite:0]{index=0}

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path
      ? "text-red-600 border-red-600"
      : "text-gray-600 border-transparent hover:text-red-600 hover:border-red-600"

  const scrollToAbout = () =>
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-red-600">
            <Home className="h-6 w-6" />
            <span>NSW Livability</span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              {pathname === "/" ? (
                <li>
                  <button
                    onClick={scrollToAbout}
                    className="flex items-center gap-1 border-b-2 border-transparent py-5 text-gray-600 transition-colors hover:text-red-600 hover:border-red-600"
                  >
                    About
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/#about-section"
                    className="flex items-center gap-1 border-b-2 border-transparent py-5 text-gray-600 transition-colors hover:text-red-600 hover:border-red-600"
                  >
                    About
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/search"
                  className={`flex items-center gap-1 border-b-2 py-5 transition-colors ${isActive("/search")}`}
                >
                  <SearchIcon className="h-4 w-4" />
                  <span>Livability Search</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/map"
                  className={`flex items-center gap-1 border-b-2 py-5 transition-colors ${isActive("/map")}`}
                >
                  <Map className="h-4 w-4" />
                  <span>Explore Map</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/compare"
                  className={`flex items-center gap-1 border-b-2 py-5 transition-colors ${isActive("/compare")}`}
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Compare</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/quiz"
                  className={`flex items-center gap-1 border-b-2 py-5 transition-colors ${isActive("/quiz")}`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Find Suburb</span>
                </Link>
              </li>

            </ul>
          </nav>

          {/* ③ TODO: add /search to mobile drawer when you build it */}
          <div className="md:hidden">{/* Mobile menu button */}</div>
        </div>
      </div>
    </header>
  )
}
