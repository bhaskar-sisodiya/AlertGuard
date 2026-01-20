// // services/weatherService.js

// export const getWeatherByLocation = async (location) => {
//   if (!location) {
//     return { ok: false, status: 400, message: "Location is required" };
//   }

//   const apiKey = process.env.WEATHER_API_KEY;
//   if (!apiKey) {
//     return { ok: false, status: 500, message: "Weather API key missing" };
//   }

//   const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
//     location
//   )}&aqi=no`;

//   const res = await fetch(url);
//   const data = await res.json();

//   if (!res.ok) {
//     return {
//       ok: false,
//       status: 404,
//       message: data?.error?.message || "Weather not found",
//     };
//   }

//   return {
//     ok: true,
//     data: {
//       location: {
//         name: data.location.name,
//         region: data.location.region,
//         country: data.location.country,
//         lat: data.location.lat,
//         lon: data.location.lon,
//         localtime: data.location.localtime,
//       },
//       current: {
//         temp_c: data.current.temp_c,
//         temp_f: data.current.temp_f,
//         condition: {
//           text: data.current.condition.text,
//           icon: data.current.condition.icon,
//         },
//         wind_kph: data.current.wind_kph,
//         wind_dir: data.current.wind_dir,
//         pressure_mb: data.current.pressure_mb,
//         precip_mm: data.current.precip_mm,
//         humidity: data.current.humidity,
//         cloud: data.current.cloud,
//         feelslike_c: data.current.feelslike_c,
//         feelslike_f: data.current.feelslike_f,
//         vis_km: data.current.vis_km,
//         uv: data.current.uv,
//       },
//     },
//   };
// };

// services/weatherService.js

export const getWeatherByLocation = async (location) => {
  if (!location) {
    return { ok: false, status: 400, message: "Location is required" };
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, message: "OpenWeather API key missing" };
  }

  // ✅ OpenWeatherMap Current Weather API
  // Using units=metric for temp in Celsius
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: data?.message || "Weather not found",
      };
    }

    // ✅ Convert OpenWeather response -> your existing format (WeatherAPI-like)
    return {
      ok: true,
      data: {
        location: {
          name: data.name,
          region: "", // OpenWeather doesn't provide region directly
          country: data.sys?.country || "",
          lat: data.coord?.lat,
          lon: data.coord?.lon,
          localtime: new Date().toISOString(), // OpenWeather doesn't provide localtime like WeatherAPI
        },
        current: {
          temp_c: data.main?.temp ?? null,
          temp_f:
            data.main?.temp != null ? (data.main.temp * 9) / 5 + 32 : null,
          condition: {
            text: data.weather?.[0]?.description || "Unknown",
            icon: data.weather?.[0]?.icon
              ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
              : null,
          },
          wind_kph:
            data.wind?.speed != null
              ? data.wind.speed * 3.6 // m/s -> km/h
              : null,
          wind_dir: data.wind?.deg != null ? `${data.wind.deg}°` : null,
          pressure_mb: data.main?.pressure ?? null,
          precip_mm:
            data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0, // approximate
          humidity: data.main?.humidity ?? null,
          cloud: data.clouds?.all ?? null,
          feelslike_c: data.main?.feels_like ?? null,
          feelslike_f:
            data.main?.feels_like != null
              ? (data.main.feels_like * 9) / 5 + 32
              : null,
          vis_km:
            data.visibility != null ? data.visibility / 1000 : null, // meters -> km
          uv: null, // OpenWeather current endpoint doesn't include UV (needs OneCall)
        },
      },
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err.message || "Internal weather fetch error",
    };
  }
};
