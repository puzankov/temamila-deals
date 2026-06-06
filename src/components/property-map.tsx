"use client";

import { useEffect, useRef } from "react";
import { GOOGLE_MAPS_KEY, useGoogleMaps } from "./google-maps";

export function PropertyMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label?: string;
}) {
  const ready = useGoogleMaps();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const center = { lat, lng };
    const map = new google.maps.Map(ref.current, {
      center,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons: false,
    });
    const marker = new google.maps.Marker({ position: center, map, title: label });
    return () => marker.setMap(null);
  }, [ready, lat, lng, label]);

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm text-slate-400">
        Map unavailable
      </div>
    );
  }

  return <div ref={ref} className="h-full w-full" />;
}
