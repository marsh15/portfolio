"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const chapters = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "activity", label: "Activity" },
  { id: "record", label: "Experience" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
] as const;

const commands = [
  { label: "About Santosh", detail: "A short introduction", href: "/#about", keywords: "bio who santosh" },
  { label: "Selected work", detail: "SCRIBE, Ledgerly, and PingMe", href: "/#work", keywords: "projects build portfolio" },
  { label: "Tech stack", detail: "Tools and technologies", href: "/#stack", keywords: "skills technologies languages" },
  { label: "GitHub activity", detail: "Contribution calendar and listening", href: "/#activity", keywords: "code contributions spotify music" },
  { label: "Experience", detail: "Work and education", href: "/#record", keywords: "intern college education" },
  { label: "Writing", detail: "Notes from the build", href: "/#notes", keywords: "blog articles writing" },
  { label: "Résumé", detail: "Open the PDF", href: "/Santosh-Kumar-Resume.pdf", keywords: "cv resume download" },
  { label: "Email Santosh", detail: "santoshkumaraidev@gmail.com", href: "mailto:santoshkumaraidev@gmail.com", keywords: "contact hire work" },
] as const;

const quickQuestions = ["What does Santosh build?", "What is his tech stack?", "Is he open to work?"] as const;

type Soundscape = {
  context: AudioContext;
  master: GainNode;
  sources: OscillatorNode[];
  pulseTimer: number;
};

function portfolioAnswer(question: string) {
  const query = question.toLowerCase();
  if (!query.trim()) return null;
  if (query.includes("scribe")) return "SCRIBE is Santosh’s citation-aware RAG workspace. It ingests documents, retrieves relevant passages with pgvector, and answers with sources or abstains when the evidence is weak.";
  if (query.includes("ledgerly")) return "Ledgerly turns raw bank text into private, structured transaction records. It uses deterministic parsing, tenant-scoped PostgreSQL, row-level security, and aggregate-only AI insights.";
  if (query.includes("pingme")) return "PingMe is an anonymous real-time chat experiment. Rooms require no account and expire automatically through Redis TTL instead of keeping permanent history.";
  if (query.includes("stack") || query.includes("tech") || query.includes("skill")) return "Santosh works mainly with TypeScript, Next.js, React, Node.js, Hono, PostgreSQL, Prisma, Redis, Python, Docker, pgvector, and the Vercel AI SDK.";
  if (query.includes("available") || query.includes("open to") || query.includes("hire") || query.includes("work")) return "Yes. Santosh is open to full-time software engineering roles across India and remote, especially backend, product, and applied-AI work.";
  if (query.includes("education") || query.includes("college") || query.includes("graduate")) return "Santosh is completing a B.E. in Computer Science and Engineering at SNS College of Engineering and graduates in May 2026.";
  if (query.includes("where") || query.includes("location")) return "Santosh is based in Coimbatore, Tamil Nadu, India.";
  if (query.includes("contact") || query.includes("email")) return "The quickest way to reach Santosh is santoshkumaraidev@gmail.com. You can also use the contact links at the end of the page.";
  if (query.includes("who") || query.includes("about") || query.includes("build") || query.includes("does")) return "Santosh is a software engineer and computer science student who likes building end-to-end products, with a focus on dependable backend systems, real-time infrastructure, and useful applied AI.";
  if (query.trim().length > 3) return "I can answer about Santosh’s projects, stack, education, location, availability, and contact details. Try asking about SCRIBE, Ledgerly, or PingMe.";
  return null;
}

function BatCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(pointer: fine) and (min-width: 900px)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = -80;
    let targetY = -80;
    let currentX = -80;
    let currentY = -80;
    let previousX = -80;
    let frame = 0;

    const move = (event: PointerEvent) => {
      targetX = event.clientX + 14;
      targetY = event.clientY + 18;
      cursor.dataset.visible = "true";
    };
    const leave = () => { cursor.dataset.visible = "false"; };
    const animate = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      const direction = currentX < previousX ? -1 : 1;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scaleX(${direction})`;
      previousX = currentX;
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bat-cursor" ref={cursorRef} aria-hidden="true">
      <svg viewBox="0 0 52 22" focusable="false">
        <path d="M3 15h6l5-7 7 4 5-9 5 9 7-4 5 7h6l-2 4H5z" />
        <circle cx="14" cy="19" r="3" /><circle cx="38" cy="19" r="3" />
      </svg>
      <i />
    </div>
  );
}

export function SiteHeader() {
  const [active, setActive] = useState("about");
  const [progress, setProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLElement>(null);
  const soundRef = useRef<Soundscape | null>(null);

  useEffect(() => {
    const sections = chapters.flatMap(({ id }) => {
      const section = document.getElementById(id);
      return section ? [section] : [];
    });
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -68%", threshold: [0, 0.1, 0.35] });
    sections.forEach((section) => observer.observe(section));

    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => { element.dataset.visible = "true"; });
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      }
    }), { rootMargin: "0px 0px -7%", threshold: 0.08 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const playTap = useCallback(() => {
    const nodes = soundRef.current;
    if (!nodes || nodes.context.state !== "running") return;
    const oscillator = nodes.context.createOscillator();
    const gain = nodes.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, nodes.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(310, nodes.context.currentTime + 0.045);
    gain.gain.setValueAtTime(0.018, nodes.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, nodes.context.currentTime + 0.055);
    oscillator.connect(gain).connect(nodes.context.destination);
    oscillator.start();
    oscillator.stop(nodes.context.currentTime + 0.06);
  }, []);

  useEffect(() => {
    const press = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("a, button, [role='button']")) return;
      navigator.vibrate?.(8);
      playTap();
    };
    document.addEventListener("pointerdown", press, { passive: true });
    return () => document.removeEventListener("pointerdown", press);
  }, [playTap]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    if (!paletteOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
    };
  }, [paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !paletteRef.current) return;
      const focusable = Array.from(paletteRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [paletteOpen]);

  const startSoundscape = async () => {
    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();
    master.gain.value = 0.0001;
    filter.type = "lowpass";
    filter.frequency.value = 760;
    filter.Q.value = 0.9;
    filter.connect(master).connect(compressor).connect(context.destination);

    const sources: OscillatorNode[] = [];
    [55, 82.41, 110].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 3 - 2;
      gain.gain.value = index === 0 ? 0.5 : 0.13;
      oscillator.connect(gain).connect(filter);
      oscillator.start();
      sources.push(oscillator);
    });

    const pulse = () => {
      const note = context.createOscillator();
      const gain = context.createGain();
      note.type = "triangle";
      note.frequency.value = [146.83, 164.81, 123.47, 110][Math.floor(context.currentTime / 1.7) % 4];
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.25);
      note.connect(gain).connect(filter);
      note.start();
      note.stop(context.currentTime + 1.3);
    };

    await context.resume();
    pulse();
    const pulseTimer = window.setInterval(pulse, 1700);
    master.gain.exponentialRampToValueAtTime(0.085, context.currentTime + 0.8);
    soundRef.current = { context, master, sources, pulseTimer };
  };

  const stopSoundscape = () => {
    const nodes = soundRef.current;
    if (!nodes) return;
    window.clearInterval(nodes.pulseTimer);
    nodes.master.gain.exponentialRampToValueAtTime(0.0001, nodes.context.currentTime + 0.25);
    window.setTimeout(() => {
      nodes.sources.forEach((source) => source.stop());
      void nodes.context.close();
    }, 300);
    soundRef.current = null;
  };

  const toggleSound = async () => {
    if (soundOn) {
      stopSoundscape();
      setSoundOn(false);
      return;
    }
    try {
      await startSoundscape();
      setSoundOn(true);
      navigator.vibrate?.(12);
    } catch {
      setSoundOn(false);
    }
  };

  useEffect(() => () => {
    const nodes = soundRef.current;
    if (!nodes) return;
    window.clearInterval(nodes.pulseTimer);
    void nodes.context.close();
  }, []);

  const filteredCommands = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.detail} ${command.keywords}`.toLowerCase().includes(normalized));
  }, [query]);
  const answer = useMemo(() => portfolioAnswer(query), [query]);

  const closePalette = () => {
    setPaletteOpen(false);
    setQuery("");
  };

  return (
    <>
      <header className="site-header">
        <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
        <Link className="wordmark" href="/" aria-label="Santosh Kumar, home">Santosh<span>.</span></Link>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? "Close" : "Menu"}<i aria-hidden="true" />
        </button>
        <nav id="primary-navigation" aria-label="Primary navigation" data-open={menuOpen}>
          {chapters.slice(0, 5).map((chapter) => (
            <a href={`/#${chapter.id}`} key={chapter.id} aria-current={active === chapter.id ? "location" : undefined} onClick={() => setMenuOpen(false)}>
              {chapter.label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <button className="header-tool search-trigger" type="button" onClick={() => setPaletteOpen(true)} aria-label="Ask or navigate">
            <span>Ask or navigate</span><kbd>⌘ K</kbd>
          </button>
          <button className="header-tool sound-toggle" type="button" onClick={toggleSound} aria-pressed={soundOn}>
            <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
            Sound {soundOn ? "on" : "off"}
          </button>
        </div>
      </header>

      <BatCursor />

      {paletteOpen && (
        <div className="command-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePalette(); }}>
          <section className="command-palette" ref={paletteRef} role="dialog" aria-modal="true" aria-labelledby="command-title">
            <div className="command-input-wrap">
              <span aria-hidden="true">⌕</span>
              <label className="sr-only" htmlFor="portfolio-search" id="command-title">Ask about Santosh or navigate the portfolio</label>
              <input id="portfolio-search" ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask about Santosh or jump somewhere…" autoComplete="off" />
              <button type="button" onClick={closePalette} aria-label="Close search">Esc</button>
            </div>
            {!query && (
              <div className="quick-questions" aria-label="Suggested questions">
                {quickQuestions.map((question) => <button type="button" key={question} onClick={() => setQuery(question)}>{question}</button>)}
              </div>
            )}
            {answer && <div className="portfolio-answer" role="status"><small>Portfolio guide</small><p>{answer}</p></div>}
            <div className="command-results">
              <p>{query ? "Matches" : "Navigate"}</p>
              {filteredCommands.length > 0 ? filteredCommands.map((command) => (
                <a href={command.href} key={command.label} onClick={closePalette}>
                  <span><strong>{command.label}</strong><small>{command.detail}</small></span><span aria-hidden="true">↗</span>
                </a>
              )) : <p className="no-results">No navigation matches. Ask about a project, stack, education, or availability.</p>}
            </div>
            <footer><span>Type to filter or ask</span><span>Tab to move</span><span>Esc to close</span></footer>
          </section>
        </div>
      )}
    </>
  );
}
