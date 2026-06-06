"use client";

import { createContext, useContext } from "react";

/** Lets nested form widgets request an autosave on change (no-op outside a form). */
export const AutosaveContext = createContext<() => void>(() => {});

export function useAutosave() {
  return useContext(AutosaveContext);
}
