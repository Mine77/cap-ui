"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Weather, type WeatherAtLocation } from "@/components/weather";

export default function WeatherPage() {
    const searchParams = useSearchParams();
    const [weatherData, setWeatherData] = useState<WeatherAtLocation | null>(
        null,
    );

    useEffect(() => {
        const latitude = searchParams.get("latitude") ?? "22.3356";
        const longitude = searchParams.get("longitude") ?? "114.1847";
        const getWeather = async () => {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
            );

            const weatherData = (await response.json()) as WeatherAtLocation;
            setWeatherData(weatherData);
        };

        getWeather();
    }, [searchParams]);

    if (weatherData)
        return (
            <Weather weatherAtLocation={weatherData} />
        );

    return null;
}
