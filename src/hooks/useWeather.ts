import { useEffect, useState } from 'react';

export interface WeatherData {
  temp: number;
  description: string;
  emoji: string;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
}

function wmoToInfo(code: number): { description: string; emoji: string } {
  if (code === 0) return { description: 'Clear', emoji: '☀️' };
  if (code === 1) return { description: 'Mainly clear', emoji: '🌤️' };
  if (code === 2) return { description: 'Partly cloudy', emoji: '⛅' };
  if (code === 3) return { description: 'Overcast', emoji: '☁️' };
  if (code <= 48) return { description: 'Foggy', emoji: '🌫️' };
  if (code <= 55) return { description: 'Drizzle', emoji: '🌦️' };
  if (code <= 65) return { description: 'Rain', emoji: '🌧️' };
  if (code <= 77) return { description: 'Snow', emoji: '❄️' };
  if (code <= 82) return { description: 'Showers', emoji: '🌦️' };
  if (code <= 86) return { description: 'Snow showers', emoji: '🌨️' };
  return { description: 'Thunderstorm', emoji: '⛈️' };
}

interface Coords {
  lat: number;
  lon: number;
}

export function useWeather(location: string, coords?: Coords): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (!location.trim()) {
      setState({ data: null, loading: false, error: false });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      setState((s) => ({ ...s, loading: true, error: false }));
      try {
        let lat: number;
        let lon: number;

        if (coords) {
          lat = coords.lat;
          lon = coords.lon;
        } else {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
            { signal: controller.signal },
          );
          const geoData = await geoRes.json();
          if (!geoData.results?.length) throw new Error('not found');
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
        }

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`,
          { signal: controller.signal },
        );
        const wxData = await wxRes.json();
        const { temperature_2m, weather_code } = wxData.current;

        if (!cancelled) {
          setState({
            data: { temp: Math.round(temperature_2m), ...wmoToInfo(weather_code) },
            loading: false,
            error: false,
          });
        }
      } catch {
        if (!cancelled) setState({ data: null, loading: false, error: true });
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  // coords object ref changes on every render, so spread into primitives as deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, coords?.lat, coords?.lon]);

  return state;
}
