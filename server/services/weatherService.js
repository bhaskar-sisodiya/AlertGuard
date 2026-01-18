// services/weatherService.js

export const getWeatherByLocation = async (location) => {
  if (!location) {
    return { ok: false, status: 400, message: "Location is required" };
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, message: "Weather API key missing" };
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    location
  )}&aqi=no`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      status: 404,
      message: data?.error?.message || "Weather not found",
    };
  }

  return {
    ok: true,
    data: {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        localtime: data.location.localtime,
      },
      current: {
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
        },
        wind_kph: data.current.wind_kph,
        wind_dir: data.current.wind_dir,
        pressure_mb: data.current.pressure_mb,
        precip_mm: data.current.precip_mm,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
        vis_km: data.current.vis_km,
        uv: data.current.uv,
      },
    },
  };
};
