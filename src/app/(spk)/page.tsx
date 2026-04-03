'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop } from '@/lib/database-spk';

const BRANDS = [
  { name: 'ASUS', emoji: '💻', bg: '#e3f2fd' },
  { name: 'Lenovo', emoji: '🖥️', bg: '#e8f5e9' },
  { name: 'Dell', emoji: '💼', bg: '#fff8e1' },
  { name: 'HP', emoji: '📓', bg: '#f3e5f5' },
  { name: 'Acer', emoji: '🖱️', bg: '#fce4ec' },
  { name: 'Apple', emoji: '🍎', bg: '#e0f7fa' },
];

export default function HomePage() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMerek, setSelectedMerek] = useState('');

  useEffect(() => {
    fetch('/api/laptops')
      .then(r => r.json())
      .then(data => {
        setLaptops(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = laptops.filter(m => {
    const matchSearch = !search || m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.merek.toLowerCase().includes(search.toLowerCase());
    const matchMerek = !selectedMerek || m.merek === selectedMerek;
    return matchSearch && matchMerek;
  });

  const formatHarga = (h: number) => `Rp ${h} Juta`;

  return (
    <>
      <style>{`
        .spk-hero {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
          min-height: 75vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
        }
        .spk-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .spk-hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(15,52,96,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .spk-hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .spk-hero-badge {
          display: inline-block;
          background: rgba(233,69,96,0.2);
          border: 1px solid rgba(233,69,96,0.4);
          color: #e94560;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .spk-hero h1 {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin: 0 0 1rem;
        }
        .spk-hero-highlight {
          background: linear-gradient(135deg, #e94560, #ff6b35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .spk-hero p {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 0 0 2rem;
        }
        .spk-hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .spk-btn-primary {
          background: linear-gradient(135deg, #e94560, #c23152);
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(233,69,96,0.35);
          display: inline-block;
        }
        .spk-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(233,69,96,0.45);
          color: white;
        }
        .spk-btn-outline {
          background: transparent;
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          transition: all 0.3s;
          display: inline-block;
        }
        .spk-btn-outline:hover {
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .spk-hero-img {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12rem;
          filter: drop-shadow(0 0 40px rgba(233,69,96,0.3));
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .spk-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .spk-stat { text-align: center; }
        .spk-stat-val {
          font-size: 1.8rem;
          font-weight: 900;
          color: #e94560;
          display: block;
        }
        .spk-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .spk-section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .spk-section-title {
          text-align: center;
          margin-bottom: 3rem;
        }
        .spk-section-title h2 {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin: 0 0 0.5rem;
        }
        .spk-section-title p {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
        }
        .spk-brands {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin-bottom: 4rem;
        }
        .spk-brand-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }
        .spk-brand-card:hover, .spk-brand-card.active {
          background: rgba(233,69,96,0.15);
          border-color: rgba(233,69,96,0.4);
          transform: translateY(-4px);
        }
        .spk-brand-emoji { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
        .spk-brand-name { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); }
        .spk-search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .spk-search-input {
          flex: 1;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }
        .spk-search-input::placeholder { color: rgba(255,255,255,0.4); }
        .spk-search-input:focus { border-color: rgba(233,69,96,0.6); background: rgba(255,255,255,0.12); }
        .spk-cars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .spk-car-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s;
          text-decoration: none;
          display: block;
        }
        .spk-car-card:hover {
          transform: translateY(-6px);
          border-color: rgba(233,69,96,0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .spk-car-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
        }
        .spk-car-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .spk-car-body { padding: 1.25rem; }
        .spk-car-merek {
          font-size: 0.75rem;
          font-weight: 700;
          color: #e94560;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .spk-car-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }
        .spk-car-price {
          font-size: 1.3rem;
          font-weight: 900;
          color: #e94560;
          margin-bottom: 0.75rem;
        }
        .spk-car-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .spk-badge {
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .spk-badge-green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
        .spk-badge-red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
        .spk-badge-gray { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
        .spk-empty {
          text-align: center;
          padding: 4rem;
          color: rgba(255,255,255,0.4);
        }
        .spk-empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
        @media (max-width: 768px) {
          .spk-hero-container { grid-template-columns: 1fr; gap: 2rem; }
          .spk-hero-img { font-size: 7rem; }
          .spk-brands { grid-template-columns: repeat(3, 1fr); }
          .spk-hero h1 { font-size: 2rem; }
        }
        @media (max-width: 480px) {
          .spk-brands { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="spk-hero">
        <div className="spk-hero-container">
          <div>
            <div className="spk-hero-badge">✨ SPK Terpercaya</div>
            <h1>
              Temukan Laptop Bekas<br />
              <span className="spk-hero-highlight">Terbaik Untukmu</span>
            </h1>
            <p>
              Platform jual beli laptop bekas dengan sistem rekomendasi cerdas berbasis metode
              WP (Weighted Product). Aman, Terjamin, dan Terpercaya.
            </p>
            <div className="spk-hero-btns">
              <Link href="#browse" className="spk-btn-primary">🔍 Cari Laptop</Link>
              <Link href="/spk" className="spk-btn-outline">📊 Lihat Rekomendasi WP</Link>
            </div>
            <div className="spk-stats">
              <div className="spk-stat">
                <span className="spk-stat-val">{laptops.length}+</span>
                <span className="spk-stat-label">Laptop Tersedia</span>
              </div>
              <div className="spk-stat">
                <span className="spk-stat-val">6</span>
                <span className="spk-stat-label">Kriteria WP</span>
              </div>
              <div className="spk-stat">
                <span className="spk-stat-val">100%</span>
                <span className="spk-stat-label">Terpercaya</span>
              </div>
            </div>
          </div>
          <div className="spk-hero-img">💻</div>
        </div>
      </section>

      {/* Browse Section */}
      <div id="browse" className="spk-section">
        {/* Section Title */}
        <div className="spk-section-title">
          <h2>🏷️ Cari Laptop Sesuai Merek Favorit Anda</h2>
          <p>Temukan laptop impian dari berbagai merek populer dengan harga dan spesifikasi terbaik</p>
        </div>

        {/* Brand Filter */}
        <div className="spk-brands">
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              className={`spk-brand-card ${selectedMerek === brand.name ? 'active' : ''}`}
              onClick={() => setSelectedMerek(selectedMerek === brand.name ? '' : brand.name)}
              style={{ border: 'none' }}
            >
              <span className="spk-brand-emoji">{brand.emoji}</span>
              <span className="spk-brand-name">{brand.name}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="spk-search-bar">
          <input
            className="spk-search-input"
            type="text"
            placeholder="🔍 Cari nama atau merek laptop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {(search || selectedMerek) && (
            <button
              onClick={() => { setSearch(''); setSelectedMerek(''); }}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="spk-empty">
            <span className="spk-empty-icon">⏳</span>
            <p>Memuat data laptop...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="spk-empty">
            <span className="spk-empty-icon">🔍</span>
            <p>Tidak ada laptop yang ditemukan</p>
          </div>
        ) : (
          <div className="spk-cars-grid">
            {filtered.map((lap) => (
              <Link key={lap.id} href={`/detail/${lap.slug}`} className="spk-car-card">
                <div className="spk-car-img">
                  {lap.gambar ? (
                    <img
                      src={lap.gambar}
                      alt={lap.nama}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '💻';
                      }}
                    />
                  ) : '💻'}
                </div>
                <div className="spk-car-body">
                  <div className="spk-car-merek">{lap.merek}</div>
                  <div className="spk-car-name">{lap.nama}</div>
                  <div className="spk-car-price">{formatHarga(lap.harga || lap.c1 || 0)}</div>
                  <div className="spk-car-badges">
                    <span className={`spk-badge ${lap.ketersediaan?.toLowerCase() === 'tersedia' ? 'spk-badge-green' : 'spk-badge-red'}`}>
                      {lap.ketersediaan || 'Tersedia'}
                    </span>
                    <span className="spk-badge spk-badge-gray">{lap.tahun}</span>
                    <span className="spk-badge spk-badge-gray">{lap.ram_gb} GB RAM</span>
                    <span className="spk-badge spk-badge-gray">{lap.tipe_laptop || '—'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
