'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import Image from "next/image";

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClassName = [
    "sticky top-0 z-50 transition-all duration-300",
    scrolled
      ? "bg-transparent backdrop-blur-xl shadow-sm shadow-slate-900/5"
      : "bg-transparent",
  ].join(" ");

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header className={headerClassName}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-base md:text-xl font-semibold text-[#242E58]">
          <Image 
            src="/Logo.png" 
            alt="LASU logo" 
            width={45} 
            height={45} 
            className="w-10 h-10 md:w-16 md:h-16"
          />
          LASU Alumni Connect
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg md:flex md:w-auto md:flex-row md:items-center md:justify-end md:gap-4 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <Link href="/" className="block rounded-2xl px-3 py-2 transition hover:text-sky-600 md:px-0 md:py-0" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/dashboard" className="block rounded-2xl px-3 py-2 transition hover:text-sky-600 md:px-0 md:py-0" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/alumni" className="block rounded-2xl px-3 py-2 transition hover:text-sky-600 md:px-0 md:py-0" onClick={() => setMenuOpen(false)}>
            Alumni
          </Link>
          <Link href="/news" className="block rounded-2xl px-3 py-2 transition hover:text-sky-600 md:px-0 md:py-0" onClick={() => setMenuOpen(false)}>
            News
          </Link>
          <Link href="/profile" className="block rounded-2xl px-3 py-2 transition hover:text-sky-600 md:px-0 md:py-0" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full rounded-2xl border border-slate-200 bg-[#242E58] px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 md:w-auto md:px-4 md:py-2 md:border-0 md:bg-transparent md:text-sky-600 md:hover:bg-transparent"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="block w-full rounded-2xl border border-slate-200 bg-[#242E58] px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 md:w-auto md:px-4 md:py-2"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
      <hr className="max-w-[90%] text-[#242E58] font-bold mx-auto" />
    </header>
  );
}
