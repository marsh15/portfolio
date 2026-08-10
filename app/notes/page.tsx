import type { Metadata } from "next";
import Link from "next/link";
import { notes } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Engineering notes",
  description: "Notes on backend systems, applied AI, and the decisions behind Santosh Kumar's projects.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <main id="main-content">
      <header className="page-intro page-shell">
        <p className="kicker">Engineering notes</p>
        <h1>Thinking in public, one decision at a time.</h1>
        <p>Short, practical notes from building backend-heavy products and applied AI systems.</p>
      </header>
      <section className="notes-index page-shell" aria-label="All engineering notes">
        <div className="note-list">
          {notes.map((note, index) => (
            <Link href={`/notes/${note.slug}`} className="note-row" key={note.slug}>
              <span className="note-number">0{index + 1}</span>
              <span>
                <span className="note-project">{note.project} · {note.readingTime}</span>
                <strong>{note.title}</strong>
                <span>{note.description}</span>
              </span>
              <span className="note-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
