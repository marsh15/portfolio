import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, getProject } from "@/lib/portfolio";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.caseStudy) return {};

  return {
    title: `${project.name} case study`,
    description: project.shortDescription,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.name} — Engineering case study`, description: project.shortDescription, url: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = getCaseStudy(slug);
  if (!project || !study || !project.caseStudy) notFound();

  return (
    <main id="main-content">
      <header className="case-hero page-shell">
        <div>
          <p className="kicker">Case study · {project.eyebrow}</p>
          <h1>{project.name}</h1>
          <p className="case-lede">{project.shortDescription}</p>
          <div className="project-actions">
            <a className="chip-link" href={project.live} target="_blank" rel="noreferrer">Open live product <span aria-hidden="true">↗</span></a>
            <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>
          </div>
          <div className="case-meta">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <figure className="case-image-wrap">
          <Image src={project.image} alt={project.imageAlt} width={1440} height={960} priority sizes="(max-width: 760px) 100vw, 58vw" />
        </figure>
      </header>

      <section className="case-section page-shell">
        <div>
          <p className="section-index">01 / Problem</p>
          <h2>What needed to be true.</h2>
        </div>
        <div className="case-section-content"><p>{study.problem}</p></div>
      </section>

      <section className="case-section page-shell">
        <div>
          <p className="section-index">02 / Decisions</p>
          <h2>The system, not just the screen.</h2>
        </div>
        <div className="case-section-content">
          <div className="decision-list">
            {study.approach.map((decision, index) => (
              <article className="decision-item" key={decision.title}>
                <span>0{index + 1}</span>
                <div><h3>{decision.title}</h3><p>{decision.detail}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section page-shell">
        <div>
          <p className="section-index">03 / Flow</p>
          <h2>From input to useful output.</h2>
        </div>
        <div className="case-section-content">
          <ul className="architecture-flow" aria-label={`${project.name} architecture flow`}>
            {study.architecture.map((step) => <li key={step}>{step}</li>)}
          </ul>
        </div>
      </section>

      <section className="case-section page-shell">
        <div>
          <p className="section-index">04 / Reflection</p>
          <h2>What I carry forward.</h2>
        </div>
        <div className="case-section-content">
          <p>{study.reflection}</p>
          <Link className="text-link" href="/#work">Back to selected work <span aria-hidden="true">←</span></Link>
        </div>
      </section>
    </main>
  );
}
