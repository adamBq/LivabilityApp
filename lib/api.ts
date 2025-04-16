// This file contains mock API functions that would be replaced with real API calls in a production app

// Mock data for suburbs
const mockSuburbs = [
  {
    id: "sydney",
    name: "Sydney",
    score: 85,
    crimeRate: "Low",
    weather: "Excellent",
    publicTransport: "Excellent",
    familyFriendly: "Good",
    metrics: {
      safety: 80,
      transport: 95,
      weather: 90,
      family: 75,
    },
    housePrice: 1500000,
    population: 246343,
    schools: 15,
    match: 92,
    price: 1500000,
    lifestyle: "Urban",
  },
  {
    id: "parramatta",
    name: "Parramatta",
    score: 78,
    crimeRate: "Medium",
    weather: "Good",
    publicTransport: "Very Good",
    familyFriendly: "Very Good",
    metrics: {
      safety: 65,
      transport: 85,
      weather: 80,
      family: 85,
    },
    housePrice: 950000,
    population: 167993,
    schools: 12,
    match: 88,
    price: 950000,
    lifestyle: "Suburban",
  },
  {
    id: "newcastle",
    name: "Newcastle",
    score: 82,
    crimeRate: "Low",
    weather: "Good",
    publicTransport: "Good",
    familyFriendly: "Excellent",
    metrics: {
      safety: 85,
      transport: 70,
      weather: 85,
      family: 90,
    },
    housePrice: 850000,
    population: 322278,
    schools: 18,
    match: 85,
    price: 850000,
    lifestyle: "Coastal",
  },
  {
    id: "wollongong",
    name: "Wollongong",
    score: 80,
    crimeRate: "Low",
    weather: "Very Good",
    publicTransport: "Good",
    familyFriendly: "Very Good",
    metrics: {
      safety: 80,
      transport: 75,
      weather: 90,
      family: 85,
    },
    housePrice: 820000,
    population: 203630,
    schools: 14,
    match: 80,
    price: 820000,
    lifestyle: "Coastal",
  },
  {
    id: "penrith",
    name: "Penrith",
    score: 75,
    crimeRate: "Medium",
    weather: "Good",
    publicTransport: "Good",
    familyFriendly: "Very Good",
    metrics: {
      safety: 70,
      transport: 75,
      weather: 75,
      family: 85,
    },
    housePrice: 750000,
    population: 196066,
    schools: 16,
    match: 78,
    price: 750000,
    lifestyle: "Suburban",
  },
  {
    id: "gosford",
    name: "Gosford",
    score: 76,
    crimeRate: "Low",
    weather: "Very Good",
    publicTransport: "Good",
    familyFriendly: "Very Good",
    metrics: {
      safety: 75,
      transport: 70,
      weather: 85,
      family: 80,
    },
    housePrice: 680000,
    population: 169053,
    schools: 10,
    match: 75,
    price: 680000,
    lifestyle: "Suburban",
  },
  {
    id: "bathurst",
    name: "Bathurst",
    score: 72,
    crimeRate: "Low",
    weather: "Good",
    publicTransport: "Fair",
    familyFriendly: "Excellent",
    metrics: {
      safety: 85,
      transport: 50,
      weather: 70,
      family: 90,
    },
    housePrice: 550000,
    population: 43206,
    schools: 8,
    match: 70,
    price: 550000,
    lifestyle: "Rural",
  },
  {
    id: "wagga",
    name: "Wagga Wagga",
    score: 74,
    crimeRate: "Low",
    weather: "Good",
    publicTransport: "Fair",
    familyFriendly: "Excellent",
    metrics: {
      safety: 80,
      transport: 55,
      weather: 75,
      family: 90,
    },
    housePrice: 480000,
    population: 56442,
    schools: 9,
    match: 68,
    price: 480000,
    lifestyle: "Rural",
  },
  {
    id: "albury",
    name: "Albury",
    score: 73,
    crimeRate: "Low",
    weather: "Good",
    publicTransport: "Fair",
    familyFriendly: "Very Good",
    metrics: {
      safety: 80,
      transport: 60,
      weather: 75,
      family: 85,
    },
    housePrice: 450000,
    population: 51076,
    schools: 7,
    match: 65,
    price: 450000,
    lifestyle: "Rural",
  },
  {
    id: "tamworth",
    name: "Tamworth",
    score: 70,
    crimeRate: "Medium",
    weather: "Good",
    publicTransport: "Fair",
    familyFriendly: "Very Good",
    metrics: {
      safety: 70,
      transport: 55,
      weather: 70,
      family: 85,
    },
    housePrice: 420000,
    population: 41188,
    schools: 6,
    match: 62,
    price: 420000,
    lifestyle: "Rural",
  },
]

// Function to search suburbs by name
export function getSuburbsByName(query: string) {
  // In a real app, this would call an API endpoint
  const normalizedQuery = query.toLowerCase()
  return mockSuburbs.filter((suburb) => suburb.name.toLowerCase().includes(normalizedQuery))
}

// Function to get detailed suburb data
export function getSuburbData(suburbId: string, weights?: Record<string, number>) {
  // In a real app, this would call an API endpoint with the weights
  // to get a customized livability score
  const suburb = mockSuburbs.find((s) => s.id === suburbId)

  if (!suburb) return null

  // If weights are provided, we would recalculate the score
  // This is just a simple example of how it might work
  if (weights) {
    // In a real app, this would be a more complex calculation
    // based on the weights and the suburb's metrics
    console.log("API call would be made here with weights:", weights)

    // For demo purposes, we'll just return the suburb as is
    return suburb
  }

  return suburb
}

// Function to find matching suburbs based on quiz answers
export function findMatchingSuburbs(answers: Record<string, string>) {
  // In a real app, this would call an API endpoint with the answers
  // to get personalized suburb recommendations
  console.log("API call would be made here with answers:", answers)

  // For demo purposes, we'll just return some mock results
  // In a real app, these would be filtered and sorted based on the answers
  return mockSuburbs.slice(0, 6).sort((a, b) => b.match - a.match)
}
