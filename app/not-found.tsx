import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found page-shell">
      <p className="kicker">Page not found</p>
      <h1>404</h1>
      <p>This route wandered off. The work is still here.</p>
      <Link className="chip-link" href="/">Return home <span aria-hidden="true">→</span></Link>
    </main>
  );
}
