import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this portfolio handles analytics and live data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <header className="page-intro page-shell">
        <p className="kicker">Small print, plainly written</p>
        <h1>Privacy without the fog machine.</h1>
        <p>This site keeps enough information to understand whether the work is being seen—not enough to identify who is doing the seeing.</p>
      </header>
      <article className="prose">
        <h2>What is measured</h2>
        <p>Vercel Web Analytics records aggregate page visits. The homepage may display a rolling 30-day visitor total and country-level distribution. It does not display precise locations, IP addresses, or individual visitor histories.</p>
        <h2>What is not used</h2>
        <p>There are no advertising trackers, account systems, comment forms, or custom browser fingerprints. Live Spotify, GitHub, and weather data describe Santosh—not the visitor.</p>
        <h2>Questions</h2>
        <p>Email <a href="mailto:santoshkumaraidev@gmail.com">santoshkumaraidev@gmail.com</a> if you want to ask about the site or its data.</p>
        <Link className="text-link" href="/">← Return to the ledger</Link>
      </article>
    </main>
  );
}
