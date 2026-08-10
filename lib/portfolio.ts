export type ExternalLink = {
  label: string;
  href: `https://${string}` | `mailto:${string}`;
};

export type Project = {
  slug: "scribe" | "ledgerly" | "pingme";
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  stack: readonly string[];
  proof: readonly string[];
  github: `https://${string}`;
  live: `https://${string}`;
  caseStudy?: boolean;
  theme: "mint" | "forest" | "ink";
};

export type CaseStudy = {
  slug: "scribe" | "ledgerly";
  problem: string;
  approach: readonly { title: string; detail: string }[];
  architecture: readonly string[];
  reflection: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  description: string;
};

export type NoteMetadata = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  project: string;
};

export const profile = {
  name: "Santosh Kumar",
  headline: "Software engineer building dependable backend and applied-AI products.",
  intro:
    "I build systems that turn messy inputs into useful, trustworthy software—from cited AI answers to private financial records and short-lived chat rooms.",
  location: "Coimbatore, Tamil Nadu",
  availability: "Open to full-time roles across India and remote",
  email: "santoshkumaraidev@gmail.com",
  calendar: "https://cal.com/santosh-kumar-cvorb5/15min",
  birthDate: "2004-03-22T11:30:00+05:30",
  education:
    "B.E. Computer Science and Engineering — IoT, Cyber Security & Blockchain",
  college: "SNS College of Engineering",
  graduation: "May 2026",
  cgpa: "8.0 / 10",
} as const;

export const techStack = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Hono",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "Python",
  "Docker",
  "pgvector",
  "Vercel AI SDK",
] as const;

export const principles = [
  {
    title: "Build things that force you to become better.",
    detail: "The artifact matters. The person produced by building it matters more.",
  },
  {
    title: "Real ability matters more than appearing advanced.",
    detail: "Vocabulary is cheap. Clear explanations and working systems are better evidence.",
  },
  {
    title: "Taste is choosing what deserves to be built—and what does not.",
    detail: "Problem selection sits upstream of implementation quality.",
  },
  {
    title: "Tools should increase ambition, not decrease understanding.",
    detail: "Faster is useful only while I can still explain what the system is doing.",
  },
  {
    title: "High agency is refusing to treat solvable problems as fixed conditions.",
    detail: "Find another route. Learn the missing thing. Build the tool.",
  },
  {
    title: "You have more time than anxiety suggests, and less than procrastination assumes.",
    detail: "A useful tension: play the long game, then do today’s work.",
  },
] as const;

export const links: readonly ExternalLink[] = [
  { label: "GitHub", href: "https://github.com/marsh15" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/s-santosh-kumar/" },
  { label: "X", href: "https://x.com/santu_0101" },
  { label: "LeetCode", href: "https://leetcode.com/u/marsh15/" },
];

export const projects: readonly Project[] = [
  {
    slug: "scribe",
    name: "SCRIBE",
    eyebrow: "Applied AI · 2026",
    shortDescription: "A RAG knowledge workspace designed to answer with sources—or abstain.",
    description:
      "An AI knowledge workspace for uploading documents, retrieving relevant passages, and returning structured answers with citations and guardrails.",
    image: "/images/projects/scribe.png",
    imageAlt: "SCRIBE landing page showing its document ingestion and cited-answer workflow",
    stack: ["Next.js", "PostgreSQL", "pgvector", "Gemini", "Vercel AI SDK"],
    proof: ["Citation-backed answers", "Asynchronous ingestion", "Per-user isolation"],
    github: "https://github.com/marsh15/SCRIBE",
    live: "https://scribe-marsh.vercel.app/",
    caseStudy: true,
    theme: "mint",
  },
  {
    slug: "ledgerly",
    name: "Ledgerly",
    eyebrow: "Backend systems · 2026",
    shortDescription: "A private ledger that turns raw bank text into structured transaction records.",
    description:
      "A personal finance system with deterministic parsing, category rules, analytics, tenant isolation, PostgreSQL RLS, and protected AI insights.",
    image: "/images/projects/ledgerly.png",
    imageAlt: "Ledgerly sign-in page describing private transaction extraction and tenant isolation",
    stack: ["Next.js", "Hono", "PostgreSQL", "Prisma", "Better Auth"],
    proof: ["Deterministic parser", "PostgreSQL RLS", "Aggregate-only AI insights"],
    github: "https://github.com/marsh15/Ledgerly",
    live: "https://ledgerly-demo.vercel.app/",
    caseStudy: true,
    theme: "forest",
  },
  {
    slug: "pingme",
    name: "PingMe",
    eyebrow: "Real-time systems · 2026",
    shortDescription: "Anonymous, short-lived chat rooms backed by Redis TTL.",
    description:
      "A real-time chat experiment with temporary rooms, no accounts, Redis-backed state, and automatic expiry instead of persistent message history.",
    image: "/images/projects/pingme.png",
    imageAlt: "PingMe landing page offering private ephemeral chat rooms",
    stack: ["Next.js", "TypeScript", "Redis", "Upstash", "Bun"],
    proof: ["No account required", "TTL-based expiry", "No persistent chat history"],
    github: "https://github.com/marsh15/pingme",
    live: "https://pingme-realtime.vercel.app/",
    theme: "ink",
  },
] as const;

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "scribe",
    problem:
      "A useful document assistant needs to retrieve the right context, show where an answer came from, and avoid sounding certain when the documents do not support a response.",
    approach: [
      {
        title: "Ingest outside the request path",
        detail:
          "Uploads enter an asynchronous pipeline with retries and rollback so parsing and embedding work do not block the user-facing response.",
      },
      {
        title: "Keep evidence attached",
        detail:
          "Retrieved chunks stay connected to their source metadata, enabling answers to expose citations instead of returning untraceable prose.",
      },
      {
        title: "Treat abstention as a feature",
        detail:
          "The answer flow includes a supported-answer check so weak context can produce an honest ‘I don’t know’ instead of a confident guess.",
      },
    ],
    architecture: ["Upload", "Parse & chunk", "Embed", "pgvector retrieval", "Guarded answer", "Citations"],
    reflection:
      "The important part was not adding a chat box. It was deciding where uncertainty, isolation, and failure should be visible in the system.",
  },
  {
    slug: "ledgerly",
    problem:
      "Bank exports and pasted transaction messages are inconsistent, but financial records need repeatable parsing and strict ownership boundaries.",
    approach: [
      {
        title: "Determinism before AI",
        detail:
          "A rule-based parser handles raw text and CSV inputs so the same transaction produces the same structured record.",
      },
      {
        title: "Isolation at more than one layer",
        detail:
          "Application scoping is reinforced with PostgreSQL row-level security, reducing reliance on a single user filter.",
      },
      {
        title: "Send less to the model",
        detail:
          "Optional insights work from aggregate summaries rather than raw transaction rows, keeping the AI boundary narrow and explicit.",
      },
    ],
    architecture: ["Raw text / CSV", "Deterministic parser", "Validated record", "Tenant-scoped Postgres", "Rules & analytics", "Aggregate insights"],
    reflection:
      "Ledgerly sharpened a principle I now reuse: deterministic systems should own the facts, while AI should operate on a deliberately limited surface.",
  },
] as const;

export const experience: Experience = {
  company: "CoralflowAI",
  role: "Generative AI Training Intern",
  period: "June — August 2024",
  description:
    "Built Python stock-data dashboards and improved product workflows through iterative feedback with the team.",
};

export const notes: readonly NoteMetadata[] = [
  {
    slug: "rag-that-can-say-i-dont-know",
    title: "Building RAG That Can Say ‘I Don’t Know’",
    description: "Why retrieval quality, evidence thresholds, and abstention matter more than a polished chat response.",
    publishedAt: "2026-08-07",
    readingTime: "5 min read",
    project: "SCRIBE",
  },
  {
    slug: "tenant-isolation-beyond-user-id",
    title: "Tenant Isolation Beyond a userId Filter",
    description: "Layering application checks with PostgreSQL row-level security in a finance system.",
    publishedAt: "2026-08-07",
    readingTime: "4 min read",
    project: "Ledgerly",
  },
  {
    slug: "ephemeral-chat-with-redis-ttl",
    title: "Designing Ephemeral Chat with Redis TTL",
    description: "How an expiry-first data model changes room state, cleanup, and the promise made to users.",
    publishedAt: "2026-08-07",
    readingTime: "4 min read",
    project: "PingMe",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
