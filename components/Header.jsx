"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useFitLog } from "./FitLogProvider";

export default function Header() {
  const pathname = usePathname();
  const { plan, saved } = useFitLog();
  const [open, setOpen] = useState(false);
  const isPlan = pathname === "/my-plan";
  return (
    <header className="site-header">
      <div className="nav-inner shell">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <img className="brand-logo" src="/assets/logo.png" alt="" />
          <span>FITLOG</span>
        </Link>
        <button
          className="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={open ? "main-nav open" : "main-nav"}>
          <Link
            className={!isPlan ? "nav-active" : ""}
            href="/"
            onClick={() => setOpen(false)}
          >
            Workout
          </Link>
          <Link
            className={isPlan ? "nav-active" : ""}
            href="/my-plan"
            onClick={() => setOpen(false)}
          >
            My Plan
          </Link>
        </nav>
        <div className="nav-counts">
          <Link href="/my-plan" className="nav-count plan-count">
            <span>Plan</span>
            <b className="badge badge-success">{plan.length}</b>
          </Link>
          <Link href="/my-plan" className="nav-count saved-count">
            <span>Saved</span>
            <b className="badge badge-outline">{saved.length}</b>
          </Link>
        </div>
      </div>
    </header>
  );
}
