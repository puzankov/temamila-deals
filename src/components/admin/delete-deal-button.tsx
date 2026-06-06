"use client";

import { useState } from "react";
import { deleteDealAction } from "@/app/admin/actions";
import { TrashIcon } from "./icons";

export function DeleteDealButton({ id, slug }: { id: string; slug: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={deleteDealAction} className="inline-flex items-center">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      {confirming ? (
        <span className="inline-flex items-center gap-1 text-xs">
          <span className="text-slate-500">Delete?</span>
          <button
            type="submit"
            title="Confirm delete"
            className="rounded px-1.5 py-0.5 font-medium text-red-600 hover:bg-red-50"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded px-1.5 py-0.5 text-slate-500 hover:bg-slate-100"
          >
            No
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          title="Delete"
          className="rounded p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <TrashIcon />
        </button>
      )}
    </form>
  );
}
