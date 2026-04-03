'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { WpCalculationResponse } from '@/types/spk';
import type { Laptop } from '@/lib/database-spk';

export default function SpkPage() {
  const [data, setData] = useState<WpCalculationResponse | null>(null);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([fetch('/api/spk/wp'), fetch('/api/laptops')])
      .then(async ([wpRes, laptopRes]) => {
        const wpJson = await wpRes.json();
        const laptopJson = await laptopRes.json();

        setData(wpJson?.data ?? null);
        setLaptops(Array.isArray(laptopJson) ? laptopJson : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p>Menghitung Rekomendasi WP...</p>
      </div>
    );
  }

  const rankedAlternatives = data?.results ?? [];
  if (!data || rankedAlternatives.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
        <p>Belum ada data alternatif untuk dihitung</p>
      </div>
    );
  }

  const criteria = data.criteria ?? [];
  const normalizeText = (value: string) => value.trim().toLowerCase();
  const getCriterionRawValue = (item: Laptop, kode: string) => {
    const lower = kode.toLowerCase();
    return (item as any)[lower] ?? (item as any)[kode] ?? null;
  };
  const formatCriterionValue = (criterionName: string, value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    const name = criterionName.toLowerCase();
    if (name.includes('harga')) return `${value} Juta`;
    if (name.includes('ram')) return `${value} GB`;
    if (name.includes('penyimpanan') || name.includes('storage')) return `${value} GB`;
    if (name.includes('layar') || name.includes('ukuran')) return `${value} inch`;
    if (name.includes('baterai')) return `${value}%`;
    return String(value);
  };

  const mergedResults = rankedAlternatives.map((result) => {
    const matchedLaptop = laptops.find((item) => normalizeText(item.nama) === normalizeText(result.nama));
    return { result, laptop: matchedLaptop };
  });

  const filteredResults = mergedResults.filter(({ result, laptop }) => {
    const keyword = search.toLowerCase();
    const byAltName = result.nama.toLowerCase().includes(keyword);
    const byBrand = laptop?.merek?.toLowerCase().includes(keyword) ?? false;
    const byCode = laptop?.kode_unit?.toLowerCase().includes(keyword) ?? false;
    return byAltName || byBrand || byCode;
  });

  return (
    <>
      <style>{`
        .spk-result-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .spk-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(233,69,96,0.1) 0%, rgba(15,52,96,0.2) 100%);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .spk-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
          color: white;
          margin: 0 0 1rem;
        }
        .spk-header p {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .spk-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .spk-search {
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 0.95rem;
          width: 300px;
          outline: none;
        }
        .spk-search:focus { border-color: #e94560; background: rgba(255,255,255,0.1); }
        .spk-table-wrap {
          background: #16213e;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow-x: auto;
        }
        .spk-table {
          width: 100%;
          border-collapse: collapse;
          color: white;
          min-width: 800px;
        }
        .spk-table th, .spk-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .spk-table th {
          background: rgba(255,255,255,0.03);
          font-weight: 600;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .spk-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }
        .spk-table tr:first-child td {
          background: rgba(233,69,96,0.1) !important;
        }
        .spk-rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .spk-rank-1 { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; box-shadow: 0 4px 10px rgba(245,158,11,0.4); }
        .spk-rank-2 { background: linear-gradient(135deg, #9ca3af, #6b7280); color: white; box-shadow: 0 4px 10px rgba(107,114,128,0.4); }
        .spk-rank-3 { background: linear-gradient(135deg, #d97706, #b45309); color: white; box-shadow: 0 4px 10px rgba(180,83,9,0.4); }
        .spk-action-btn {
          padding: 8px 16px;
          background: rgba(233,69,96,0.15);
          color: #e94560;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .spk-action-btn:hover { background: #e94560; color: white; }
        .spk-car-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .spk-car-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          background: rgba(255,255,255,0.1);
        }
        .spk-car-brand { font-size: 0.75rem; color: #e94560; font-weight: 700; text-transform: uppercase; }
        .spk-car-name { font-weight: 600; font-size: 0.95rem; }
        @media (max-width: 768px) {
          .spk-toolbar { flex-direction: column; gap: 1rem; align-items: stretch; }
          .spk-search { width: 100%; }
        }
      `}</style>

      <div className="breadcrumb-wrap" style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Beranda</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'white' }}>Rekomendasi WP</span>
        </div>
      </div>

      <div className="spk-result-page">
        <div className="spk-header">
          <h1>🏆 Hasil Rekomendasi WP</h1>
          <p>
            Berikut adalah daftar rekomendasi alternatif terbaik yang dihitung menggunakan metode
            Weighted Product (WP) berdasarkan preferensi bobot kriteria sistem.
          </p>
        </div>

        <div className="spk-toolbar">
          <input
            type="text"
            placeholder="🔍 Cari laptop..."
            className="spk-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="spk-table-wrap">
          <table className="spk-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
                <th>Gambar</th>
                <th>Kode Unit</th>
                <th>Laptop</th>
                {criteria.map((criterion) => (
                  <th key={`head-${criterion.id}`}>{criterion.nama}</th>
                ))}
                <th>Status</th>
                <th>Vector S</th>
                <th>Vector V</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length > 0 ? (
                filteredResults.map(({ result, laptop }) => {
                  return (
                    <tr key={result.id}>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`spk-rank-badge ${result.rank === 1 ? 'spk-rank-1' : result.rank === 2 ? 'spk-rank-2' : result.rank === 3 ? 'spk-rank-3' : ''}`}>
                          {result.rank}
                        </span>
                      </td>
                      <td>
                        {laptop?.gambar ? (
                          <img src={laptop.gambar} alt={laptop.nama} className="spk-car-thumb" />
                        ) : (
                          <div className="spk-car-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            💻
                          </div>
                        )}
                      </td>
                      <td>{laptop?.kode_unit ?? '-'}</td>
                      <td>
                        <div className="spk-car-name">{result.nama}</div>
                        <div className="spk-car-brand">{laptop?.merek ?? '-'}</div>
                      </td>
                      {criteria.map((criterion) => (
                        <td key={`${result.id}-${criterion.id}`}>
                          {laptop
                            ? formatCriterionValue(criterion.nama, getCriterionRawValue(laptop, criterion.kode))
                            : '-'}
                        </td>
                      ))}
                      <td>{laptop?.ketersediaan ?? '-'}</td>
                      <td>
                        <strong style={{ color: result.rank === 1 ? '#e94560' : 'white', fontSize: '1.1rem' }}>
                          {result.vector_s.toFixed(6)}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: result.rank === 1 ? '#e94560' : 'white', fontSize: '1.1rem' }}>
                          {result.vector_v.toFixed(6)}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {laptop?.slug ? (
                          <Link href={`/detail/${laptop.slug}`} className="spk-action-btn">
                            Lihat Detail
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={criteria.length + 9} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)' }}>🔍</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Tidak ada alternatif yang ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
