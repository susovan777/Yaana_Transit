'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Car, Menu, Phone, X } from 'lucide-react';
import {
  buildWhatsAppUrl,
  NAV_LINKS,
  SITE,
  WA_MESSAGES,
} from '@/lib/constants';
import Image from 'next/image';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <Image src='/logo.png' width={200} height={200} alt='Yana Transit Logo'/>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const waUrl = buildWhatsAppUrl(WA_MESSAGES.default);

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 h-[68px]',
          'flex items-center justify-between px-6 md:px-10 xl:px-14',
          'bg-white/95 backdrop-blur-lg',
          'border-b border-line',
          'transition-shadow duration-300',
          scrolled ? 'shadow-[0_4px_24px_rgba(11,31,58,0.08)]' : '',
        ].join(' ')}
      >
        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-muted hover:text-navy transition-colors duration-200 tracking-[0.2px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="flex items-center gap-2 text-[13px] font-semibold text-sky-brand hover:text-sky-dark transition-colors duration-200"
          >
            <Phone className="w-4 h-4" strokeWidth={2} />
            {SITE.phone}
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-[22px] py-[9px] rounded-btn bg-navy text-white text-[13px] font-semibold whitespace-nowrap hover:bg-navy-mid transition-all duration-200 hover:-translate-y-px"
          >
            Book a Ride
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-navy hover:bg-off-white transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <X className="w-5 h-5" strokeWidth={2} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={[
          'fixed top-[68px] inset-x-0 z-40 lg:hidden',
          'bg-white border-b border-line',
          'transition-all duration-300 ease-in-out overflow-hidden',
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[15px] font-medium text-navy border-b border-line last:border-0 hover:text-sky-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 pb-2">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center justify-center gap-2 py-3 rounded-btn border border-line text-[14px] font-semibold text-sky-brand"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {SITE.phone}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-3 rounded-btn bg-navy text-white text-[14px] font-semibold"
            >
              Book a Ride
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
