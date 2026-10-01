import { channels, profile } from '../../../content/profile';
import { useLocalTime } from '../../../hooks/useLocalTime';
import { copyText } from '../../../lib/utils';
import { useUI } from '../../../providers/UIProvider';
import { Icon, type IconName } from '../../primitives/Icon';
import { Magnetic } from '../../primitives/Magnetic';
import { Reveal, RevealGroup, RevealItem } from '../../primitives/Reveal';
import { SectionHeader } from '../../primitives/SectionHeader';
import { ContactForm } from './ContactForm';

const channelIcon: Record<string, IconName> = {
  linkedin: 'linkedin',
  github: 'github',
  whatsapp: 'chat',
  phone: 'phone',
  instagram: 'instagram',
};

export function Contact() {
  const { notify } = useUI();
  const time = useLocalTime(profile.timeZone);

  const copyEmail = async () => {
    const ok = await copyText(profile.email);
    notify(ok ? 'Email address copied' : `Couldn’t copy — it’s ${profile.email}`);
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(50% 45% at 85% 90%, var(--glow-accent), transparent 70%)', opacity: 0.6 }}
      />
      <div className="shell">
        <SectionHeader index="06" label="Contact" id="contact-title" title={'Have a system that needs\nto *keep running?*'} />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-lead max-w-md text-muted">
                Whether it’s a role, a project or a question about Elixir, I’m always open to discussing new
                opportunities.
              </p>

              <div className="mt-10">
                <p className="text-meta text-faint">Email</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-sweep pb-1 text-[clamp(1.375rem,1rem+1.6vw,2.125rem)] font-medium tracking-[-0.03em] break-all"
                  >
                    {profile.email}
                  </a>
                  <Magnetic strength={0.4}>
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      className="grid size-11 place-items-center rounded-full border border-line-strong text-muted transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                    >
                      <Icon name="copy" size={17} />
                    </button>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            <RevealGroup as="ul" className="mt-12 border-t border-line" step={0.05}>
              {channels.map((c) => (
                <RevealItem as="li" key={c.id} className="border-b border-line">
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                        <Icon name={channelIcon[c.id]} size={17} />
                      </span>
                      <span>
                        <span className="block text-[0.9375rem] text-ink">{c.label}</span>
                        <span className="text-label block text-faint">{c.handle}</span>
                      </span>
                    </span>
                    <Icon
                      name={c.external ? 'arrow-up-right' : 'arrow-right'}
                      size={16}
                      className="text-faint transition-[translate,color] duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                    />
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-10">
              <p className="text-label flex items-center gap-3 text-faint">
                <span className="status-dot" aria-hidden="true" />
                <span>
                  <time className="text-ink tabular-nums">{time}</time> {profile.timeZoneLabel} in {profile.region}
                </span>
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
