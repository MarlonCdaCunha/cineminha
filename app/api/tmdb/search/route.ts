import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const type = searchParams.get('type')
  
  if (!query || !type) {
    return NextResponse.json({ error: 'Missing query or type parameter' }, { status: 400 })
  }
  
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' }, 
      { status: 500 }
    )
  }
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    )
    
    if (!response.ok) {
      throw new Error(`TMDb API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from TMDb:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from TMDb API' }, 
      { status: 500 }
    )
  }
}