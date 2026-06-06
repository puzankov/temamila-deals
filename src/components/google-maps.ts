"use client";

import { useEffect, useState } from "react";

export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let configured = false;

/**
 * Loads the Google Maps libraries and reports when they're ready.
 *
 * The loader package is imported dynamically inside the effect because it
 * touches `window` at module load — importing it at the top level would break
 * server-side rendering of the (client) components that use this hook.
 */
export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) return;
    let cancelled = false;

    (async () => {
      const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
      if (!configured) {
        setOptions({ key: GOOGLE_MAPS_KEY, v: "weekly" });
        configured = true;
      }
      await Promise.all([
        importLibrary("places"),
        importLibrary("maps"),
        importLibrary("marker"),
      ]);
      if (!cancelled) setReady(true);
    })().catch((err) => console.error("Google Maps failed to load", err));

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
