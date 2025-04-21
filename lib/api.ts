// This file contains mock API functions that would be replaced with real API calls in a production app

import { bounds, popup } from "leaflet"
import { resolve } from "path"

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

const API_KEY = process.env.API_KEY

// Function to search suburbs by name
export function getSuburbsByName(query: string) {
  // In a real app, this would call an API endpoint
  const normalizedQuery = query.toLowerCase()
  return mockSuburbs.filter((suburb) => suburb.name.toLowerCase().includes(normalizedQuery))
}

// Function to get detailed suburb data
export async function getSuburbData(suburb: string, weights?: Record<string, number>) {

  if (!suburb || !weights) return null

  const body = {
    "address": `${suburb}, NSW`,
    "weights": weights
  }
  
  try {
    const score = await callScoreAPI(body);
    const population = await getSuburbPopulation(suburb);
    const income = await getSuburbIncome(suburb);
    
      return {
        name: suburb,
        ...score,
        population: population.totalPopulation, 
        income: income.average_income_range
      };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getPropertyData(address: string, weights?: Record<string, number>) {

  if (!address || !weights) return null

  const body = {
    "address": `${address}, NSW`,
    "weights": weights
  }
  
  try {
    const response = await callScoreAPI(body);
    return {
      name: address,
      ...response
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
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

interface ScoreRequestBody {
  address: string;
  suburbOnly: boolean;
  weights: Record<string, number>
}

export async function callScoreAPI(body: ScoreRequestBody) {
  const url =
    'https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com:443/prod/livability_score';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in callScoreAPI:', error);
    throw error;
  }
}

export async function getSuburbPopulation(suburb: String) {
  const url =
  'https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/family/population/' + suburb;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in getSuburbPopulation:', error);
    throw error;
  }
}

export async function getSuburbIncome(suburb: String) {
  const url =
  'https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/family/income/' + suburb;

  // if (!API_KEY) {
  //   throw new Error('API_KEY is not defined in environment variables');
  // }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': "EBb5OHc2US6L4bGG5ZJna6m4FFs3fgJnaTNZREfu",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in getSuburbPopulation:', error);
    throw error;
  }
}