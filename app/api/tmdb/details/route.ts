import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type')
  
  if (!id || !type) {
    return NextResponse.json({ error: 'Missing id or type parameter' }, { status: 400 })
  }
  
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' }, 
      { status: 500 }
    )
  }
  
  try {
    // Fetch basic details
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!detailsResponse.ok) {
      throw new Error(`TMDb API responded with status: ${detailsResponse.status}`)
    }
    
    const details = await detailsResponse.json()
    
    // Fetch credits (for director, cast, etc.)
    const creditsResponse = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=pt-BR`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!creditsResponse.ok) {
      throw new Error(`TMDb API credits responded with status: ${creditsResponse.status}`)
    }
    
    const credits = await creditsResponse.json()
    
    // Combine details and credits
    const combinedData = {
      ...details,
      credits
    }
    
    return NextResponse.json(combinedData)
  } catch (error) {
    console.error('Error fetching from TMDb:', error)
    return NextResponse.json(
      { error: 'Failed to fetch details from TMDb API' }, 
      { status: 500 }
    )
  }
}