"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/* ==================================================================
 * RoomOverlay — when a doorway is entered, this DOM card zooms in
 * with GSAP and shows the contents of that "room" as hand-written
 * sketchbook copy. Click outside or Esc to step back into the hallway.
 * ================================================================== */

export function RoomOverlay({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const scrim = useRef<HTMLDivElement>(null);
  const card  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    if (scrim.current) {
      gsap.fromTo(
        scrim.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
    if (card.current) {
      gsap.fromTo(
        card.current,
        { scale: 0.85, opacity: 0, rotate: -1.2, y: 30 },
        { scale: 1, opacity: 1, rotate: 0, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, onClose]);

  if (!slug) return null;

  const width = ROOM_WIDTHS[slug] ?? "max-w-2xl";

  return (
    <div
      ref={scrim}
      className="fixed inset-0 z-40 flex items-center justify-center bg-paper/70 backdrop-blur-[2px] p-4"
      onClick={(e) => { if (e.target === scrim.current) onClose(); }}
    >
      <div
        ref={card}
        className={`relative w-full ${width} bg-paper-light border border-ink/15 rounded-[18px] shadow-[0_30px_70px_-30px_rgba(26,22,20,0.45)] max-h-[85vh] overflow-y-auto px-8 py-10`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 handwritten text-2xl text-ink-soft hover:text-bronze transition-colors"
          aria-label="Close room"
        >
          ✕ back
        </button>

        {slug === "about"     && <AboutContent />}
        {slug === "skills"    && <SkillsContent />}
        {slug === "education" && <EducationContent />}
        {slug === "projects"  && <ProjectsContent />}
        {slug === "contact"   && <ContactContent />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Per-room widths                                                    */
/* ------------------------------------------------------------------ */
const ROOM_WIDTHS: Record<string, string> = {
  about:     "max-w-2xl",
  skills:    "max-w-3xl",
  education: "max-w-3xl",
  projects:  "max-w-4xl",
  contact:   "max-w-2xl",
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                        */
/* ------------------------------------------------------------------ */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.62rem] tracking-[0.22em] uppercase text-bronze mb-2">
      {children}
    </p>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="handwritten text-5xl text-ink mb-5 leading-[0.95]">
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                              */
/* ------------------------------------------------------------------ */
function AboutContent() {
  return (
    <>
      <Eyebrow>— About</Eyebrow>
      <Title>A note on the work</Title>
      <p className="text-ink-soft leading-relaxed mb-4">
        A backend &amp; systems engineer who keeps notebooks full of half-finished
        storage engines.
      </p>
      <div className="space-y-3 text-ink/90 leading-relaxed">
        <p>
          I build for the layers closest to the operating system, the network,
          and storage — places where <em>correctness</em>, <em>concurrency</em>,
          and behaviour under partial failure decide whether a system is
          actually reliable.
        </p>
        <p>
          My work spans concurrent servers, Redis-style and Raft-based
          key-value stores, and write-optimized storage engines — built from
          first principles to study the real trade-offs between durability,
          consistency, and performance rather than rely on opaque abstractions.
        </p>
        <p>
          Areas of depth: POSIX systems programming, write-ahead logging,
          LSM-tree storage, and distributed consensus. Actively seeking
          backend, platform, or infrastructure roles where reliability and
          failure-aware design are core requirements.
        </p>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                             */
/* ------------------------------------------------------------------ */
const SKILLS = [
  { name: "Languages",      items: "C · C++ · Java · SQL" },
  { name: "Backend",        items: "Spring Boot · REST · Auth · Service Design" },
  { name: "Data & Storage", items: "PostgreSQL · MySQL · Redis · WAL · LSM Trees" },
  { name: "Systems",        items: "POSIX · Concurrency · TCP/IP · Raft" },
  { name: "Tools",          items: "Linux · Git · Docker · Kubernetes" },
];

function SkillsContent() {
  return (
    <>
      <Eyebrow>— Skills</Eyebrow>
      <Title>What I work with</Title>
      <div className="grid gap-4 sm:grid-cols-2 mt-2">
        {SKILLS.map((s, i) => (
          <div
            key={s.name}
            className="border border-ink/15 rounded-2xl p-4 paper-bob bg-paper/60"
            style={{ animationDuration: `${5 + (i % 3)}s`, animationDelay: `${i * 0.3}s` }}
          >
            <h3 className="handwritten text-3xl text-ink leading-none">{s.name}</h3>
            <p className="font-mono text-[0.78rem] text-ink-soft mt-2 leading-relaxed">
              {s.items}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                          */
/* ------------------------------------------------------------------ */
const EDUCATION = [
  {
    year: "2025 — 2027 · Current",
    title: "MTech, Computer Science & Engineering",
    institution: "International Institute of Information Technology, Bangalore",
    courses: "Algorithms · Cloud Computing · Data Modeling · Design Patterns · Distributed Computing · Enterprise Software Development · NoSQL · Software Architecture and Design Practices · Software Production Engineering · System Software",
    current: true,
  },
  {
    year: "2021 — 2025",
    title: "BTech, Computer Science & Engineering (AIML)",
    institution: "Institute of Engineering and Management, Kolkata",
    courses: "Computer Networks · Data Structures & Algorithms · DBMS · Deep Learning · Machine Learning · OOP · Operating Systems",
    current: false,
  },
];

function EducationContent() {
  return (
    <>
      <Eyebrow>— Education</Eyebrow>
      <Title>Where I studied</Title>
      <div className="space-y-2 relative mt-2">
        {EDUCATION.map((it, i) => (
          <div key={i} className="flex gap-5 relative pb-6 last:pb-0">
            {/* Dot + connector */}
            <div className="flex flex-col items-center pt-1.5 relative">
              <span
                className={`block w-3 h-3 rounded-full border-2 border-bronze relative z-10 ${
                  it.current ? "bg-bronze" : "bg-paper-light"
                }`}
              />
              {i < EDUCATION.length - 1 && (
                <span className="absolute top-5 bottom-0 left-1/2 -translate-x-1/2 w-px bg-bronze/40" />
              )}
            </div>

            {/* Entry */}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[0.7rem] tracking-[0.1em] text-bronze mb-1">
                {it.year}
              </p>
              <h3 className="handwritten text-3xl text-ink leading-tight mb-1">
                {it.title}
              </h3>
              <p className="text-sm text-ink-soft">{it.institution}</p>
              <p className="text-xs text-ink-soft mt-2 italic leading-relaxed">
                {it.courses}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                           */
/* ------------------------------------------------------------------ */
const PROJECTS = [
  {
    num: "01",
    title: "Redis-Style In-Memory KV Store",
    year: "ONGOING",
    chips: ["C", "C++", "Event-Driven TCP", "Concurrency"],
    desc: "Event-driven TCP server with a Redis-inspired protocol, thread-safe in-memory storage, and concurrent client handling — built from first principles.",
    url: "https://github.com/Rohitangshu2026/mini-redis",
  },
  {
    num: "02",
    title: "Data Pipeline Framework",
    year: "2026",
    chips: ["Java", "DAG Engine", "XML", "Kahn's Algorithm"],
    desc: "Modular pipeline framework that parses XML configs into executable DAGs with multi-layer validation and Kahn's topological sort for execution.",
    url: "https://github.com/Rohitangshu2026/data-pipeline-framework",
  },
  {
    num: "03",
    title: "NASA Log ETL Framework",
    year: "2026",
    chips: ["Java", "Hadoop", "MapReduce", "Pig", "Hive", "MongoDB", "MySQL"],
    desc: "Pluggable multi-backend ETL framework for parsing NASA HTTP logs across four interchangeable engines behind a unified interface.",
    url: "https://github.com/Rohitangshu2026/NoSQL/tree/main/Project/etl-framework",
  },
  {
    num: "04",
    title: "AI DevOps Copilot",
    year: "2026",
    chips: ["FastAPI", "Kubernetes", "LLM Agents", "Elasticsearch", "GitLab CI", "Vault"],
    desc: "Multi-provider LLM agentic platform that monitors logs, reasons about failures, and executes remediation through a nine-gate deterministic safety pipeline.",
    url: "https://github.com/Rohitangshu2026/ai-devops-copilot",
  },
  {
    num: "05",
    title: "End-to-End CI/CD Pipeline",
    year: "2026",
    chips: ["Java", "Jenkins", "Docker", "Ansible", "Maven"],
    desc: "Fully automated CI/CD pipeline triggered by GitHub webhooks: build → test → package → containerize → deploy, with JUnit gates before deployment.",
    url: "https://github.com/Rohitangshu2026/scientific-calculator-ci-cd",
  },
  {
    num: "06",
    title: "Concurrent Banking Backend",
    year: "2025",
    chips: ["C", "POSIX Sockets", "IPC", "File Locking"],
    desc: "Multi-client banking backend over POSIX sockets with record-level file locking and semaphore-based concurrency control.",
    url: "https://github.com/Rohitangshu2026/banking-management-system",
  },
  {
    num: "07",
    title: "Academic ERP — Outreach Module",
    year: "2025",
    chips: ["Java", "Spring Boot", "TypeScript", "Maven"],
    desc: "Academic ERP module for organization registration and HR rep management with secure Spring Boot REST APIs and a TypeScript frontend.",
    url: "https://github.com/Rohitangshu2026/academic-erp-outreach-management",
  },
  {
    num: "08",
    title: "POSIX-Compliant ls Utility",
    year: "2026",
    chips: ["C", "POSIX", "Systems"],
    desc: "From-scratch reimplementation of Unix ls following POSIX semantics — accurate sort flags, lstat(), and a modular traversal/sort/format split.",
    url: "https://github.com/Rohitangshu2026/ls-from-scratch",
  },
  {
    num: "09",
    title: "Pattern Matching Engine",
    year: "2026",
    chips: ["C", "Pattern Matching"],
    desc: "From-scratch grep implementation focused on POSIX-style matching correctness and a clean separation between input processing and pattern logic.",
    url: "https://github.com/Rohitangshu2026/grep-from-scratch",
  },
];

function ProjectsContent() {
  return (
    <>
      <Eyebrow>— Selected Work</Eyebrow>
      <Title>Projects</Title>
      <div className="divide-y divide-ink/10 -mt-2">
        {PROJECTS.map((p) => (
          <article
            key={p.num}
            className="grid grid-cols-[44px_1fr] gap-4 py-5 group"
          >
            <p className="font-mono text-xs text-ink-soft pt-1">{p.num}</p>
            <div>
              <div className="flex justify-between items-baseline gap-3 flex-wrap mb-2">
                <h3 className="handwritten text-3xl text-ink leading-tight group-hover:text-bronze transition-colors">
                  {p.title}
                </h3>
                <span className="font-mono text-[0.68rem] tracking-[0.08em] text-ink-soft whitespace-nowrap">
                  {p.year}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.chips.map((c) => (
                  <span
                    key={c}
                    className="font-mono text-[0.62rem] px-2 py-[2px] border border-ink/15 rounded-full text-ink-soft group-hover:border-ink/30 transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="text-sm text-ink/85 leading-relaxed mb-3 max-w-prose">
                {p.desc}
              </p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.72rem] tracking-[0.1em] uppercase text-ink hover:text-bronze border-b border-ink hover:border-bronze pb-[2px] transition-colors"
              >
                View on GitHub <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                            */
/* ------------------------------------------------------------------ */
const CONTACT_LINKS = [
  { label: "Email",    value: "rbose2002@gmail.com", href: "mailto:rbose2002@gmail.com" },
  { label: "Phone",    value: "+91 87928 70926",     href: "tel:+918792870926" },
  { label: "GitHub",   value: "Rohitangshu2026",     href: "https://github.com/Rohitangshu2026" },
  { label: "LinkedIn", value: "rohitangshu-bose",    href: "https://www.linkedin.com/in/rohitangshu-bose/" },
  { label: "LeetCode", value: "Rohit2026",           href: "https://leetcode.com/u/Rohit2026/" },
];

function ContactContent() {
  return (
    <>
      <Eyebrow>— Contact</Eyebrow>
      <Title>Get in touch</Title>
      <p className="text-ink-soft leading-relaxed mb-6 max-w-prose">
        Open to backend, platform, and infrastructure roles where correctness,
        reliability, and scalability matter more than frameworks.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {CONTACT_LINKS.map((c, i) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="block border border-ink/15 rounded-2xl p-4 hover:border-bronze hover:bg-bronze/[0.05] transition-all paper-bob"
            style={{ animationDuration: `${5 + (i % 3)}s`, animationDelay: `${i * 0.4}s` }}
          >
            <p className="text-[0.6rem] tracking-[0.22em] uppercase text-bronze mb-1">
              {c.label}
            </p>
            <p className="handwritten text-2xl text-ink leading-none">
              {c.value}
            </p>
          </a>
        ))}
      </div>
      <p className="handwritten text-xl text-ink-soft mt-8 text-center italic">
        thanks for wandering all the way here.
      </p>
    </>
  );
}
