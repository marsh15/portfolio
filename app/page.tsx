import Image from "next/image";
import Link from "next/link";
import { AgeTicker } from "@/components/age-ticker";
import { PortfolioSignals } from "@/components/portfolio-signals";
import { ProjectProof } from "@/components/project-proof";
import { experience, notes, profile, projects, techStack } from "@/lib/portfolio";

export default function Home() {
  return (
    <main id="main-content" className="portfolio-home">
      <section className="landing-hero page-shell" aria-labelledby="hero-title">
        <div className="landing-copy" data-reveal>
          <p className="availability">
            <span aria-hidden="true" />
            Open to work
          </p>
          <h1 id="hero-title">hi, santosh here.</h1>
          <p className="age-line">
            been here for <AgeTicker compact /> years
          </p>
          <p className="plain-intro">
            I&apos;m a software engineer and computer science student from Coimbatore. I enjoy building useful products,
            especially where dependable backend systems and applied AI meet.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#work">See my work <span aria-hidden="true">↓</span></a>
            <a className="text-link" href={`mailto:${profile.email}`}>Say hello <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <figure className="hero-profile" data-reveal>
          <div className="profile-signal" aria-hidden="true" />
          <Image
            src="/images/santosh-kumar.png"
            alt="Illustrated portrait used by Santosh Kumar"
            width={460}
            height={460}
            priority
            sizes="(max-width: 760px) 72vw, 23rem"
          />
          <figcaption>
            <span>Coimbatore, India</span>
            <span>Backend · AI · Product</span>
          </figcaption>
        </figure>
      </section>

      <section className="about-section page-shell" id="about" aria-labelledby="about-title">
        <div className="section-heading" data-reveal>
          <p className="section-index">01 / About</p>
          <h2 id="about-title">I like learning by building the whole thing.</h2>
        </div>
        <div className="about-grid" data-reveal>
          <div className="about-copy">
            <p>
              I started by hacking around on the internet and kept following the questions deeper: how data moves,
              where systems fail, and what makes software feel trustworthy. I now build end-to-end products with a
              particular interest in backend engineering, real-time systems, and useful AI.
            </p>
            <p>
              I&apos;m graduating in {profile.graduation} and looking for a team where I can learn quickly, own meaningful
              work, and keep raising the quality of what I ship.
            </p>
          </div>
          <div className="stack-block" id="stack">
            <h3>Tech I work with</h3>
            <ul aria-label="Technology stack">
              {techStack.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading page-shell" data-reveal>
          <p className="section-index">02 / Selected work</p>
          <h2 id="work-title">Things I&apos;ve built, and what made them hard.</h2>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectProof project={project} index={index + 1} key={project.slug} />
          ))}
        </div>
      </section>

      <PortfolioSignals />

      <section className="record-section page-shell" id="record" aria-labelledby="record-title">
        <div className="section-heading" data-reveal>
          <p className="section-index">04 / Experience</p>
          <h2 id="record-title">A short record.</h2>
        </div>
        <div className="record-list" data-reveal>
          <article>
            <p className="record-date">{experience.period}</p>
            <div><h3>{experience.role}</h3><p>{experience.company} · Coimbatore</p></div>
            <p>{experience.description}</p>
          </article>
          <article>
            <p className="record-date">Graduating {profile.graduation}</p>
            <div><h3>{profile.education}</h3><p>{profile.college}</p></div>
            <p>CGPA {profile.cgpa}. Studying computer science with IoT, cybersecurity, and blockchain.</p>
          </article>
        </div>
        <a className="text-link record-resume" href="/Santosh-Kumar-Resume.pdf">Read my résumé <span aria-hidden="true">↗</span></a>
      </section>

      <section className="notes-section" id="notes" aria-labelledby="notes-title">
        <div className="page-shell">
          <div className="section-heading notes-heading" data-reveal>
            <div>
              <p className="section-index">05 / Notes</p>
              <h2 id="notes-title">What I learned while building.</h2>
            </div>
            <Link className="text-link" href="/notes">All notes <span aria-hidden="true">→</span></Link>
          </div>
          <div className="note-list" data-reveal>
            {notes.map((note, index) => (
              <Link href={`/notes/${note.slug}`} className="note-row" key={note.slug}>
                <span className="note-number">0{index + 1}</span>
                <span><small>{note.project} · {note.readingTime}</small><strong>{note.title}</strong></span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <figure className="closing-quote page-shell" data-reveal>
        <blockquote>
          “If you put 10,000 hours in a thing you&apos;ll eventually become expert at it, so the question should be:
          am I putting 10,000 hours of work in this thing?”
        </blockquote>
        <figcaption>Andrej Karpathy</figcaption>
      </figure>
    </main>
  );
}
