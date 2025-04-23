import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(request: Request) {
  let raw = ''
  try {
    const { answers } = await request.json() as { answers: Record<string,string> }

    const prompt = `
      You are a livability expert. Given these quiz answers, calculate weights (crime, familyDemographics, weather) summing to 1.0 and list 5 NSW suburbs.
      Respond exactly as JSON: { "weights": {…}, "suburbs": […] }

      Quiz answers:
      ${Object.entries(answers).map(([k,v]) => `- ${k}: ${v}`).join("\n")}
      `
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    raw = completion.choices[0].message?.content?.trim() || ''

    const parsed = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      !parsed.weights ||
      !Array.isArray(parsed.suburbs)
    ) {
      console.error('Parsed invalid structure:', parsed)
      throw new Error('Invalid JSON structure')
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, raw },
      { status: 500 }
    )
  }
}