import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found shell">
      <span className="eyebrow">NO REP LEFT BEHIND</span>
      <h1>404</h1>
      <p>This page isn&apos;t in the FitLog library.</p>
      <Link className="button btn btn-primary button-primary" href="/">
        Back to workouts
      </Link>
    </section>
  );
}
