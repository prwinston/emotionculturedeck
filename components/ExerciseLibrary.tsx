"use client";

import { useMemo, useState } from "react";
import { EXERCISES, ENERGY_LABELS, type Exercise } from "@/lib/exercises";

const energyStyles: Record<Exercise["energyLevel"], string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export function ExerciseLibrary() {
  const [energyFilter, setEnergyFilter] = useState<Exercise["energyLevel"] | "all">("all");
  const [maxDuration, setMaxDuration] = useState(30);

  const filtered = useMemo(
    () =>
      EXERCISES.filter(
        (e) => (energyFilter === "all" || e.energyLevel === energyFilter) && e.durationMinutes <= maxDuration,
      ),
    [energyFilter, maxDuration],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 p-4">
        <div>
          <label htmlFor="energy-filter" className="block text-xs font-medium text-neutral-500 mb-1">
            Energy level
          </label>
          <select
            id="energy-filter"
            value={energyFilter}
            onChange={(e) => setEnergyFilter(e.target.value as typeof energyFilter)}
            className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="duration-filter" className="block text-xs font-medium text-neutral-500 mb-1">
            Max duration: {maxDuration} min
          </label>
          <input
            id="duration-filter"
            type="range"
            min={3}
            max={30}
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-40"
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-neutral-500">
        {filtered.length} of {EXERCISES.length} activities
      </p>

      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((ex) => (
          <li key={ex.id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium">{ex.title}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${energyStyles[ex.energyLevel]}`}>
                {ENERGY_LABELS[ex.energyLevel]}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">{ex.durationMinutes} min</p>
            <p className="mt-2 text-sm text-neutral-600">{ex.description}</p>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-neutral-500">No activities match those filters.</p>
      )}
    </div>
  );
}
