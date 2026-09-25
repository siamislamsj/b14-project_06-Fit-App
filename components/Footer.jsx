import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <Link href="/" className="brand">
          <img className="brand-logo" src="/assets/logo.png" alt="" />
          <span>FITLOG</span>
        </Link>
        <span>© 2026 FitLog — Workout Library. Train hard, log honest.</span>
      </div>
    </footer>
  );
}
