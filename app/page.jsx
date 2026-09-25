"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Flame,
  Search,
  Star,
  Timer,
} from "lucide-react";
import { useFitLog } from "../components/FitLogProvider";

function HeroArt() {
  return (
    <div className="hero-art" aria-label="Workout illustration">
      <div className="art-ring" />
      <div className="art-label">
        <span>01</span> TRAIN WITH INTENT
      </div>
      <img
        className="hero-image"
        src="/assets/banner.png"
        alt="A FitLog athlete lifting a barbell"
      />
      <div className="art-corner">
        FITLOG <span>///</span> TRAINING SYSTEM
      </div>
    </div>
  );
}

export default function HomePage() {
  const { workouts, loading, error } = useFitLog();
  const [sort, setSort] = useState("duration");
  const [query, setQuery] = useState("");
  const items = useMemo(
    () =>
      workouts
        .filter((w) =>
          `${w.name} ${w.muscleGroups.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice()
        .sort((a, b) =>
          sort === "duration" ? a.duration - b.duration : b[sort] - a[sort],
        ),
    [workouts, sort, query],
  );
  return (
    <>
      <section className="fitlog-hero shell">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> WORKOUT LIBRARY
          </span>
          <h1>
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>
          <p>
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>
          <a className="button btn btn-primary button-primary" href="#library">
            BROWSE WORKOUTS <ArrowDown size={15} />
          </a>
        </div>
        <HeroArt />
        <div className="hero-foot">
          <span>EST. 2026</span>
          <span>
            YOUR NEXT REP STARTS HERE <ArrowRight size={13} />
          </span>
        </div>
      </section>
      <section className="library shell" id="library">
        <div className="section-top">
          <div>
            <span className="eyebrow">MOVE WITH PURPOSE</span>
            <h2>THE LIBRARY</h2>
            <p>Twelve lifts covering every major muscle group.</p>
          </div>
          <div className="library-controls">
            <label className="search-box">
              <Search size={16} />
              <input
                className="input input-bordered"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lifts or muscle"
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
        ) : error ? (
          <div className="error-state">
            {error}{" "}
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        ) : (
          <div className="workout-grid">
            {items.map((w) => (
              <Link
                className="workout-card card"
                href={`/workout/${w.id}`}
                key={w.id}
              >
                <div className="card-image">
                  <img
                    className="h-full w-full object-cover"
                    src={w.image}
                    alt={w.name}
                    loading="lazy"
                  />
                  <span className="card-arrow">
                    <ArrowRight size={16} />
                  </span>
                </div>
                <div className="card-content card-body">
                  <div className="tag-row">
                    {w.muscleGroups.map((group) => (
                      <span className="tag badge" key={group}>
                        {group}
                      </span>
                    ))}
                  </div>
                  <h3>{w.name}</h3>
                  <p className="equipment">{w.equipment}</p>
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
              </Link>
            ))}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="no-results">No lifts found. Try another search.</p>
        )}
        <div className="library-foot">
          <span>
            SHOWING {items.length.toString().padStart(2, "0")} / 12 MOVEMENTS
          </span>
          <span>
            BUILT TO GET BETTER <i>↗</i>
          </span>
        </div>
      </section>
    </>
  );
}
