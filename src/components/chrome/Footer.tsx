import { sections } from '../../content/navigation';
import { channels, profile } from '../../content/profile';
import { scrollToSection } from '../../lib/scroll';
import { Icon } from '../primitives/Icon';

export function Footer() {
  return (
    <footer className="relative border-t border-line pt-16 pb-[calc(var(--dock-space)+2rem)] lg:pt-20">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-heading max-w-md">
              Systems that keep <span className="serif-em text-accent">running.</span>
            </p>
            <p className="mt-4 text-sm text-muted">
              {profile.name} — {profile.role}, {profile.region}.
            </p>
            <a
              href={profile.resume}
              download
              className="text-label group mt-8 inline-flex items-center gap-2 text-ink"
            >
              <Icon name="download" size={15} />
              <span className="link-sweep pb-0.5">Download résumé (PDF)</span>
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="text-meta text-faint">Sections</h2>
            <ul className="mt-5 space-y-2.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(s.id);
                    }}
                    className="link-sweep pb-0.5 text-[0.9375rem] text-muted transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-meta text-faint">Elsewhere</h2>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a href={`mailto:${profile.email}`} className="link-sweep pb-0.5 text-[0.9375rem] text-muted transition-colors hover:text-ink">
                  Email
                </a>
              </li>
              {channels
                .filter((c) => c.external)
                .map((c) => (
                  <li key={c.id}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-sweep pb-0.5 text-[0.9375rem] text-muted transition-colors hover:text-ink"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="text-label mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-6 text-faint">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>Built with React, TypeScript and a hand-written canvas renderer.</p>
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="group inline-flex items-center gap-2 text-faint transition-colors hover:text-ink"
          >
            Back to top
            <Icon name="arrow-up" size={14} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
