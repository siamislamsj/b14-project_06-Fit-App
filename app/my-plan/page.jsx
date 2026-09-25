"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Check, Flame, Search, Star, Timer, X } from "lucide-react";
import { useFitLog } from "../../components/FitLogProvider";

export default function MyPlanPage() {
  const { plan, saved, loading, removeFromPlan, removeSaved, markDone } =
    useFitLog();
  const [tab, setTab] = useState("plan");
  const [sort, setSort] = useState("duration");
  const [query, setQuery] = useState("");
  const items = tab === "plan" ? plan : saved;
  const filtered = useMemo(
    () =>
      items
        .filter((w) =>
          `${w.name} ${w.muscleGroups.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice()
        .sort((a, b) =>
          sort === "duration" ? a.duration - b.duration : b[sort] - a[sort],
        ),
    [items, query, sort],
  );
  const minutes = plan.reduce((sum, item) => sum + item.duration, 0);
  const calories = plan.reduce((sum, item) => sum + item.caloriesBurned, 0);
  return (
    <section className="plan-page shell">
      <div className="plan-heading">
        <div>
          <span className="eyebrow">
            <i /> YOUR TRAINING LOG
          </span>
          <h1>MY PLAN</h1>
          <p>Cap of five lifts for today. Finish them, then load more.</p>
        </div>
        <div className="today-stamp">
          <span>TODAY&apos;S SESSION</span>
          <strong>
            {String(plan.length).padStart(2, "0")} <small>/ 05</small>
          </strong>
          <i>KEEP SHOWING UP.</i>
        </div>
      </div>
      <div className="metrics-row">
        <div className="metric-card card">
          <span>EXERCISES</span>
          <strong>{plan.length.toString().padStart(2, "0")}</strong>
          <i>IN TODAY&apos;S PLAN</i>
        </div>
        <div className="metric-card card">
          <span>MINUTES</span>
          <strong>{minutes}</strong>
          <i>ESTIMATED TOTAL</i>
        </div>
        <div className="metric-card card">
          <span>CALORIES</span>
          <strong>{calories}</strong>
          <i>ESTIMATED BURN</i>
        </div>
      </div>
      <div className="plan-tools">
        <div className="tabs tabs-box">
          <button
            className={`tab ${tab === "plan" ? "active tab-active" : ""}`}
            onClick={() => setTab("plan")}
          >
            TODAY&apos;S PLAN <b>{plan.length}</b>
          </button>
          <button
            className={`tab ${tab === "saved" ? "active tab-active" : ""}`}
            onClick={() => setTab("saved")}
          >
            SAVED <b>{saved.length}</b>
          </button>
        </div>
        <div className="library-controls">
          <label className="search-box">
            <Search size={15} />
            <input
              className="input input-bordered"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your lifts"
            />
          </label>
          <label className="select-wrap">
            <span>SORT BY</span>
            <select
              className="select select-bordered"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="duration">Duration</option>
              <option value="caloriesBurned">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>
      </div>
      {loading ? (
        <div className="loading-state">
          <span className="spinner" /> Loading workouts…
        </div>
      ) : filtered.length ? (
        <div className="plan-list">
          {filtered.map((w) => (
            <article className="plan-card card" key={w.id}>
              <Link href={`/workout/${w.id}`} className="plan-thumb">
                <img
                  className="h-full w-full object-cover"
                  src={w.image}
                  alt={w.name}
                />
              </Link>
              <div className="plan-card-info">
                <div className="tag-row">
                  {w.muscleGroups.slice(0, 2).map((group) => (
                    <span className="tag badge" key={group}>
                      {group}
                    </span>
                  ))}
                </div>
                <h2>{w.name}</h2>
                <p>{w.equipment}</p>
                <div className="card-stats">
                  <span>
                    <Timer size={14} />
                    {w.duration} min
                  </span>
                  <span>
                    <Flame size={14} />
                    {w.caloriesBurned} kcal
                  </span>
                  <span>
                    <Star size={14} />
                    {w.rating}
                  </span>
                </div>
              </div>
              <div className="plan-card-actions">
                <Link
                  className="button btn btn-outline button-outline button-small"
                  href={`/workout/${w.id}`}
                >
                  VIEW DETAILS
                </Link>
                {tab === "plan" && (
                  <button
                    className={`button btn btn-primary button-primary button-small ${w.done ? "done-button" : ""}`}
                    onClick={() => markDone(w)}
                  >
                    <Check size={14} />
                    {w.done ? "DONE" : "MARK AS DONE"}
                  </button>
                )}
                <button
                  className="icon-button btn btn-ghost btn-square"
                  aria-label="Remove workout"
                  onClick={() =>
                    tab === "plan" ? removeFromPlan(w.id) : removeSaved(w.id)
                  }
                >
                  <X size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Bookmark size={24} />
          </div>
          <span className="eyebrow">SESSION LOG / 00</span>
          <h2>NOTHING HERE YET</h2>
          <p>
            {tab === "plan"
              ? "Browse the library and add a lift to get today moving."
              : "Save a lift for later and it will show up here."}
          </p>
          <Link
            className="button btn btn-primary button-primary"
            href="/#library"
          >
            GO TO WORKOUTS
          </Link>
        </div>
      )}
      <div className="plan-bottom-note">
        <span>TRAIN HARD. LOG HONEST.</span>
        <span>
          YOUR WORK ADDS UP <i>↗</i>
        </span>
      </div>
    </section>
  );
}
