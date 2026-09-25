"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";
const FitLogContext = createContext(null);

export function FitLogProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const storedPlan = JSON.parse(localStorage.getItem("fitlog-plan") || "[]");
      const storedSaved = JSON.parse(localStorage.getItem("fitlog-saved") || "[]");
      setPlan(Array.isArray(storedPlan) ? storedPlan : []);
      setSaved(Array.isArray(storedSaved) ? storedSaved : []);
    } catch {
      // Invalid saved data should not prevent the workout library from loading.
    }
    setReady(true);

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load workouts.");
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid workout response");
        setWorkouts(data);
      })
      .catch(() =>
        setError(
          "We couldn’t load the workout library. Check your connection and try again.",
        ),
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("fitlog-plan", JSON.stringify(plan));
  }, [plan, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("fitlog-saved", JSON.stringify(saved));
  }, [saved, ready]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const addToPlan = useCallback(
    (workout) => {
      if (plan.some((item) => item.id === workout.id)) {
        setToast("Already in today’s plan");
        return;
      }
      if (plan.length >= 5) {
        setToast("Today’s plan is full (5 lifts max)");
        return;
      }
      setPlan((current) => [...current, { ...workout, done: false }]);
      setToast("Added to today’s plan");
    },
    [plan],
  );
  const saveWorkout = useCallback(
    (workout) => {
      if (saved.some((item) => item.id === workout.id)) {
        setToast("Already saved for later");
        return;
      }
      setSaved((current) => [...current, workout]);
      setToast("Saved for later");
    },
    [saved],
  );
  const removeFromPlan = useCallback((id) => {
    setPlan((current) => current.filter((item) => item.id !== id));
    setToast("Removed from today’s plan");
  }, []);
  const removeSaved = useCallback((id) => {
    setSaved((current) => current.filter((item) => item.id !== id));
    setToast("Removed from saved lifts");
  }, []);
  const markDone = useCallback((workout) => {
    setPlan((current) =>
      current.map((item) =>
        item.id === workout.id ? { ...item, done: true } : item,
      ),
    );
    setToast(`${workout.name} marked done`);
  }, []);

  return (
    <FitLogContext.Provider
      value={{
        workouts,
        loading,
        error,
        plan,
        saved,
        addToPlan,
        saveWorkout,
        removeFromPlan,
        removeSaved,
        markDone,
      }}
    >
      {children}
      {toast && (
        <div className="toast alert alert-success" role="status">
          {toast}
        </div>
      )}
    </FitLogContext.Provider>
  );
}

export function useFitLog() {
  const context = useContext(FitLogContext);
  if (!context) throw new Error("useFitLog must be used inside FitLogProvider");
  return context;
}
