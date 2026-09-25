"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bookmark, Check, Flame, Star, Timer } from "lucide-react";
import { useFitLog } from "../../../components/FitLogProvider";

export default function WorkoutDetails() {
  const { id } = useParams();
  const { workouts, loading, plan, addToPlan, saveWorkout } = useFitLog();
  const [singleWorkout, setSingleWorkout] = useState(null);
  const [singleLoading, setSingleLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setSingleLoading(true);
    fetch(`https://api.abcz.workers.dev/api/fitlog/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Workout not found");
        return response.json();
      })
      .then((data) => setSingleWorkout(data))
      .catch(() => setSingleWorkout(null))
      .finally(() => setSingleLoading(false));
    return () => controller.abort();
  }, [id]);

  const workout =
    workouts.find((item) => String(item.id) === String(id)) ||
    (singleWorkout && String(singleWorkout.id) === String(id)
      ? singleWorkout
      : null);
  if (!workout && (loading || singleLoading))
    return (
      <div className="page-loading">
        <span className="spinner" /> Loading workouts…
      </div>
    );
  if (!workout)
    return (
      <section className="not-found shell">
        <span className="eyebrow">NO REP LEFT BEHIND</span>
        <h1>404</h1>
        <p>That lift isn&apos;t in the library.</p>
        <Link className="button btn btn-primary button-primary" href="/">
          Back to workouts
        </Link>
      </section>
    );
  return (
    <section className="detail-page shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={15} /> ALL WORKOUTS
      </Link>
      <div className="detail-layout">
        <div className="detail-image-wrap">
          <img
            className="h-full w-full object-cover"
            src={workout.image}
            alt={workout.name}
          />
          <span className="image-index">
            MOVEMENT / {String(workout.id).padStart(2, "0")}
          </span>
        </div>
        <div className="detail-content">
          <span className="eyebrow">
            <i /> MOVEMENT PROFILE
          </span>
          <h1>{workout.name}</h1>
          <p className="detail-description">{workout.description}</p>
          <div className="tag-row detail-tags">
            {workout.muscleGroups.map((group) => (
              <span className="tag badge" key={group}>
                {group}
              </span>
            ))}
          </div>
          <div className="spec-panel card">
            <div className="spec-heading">
              KEY SPECS <span>01—07</span>
            </div>
            {[
              ["Equipment", workout.equipment],
              ["Difficulty", workout.difficulty],
              ["Sets", workout.sets],
              ["Reps", workout.reps],
              ["Duration", `${workout.duration} min`],
              ["Calories", `${workout.caloriesBurned} kcal`],
              ["Rating", `${workout.rating} / 5`],
            ].map(([label, value]) => (
              <div className="spec-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="instructions">
            <h2>
              INSTRUCTIONS <span>FOLLOW THE FORM</span>
            </h2>
            <ol>
              {workout.instructions.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="detail-actions">
            <button
              className="button btn btn-primary button-primary"
              onClick={() => addToPlan(workout)}
              disabled={plan.length >= 5}
            >
              <Check size={16} />{" "}
              {plan.length >= 5
                ? "TODAY’S PLAN IS FULL"
                : "ADD TO TODAY’S PLAN"}
            </button>
            <button
              className="button btn btn-outline button-outline"
              onClick={() => saveWorkout(workout)}
            >
              <Bookmark size={15} /> SAVE FOR LATER
            </button>
          </div>
          <div className="detail-meta">
            <span>
              <Timer size={14} />
              {workout.duration} MIN
            </span>
            <span>
              <Flame size={14} />
              {workout.caloriesBurned} KCAL
            </span>
            <span>
              <Star size={14} />
              {workout.rating}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
