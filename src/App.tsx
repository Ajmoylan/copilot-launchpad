import { useEffect, useRef, useState } from "react";
import { AdoptionDashboard } from "./sections/AdoptionDashboard";
import { Overview } from "./sections/Overview";
import { RevenueCalculator } from "./sections/RevenueCalculator";
import { Roadmap } from "./sections/Roadmap";
import { SECTIONS, sectionFromHash, type SectionId } from "./navigation";

export default function App() {
  const [section, setSection] = useState<SectionId>(() => sectionFromHash(window.location.hash));
  const firstRender = useRef(true);

  // The URL hash keeps sections linkable and the browser's back button working.
  useEffect(() => {
    const onHashChange = () => setSection(sectionFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Move focus to the new section's heading (not on first load), so keyboard and screen-reader
  // users land on the content they just chose.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById("section-title")?.focus();
    window.scrollTo({ top: 0 });
  }, [section]);

  const go = (id: SectionId) => {
    if (id === section) return;
    window.location.hash = id;
    setSection(id);
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <a
            className="brand"
            href="#overview"
            onClick={(event) => {
              event.preventDefault();
              go("overview");
            }}
          >
            <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 3 27 9.5v13L16 29 5 22.5v-13z" />
              <path d="M11 17.5 16 9l5 8.5-5 5.5z" />
            </svg>
            <span className="brand-text">
              <strong>COPILOT // LAUNCHPAD</strong>
              <span>Partner enablement dashboard</span>
            </span>
          </a>
          <nav aria-label="Dashboard sections">
            <ul className="nav-list">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="nav-link"
                    aria-current={s.id === section ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      go(s.id);
                    }}
                  >
                    <span className="nav-number" aria-hidden="true">
                      {s.number}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="disclaimer" role="note">
        <strong>Independent demonstration.</strong> Not an official GitHub, Microsoft or Arrow
        product. Organisations and adoption figures are fictional; prices and margins are
        adjustable assumptions, not commercial terms.
      </div>

      <main id="main" className="main">
        {section === "overview" && <Overview onNavigate={go} />}
        {section === "calculator" && <RevenueCalculator />}
        {section === "adoption" && <AdoptionDashboard />}
        {section === "roadmap" && <Roadmap />}
      </main>

      <footer className="footer">
        <p>
          COPILOT // LAUNCHPAD · an independent portfolio project by Alex Moylan · No cookies,
          tracking or accounts; everything runs in your browser ·{" "}
          <a href="https://github.com/Ajmoylan/copilot-launchpad">Source on GitHub</a>
        </p>
        <p>
          GitHub Copilot is a product of GitHub, Inc. Product terminology follows{" "}
          <a href="https://docs.github.com/en/copilot">GitHub&apos;s Copilot documentation</a>.
        </p>
      </footer>
    </div>
  );
}
