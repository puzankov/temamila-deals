"use client";

import { useEffect, useRef, useState } from "react";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

export interface AddressValues {
  address: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
}

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/** Loads the Google Maps JS (Places) script once; returns true when ready. */
function useGoogleMaps(): boolean {
  // Lazy init catches the case where the script is already on the page.
  const [ready, setReady] = useState(
    () => typeof google !== "undefined" && !!google.maps?.places,
  );
  useEffect(() => {
    if (!GOOGLE_KEY || ready || typeof window === "undefined") return;
    const existing = document.getElementById("gmaps-js") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "gmaps-js";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, [ready]);
  return ready;
}

function parsePlace(place: google.maps.places.PlaceResult): Partial<AddressValues> {
  const get = (type: string, short = false) => {
    const c = place.address_components?.find((comp) => comp.types.includes(type));
    return c ? (short ? c.short_name : c.long_name) : "";
  };
  const streetNumber = get("street_number");
  const route = get("route");
  const line = [streetNumber, route].filter(Boolean).join(" ");
  return {
    address: line || place.formatted_address?.split(",")[0] || "",
    city: get("locality") || get("sublocality") || get("postal_town"),
    state: get("administrative_area_level_1", true),
    zip: get("postal_code"),
    lat: place.geometry?.location?.lat(),
    lng: place.geometry?.location?.lng(),
  };
}

export function AddressAutocomplete({ initial }: { initial?: Partial<AddressValues> }) {
  const ready = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const [v, setV] = useState<AddressValues>({
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    zip: initial?.zip ?? "",
    lat: initial?.lat,
    lng: initial?.lng,
  });

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: ["us"] },
      fields: ["address_components", "geometry", "formatted_address"],
    });
    const listener = ac.addListener("place_changed", () => {
      const parsed = parsePlace(ac.getPlace());
      setV((prev) => ({ ...prev, ...parsed }));
    });
    return () => listener.remove();
  }, [ready]);

  const located = v.lat != null && v.lng != null;

  return (
    <div className="space-y-3">
      {/* Smart address line */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Address</label>
          {GOOGLE_KEY ? (
            located ? (
              <span className="text-xs font-medium text-brand-dark">✓ Located on map</span>
            ) : (
              <span className="text-xs text-slate-400">Start typing for suggestions</span>
            )
          ) : (
            <span className="text-xs text-amber-600">Manual entry (no Maps key)</span>
          )}
        </div>
        <input
          ref={inputRef}
          name="address"
          required
          autoComplete="off"
          placeholder="Start typing the street address…"
          value={v.address}
          onChange={(e) => setV((p) => ({ ...p, address: e.target.value }))}
          onKeyDown={(e) => {
            // Don't submit the form when picking a suggestion with Enter.
            if (e.key === "Enter") e.preventDefault();
          }}
          className={`mt-1 ${inputCls}`}
        />
      </div>

      {/* Auto-filled, still editable */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2">
          <label className="text-xs text-slate-500">City</label>
          <input
            name="city"
            required
            value={v.city}
            onChange={(e) => setV((p) => ({ ...p, city: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">State</label>
          <input
            name="state"
            required
            value={v.state}
            onChange={(e) => setV((p) => ({ ...p, state: e.target.value.toUpperCase() }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">ZIP</label>
          <input
            name="zip"
            value={v.zip}
            onChange={(e) => setV((p) => ({ ...p, zip: e.target.value }))}
            className={inputCls}
          />
        </div>
      </div>

      {/* Coordinates travel with the form; surfaced read-only here. */}
      <input type="hidden" name="lat" value={v.lat ?? ""} />
      <input type="hidden" name="lng" value={v.lng ?? ""} />
    </div>
  );
}
