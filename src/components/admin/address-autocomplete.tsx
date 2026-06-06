"use client";

import { useEffect, useRef, useState } from "react";
import { useAutosave } from "./autosave";
import { GOOGLE_MAPS_KEY, useGoogleMaps } from "../google-maps";

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

interface Suggestion {
  id: string;
  text: string;
  prediction: google.maps.places.PlacePrediction;
}

function comp(place: google.maps.places.Place, type: string, short = false): string {
  const c = place.addressComponents?.find((x) => x.types.includes(type));
  if (!c) return "";
  return (short ? c.shortText : c.longText) ?? "";
}

function parsePlace(place: google.maps.places.Place): Partial<AddressValues> {
  const line = [comp(place, "street_number"), comp(place, "route")].filter(Boolean).join(" ");
  return {
    address: line || place.formattedAddress?.split(",")[0] || "",
    city: comp(place, "locality") || comp(place, "postal_town") || comp(place, "sublocality_level_1"),
    state: comp(place, "administrative_area_level_1", true),
    zip: comp(place, "postal_code"),
    lat: place.location?.lat(),
    lng: place.location?.lng(),
  };
}

export function AddressAutocomplete({ initial }: { initial?: Partial<AddressValues> }) {
  const ready = useGoogleMaps();
  const save = useAutosave();
  const [v, setV] = useState<AddressValues>({
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    zip: initial?.zip ?? "",
    lat: initial?.lat,
    lng: initial?.lng,
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function fetchSuggestions(input: string) {
    if (!ready || !GOOGLE_MAPS_KEY || input.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (!tokenRef.current) tokenRef.current = new google.maps.places.AutocompleteSessionToken();
    try {
      const { suggestions: results } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedRegionCodes: ["us"],
          sessionToken: tokenRef.current,
        });
      const list: Suggestion[] = (results ?? [])
        .map((s) => s.placePrediction)
        .filter((p): p is google.maps.places.PlacePrediction => !!p)
        .map((p) => ({ id: p.placeId, text: p.text.text, prediction: p }));
      setSuggestions(list);
      setOpen(list.length > 0);
    } catch (err) {
      console.error("Autocomplete failed", err);
    }
  }

  function onInput(value: string) {
    setV((p) => ({ ...p, address: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  }

  async function choose(s: Suggestion) {
    setOpen(false);
    setSuggestions([]);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ["addressComponents", "location", "formattedAddress"] });
      setV((prev) => ({ ...prev, ...parsePlace(place) }));
      tokenRef.current = null; // end the billing session
      save();
    } catch (err) {
      console.error("Place details failed", err);
    }
  }

  const located = v.lat != null && v.lng != null;

  return (
    <div className="space-y-3">
      <div ref={boxRef} className="relative">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Address</label>
          {GOOGLE_MAPS_KEY ? (
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
          name="address"
          required
          autoComplete="off"
          placeholder="Start typing the street address…"
          value={v.address}
          onChange={(e) => onInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (open && suggestions[0]) choose(suggestions[0]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={`mt-1 ${inputCls}`}
        />

        {open && (
          <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => choose(s)}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {s.text}
                </button>
              </li>
            ))}
          </ul>
        )}
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

      <input type="hidden" name="lat" value={v.lat ?? ""} />
      <input type="hidden" name="lng" value={v.lng ?? ""} />
    </div>
  );
}
