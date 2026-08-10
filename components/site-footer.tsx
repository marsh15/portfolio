import { links, profile } from "@/lib/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-statement page-shell" data-reveal>
        <p className="section-index">06 / Let&apos;s work together</p>
        <h2>Have a useful problem worth building?</h2>
        <p>I&apos;m open to full-time software engineering roles across India and remote. Tell me what you&apos;re working on and where I could help.</p>
        <div className="footer-actions">
          <a className="primary-link light-button" href={`mailto:${profile.email}`}>Email me <span aria-hidden="true">↗</span></a>
          <a className="text-link" href={profile.calendar} target="_blank" rel="noreferrer">Book 15 minutes <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="footer-index page-shell">
        <p><span className="status-dot" aria-hidden="true" /> Open to work</p>
        <nav aria-label="Social profiles">
          {links.map((link) => <a href={link.href} key={link.label} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true"> ↗</span></a>)}
          <a href="/privacy">Privacy</a>
        </nav>
        <p>Coimbatore · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
