import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Using OpenWeatherMap free API
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    if (!API_KEY) {
      // Fallback to mock weather data if no API key
      const mockWeather = {
        weather: [{ main: 'Clear', description: 'clear sky' }],
        main: { temp: 22, humidity: 60 },
        wind: { speed: 3.5 },
        name: 'Your Location'
      };
      return NextResponse.json(mockWeather);
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Return mock data on error
    const mockWeather = {
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 22, humidity: 60 },
      wind: { speed: 3.5 },
      name: 'Your Location'
    };
    
    return NextResponse.json(mockWeather);
  }
}