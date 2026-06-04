import Link from 'next/link';
import { Car, Link2 } from 'lucide-react';

import {
  buildWhatsAppUrl,
  FOOTER_COLUMNS,
  SITE,
  WA_MESSAGES,
} from '@/lib/constants';

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

/** Logo — reused from Navbar but in white for dark bg */
function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-white/10 border border-white/20">
        <Car className="w-5 h-5 text-white" strokeWidth={1.8} />
      </span>
      <span
        className="text-[20px] font-bold tracking-[0.3px] text-white"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Yana <span className="text-sky-brand">Transit</span>
      </span>
    </Link>
  );
}

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
            <Link
              href={link.href}
              className="text-[14px] text-white/60 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Social icon button */
function SocialBtn({ label, href, icon }: SocialItem) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-btn border border-white/15 text-white/60 hover:bg-sky-brand hover:border-sky-brand hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
}

// ─────────────────────────────────────────
// X (TWITTER) ICON — not in Lucide, inline SVG
// ─────────────────────────────────────────
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

// ─────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────
export default function Footer() {
  const waUrl = buildWhatsAppUrl(WA_MESSAGES.default);

  const socials: SocialItem[] = [
    {
      label: 'X (Twitter)',
      href: '#',
      icon: <XIcon size={15} />,
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: <Link2 className="w-4 h-4" strokeWidth={2} />,
    },
    {
      label: 'Facebook',
      href: '#',
      icon: <Link2 className="w-4 h-4" strokeWidth={2} />,
    },
    {
      label: 'YouTube',
      href: '#',
      icon: <Link2 className="w-4 h-4" strokeWidth={2} />,
    },
  ];

  return (
    <footer className="bg-navy text-white">
      {/* ── Top grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 xl:px-14 pt-16 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-white/10">
          {/* Brand column */}
          <div>
            <FooterLogo />

            {/* Tagline */}
            <p
              className="mt-2 mb-5 text-[14px] italic text-white/45"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {SITE.tagline}
            </p>

            {/* Description */}
            <p className="text-[14px] leading-[1.75] text-white/50 mb-6 max-w-[320px]">
              {SITE.description}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <SocialBtn key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Data columns */}
          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn
              key={col.heading}
              heading={col.heading}
              links={col.links}
            />
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-[13px] text-white/30 text-center sm:text-left">
            © {new Date().getFullYear()} Yana Transit Pvt. Ltd. · All rights
            reserved.
          </p>
          <p className="text-[13px] text-white/30">Made with ♥ for India</p>
        </div>
      </div>
    </footer>
  );
}
