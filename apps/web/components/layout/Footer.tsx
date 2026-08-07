import Link from 'next/link';

import { FOOTER_COLUMNS, FOOTER_CONTACT, SITE } from '@/lib/constants';
import Logo from '../Logo';
import {
  FacebookIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from '../ui/SocialIcons';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type SocialItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// ─────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────

/** Single footer nav column */
function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-5">
        {heading}
      </h4>

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith('https://admin') ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
              >
                {link.label}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-medium tracking-wide">
                  Portal
                </span>
              </a>
            ) : (
              // existing link rendering
              <Link
                href={link.href}
                className="text-[14px] text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Social icon button */
function SocialBtn({ label, href, icon }: SocialItem) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-btn border border-white/15 text-white/60 hover:bg-sky-brand hover:border-sky-brand hover:text-white transition-all duration-200"
    >
      {icon}
    </Link>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────
export default function Footer() {
  const socials: SocialItem[] = [
    {
      label: 'X (Twitter)',
      href: '#',
      icon: <XIcon size={15} />,
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: <LinkedInIcon size={15} />,
    },
    {
      label: 'Facebook',
      href: '#',
      icon: <FacebookIcon size={15} />,
    },
    {
      label: 'YouTube',
      href: '#',
      icon: <YouTubeIcon size={15} />,
    },
  ];

  return (
    <footer className="bg-navy text-white">
      {/* ── Top grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 xl:px-14 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-12 pb-6 border-b border-white/10">
          {/* Brand column */}
          <div>
            <Logo src="/logo.png" width="w-[200px]" height="h-[100px]" />

            <p className="mt-2 mb-5 text-[14px] text-white/45">
              GSTIN: {SITE.gstNumber}
            </p>

            {/* Tagline */}
            {/* <p
              className="mt-2 mb-5 text-[14px] italic text-white/45"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {SITE.tagline}
            </p> */}

            {/* Description */}
            <p className="mt-0 text-[14px] leading-[1.75] text-white/50 mb-6 max-w-[320px]">
              {SITE.description}
            </p>
          </div>

          {/* Data columns */}
          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn
              key={col.heading}
              heading={col.heading}
              links={col.links}
            />
          ))}

          {/* Get in Touch column */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-white/40 mb-5">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-4">
              {FOOTER_CONTACT.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group flex items-start gap-2.5 text-[14px] text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <span className="mt-px shrink-0">{item.icon}</span>
                    <span className="leading-snug">{item.value}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-6">
              {socials.map((s) => (
                <SocialBtn key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-[13px] text-white/30 text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "} Yaana Transit &#9642; All rights
            reserved.
          </p>
          <p className="text-[13px] text-white/30">
            Made with &#10084; for India
          </p>
        </div>
      </div>
    </footer>
  );
}
