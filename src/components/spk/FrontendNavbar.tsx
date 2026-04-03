'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FrontendNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .spk-navbar {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        .spk-navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .spk-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #e94560, #c23152);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .spk-brand-text {
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .spk-brand-sub {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.6);
          display: block;
          line-height: 1;
          margin-top: 2px;
        }
        .spk-nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .spk-nav-links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .spk-nav-links a:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .spk-btn-spk {
          background: linear-gradient(135deg, #e94560, #c23152) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 15px rgba(233,69,96,0.3);
        }
        .spk-btn-spk:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(233,69,96,0.4) !important;
        }
        .spk-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: white;
          font-size: 1.5rem;
          padding: 4px;
        }
        .spk-mobile-menu {
          display: none;
          background: #16213e;
          padding: 1rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .spk-mobile-menu.open {
          display: block;
        }
        .spk-mobile-menu a {
          display: block;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 12px 0;
          font-size: 1rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
          .spk-nav-links { display: none; }
          .spk-hamburger { display: block; }
        }
      `}</style>
      <nav className="spk-navbar">
        <Link href="/" className="spk-navbar-brand">
          <div className="spk-brand-icon">💻</div>
          <div>
            <span className="spk-brand-text">Laptopku</span>
            <span className="spk-brand-sub">SPK Laptop Bekas</span>
          </div>
        </Link>
        <ul className="spk-nav-links">
          <li><Link href="/">Beranda</Link></li>
          <li><Link href="/spk">Rekomendasi</Link></li>
          <li><Link href="/about">Tentang</Link></li>
          <li><Link href="/contact">Kontak</Link></li>
          <li><Link href="/signin" className="spk-btn-spk">Login</Link></li>
        </ul>
        <button className="spk-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
      <div className={`spk-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Beranda</Link>
        <Link href="/spk" onClick={() => setMenuOpen(false)}>Rekomendasi WP</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>Tentang</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Kontak</Link>
        <Link href="/signin" onClick={() => setMenuOpen(false)}>Login</Link>
      </div>
    </>
  );
}
