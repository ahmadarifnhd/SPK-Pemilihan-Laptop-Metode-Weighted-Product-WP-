'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Laptop, Kriteria } from '@/lib/database-spk';

export default function DetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/laptops?slug=${slug}`).then((r) => r.json()),
      fetch('/api/kriteria').then((r) => r.json()),
    ])
      .then(([laptopData, kriteriaData]) => {
        setLaptop(laptopData?.error ? null : laptopData);
        setKriteria(Array.isArray(kriteriaData) ? kriteriaData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <p>Memuat detail laptop...</p>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2>Laptop tidak ditemukan</h2>
        <Link href="/" style={{ color: '#e94560' }}>
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const buildContactMessage = () => {
    const fields = kriteria.map((k) => {
      const fieldName = k.kode.toLowerCase() as keyof Laptop;
      const value = laptop[fieldName] ?? '-';
      return `${k.nama}: ${value}`;
    });
    return `Saya berencana membeli laptop dengan spesifikasi berikut:\nNama: ${laptop.nama},\nKode unit: ${laptop.kode_unit},\nSeri: ${laptop.seri || '-'},\n${fields.join(',\n')},\nPemilik: ${laptop.pemilik},\nAlamat: ${laptop.alamat_pemilik}.`;
  };

  return (
    <>
      <style>{`
        .detail-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .breadcrumb-wrap {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0.75rem 2rem;
        }
        .breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .breadcrumb a { color: rgba(255,255,255,0.5); text-decoration: none; }
        .breadcrumb a:hover { color: #e94560; }
        .breadcrumb span { color: rgba(255,255,255,0.3); }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          margin-top: 2rem;
        }
        .detail-img-wrap {
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7rem;
        }
        .detail-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-desc {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }
        .detail-desc h3 { color: white; margin: 0 0 0.5rem; font-size: 1rem; }
        .detail-desc p { color: rgba(255,255,255,0.6); margin: 0; font-size: 0.95rem; line-height: 1.6; }
        .detail-merek {
          font-size: 0.8rem;
          font-weight: 700;
          color: #e94560;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }
        .detail-name {
          font-size: 2rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.5rem;
        }
        .detail-nopol { color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .detail-price {
          font-size: 2rem;
          font-weight: 900;
          color: #e94560;
          margin-bottom: 1.5rem;
        }
        .detail-spec-list { list-style: none; padding: 0; margin: 0 0 1.5rem; }
        .detail-spec-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 0.95rem;
        }
        .spec-label { color: rgba(255,255,255,0.5); }
        .spec-value { color: white; font-weight: 500; text-align: right; max-width: 60%; }
        .detail-booking-btn {
          display: inline-block;
          width: 100%;
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #e94560, #c23152);
          color: white;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .detail-booking-btn:hover { transform: translateY(-2px); color: white; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr; }
          .detail-name { font-size: 1.5rem; }
          .detail-price { font-size: 1.8rem; }
        }
      `}</style>

      <div className="breadcrumb-wrap">
        <div className="breadcrumb">
          <Link href="/">Beranda</Link>
          <span>›</span>
          <span>Detail</span>
          <span>›</span>
          <span style={{ color: 'white' }}>{laptop.nama}</span>
        </div>
      </div>

      <div className="detail-page">
        <div className="detail-grid">
          <div>
            <div className="detail-img-wrap">
              {laptop.gambar ? (
                <img
                  src={laptop.gambar}
                  alt={laptop.nama}
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '💻';
                  }}
                />
              ) : (
                '💻'
              )}
            </div>
            <div className="detail-desc">
              <h3>Deskripsi</h3>
              <p>{laptop.deskripsi || 'Tidak ada deskripsi.'}</p>
            </div>
          </div>

          <div className="detail-info-col">
            <div className="detail-merek">{laptop.merek}</div>
            <h1 className="detail-name">{laptop.nama}</h1>
            <div className="detail-nopol">
              Kode unit:{' '}
              <strong style={{ color: 'white' }}>{laptop.kode_unit || '—'}</strong>
            </div>
            <div className="detail-price">Rp.{laptop.c1 || laptop.harga} Juta</div>

            <ul className="detail-spec-list">
              {kriteria.map((k) => {
                const fieldName = k.kode.toLowerCase() as keyof Laptop;
                const value = laptop[fieldName] ?? '-';
                return (
                  <li key={k.id} className="detail-spec-item">
                    <span className="spec-label">{k.nama}</span>
                    <span className="spec-value">{String(value)}</span>
                  </li>
                );
              })}
              <li className="detail-spec-item">
                <span className="spec-label">Prosesor</span>
                <span className="spec-value">{laptop.processor || '-'}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">RAM</span>
                <span className="spec-value">{laptop.ram_gb != null ? `${laptop.ram_gb} GB` : '-'}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Penyimpanan</span>
                <span className="spec-value">{laptop.storage_gb != null ? `${laptop.storage_gb} GB` : '-'}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Seri</span>
                <span className="spec-value">{laptop.seri || '-'}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Tipe Laptop</span>
                <span className="spec-value">{laptop.tipe_laptop || '-'}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Warna</span>
                <span className="spec-value">{laptop.warna}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Ketersediaan</span>
                <span
                  className="spec-value"
                  style={{
                    color: laptop.ketersediaan?.toLowerCase() === 'tersedia' ? '#22c55e' : '#ef4444',
                  }}
                >
                  {laptop.ketersediaan}
                </span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Pemilik</span>
                <span className="spec-value">{laptop.pemilik}</span>
              </li>
              <li className="detail-spec-item">
                <span className="spec-label">Alamat Pemilik</span>
                <span className="spec-value">{laptop.alamat_pemilik}</span>
              </li>
            </ul>

            <Link
              href={`/contact?subjek=Pembelian Laptop&pesan=${encodeURIComponent(buildContactMessage())}`}
              className="detail-booking-btn"
            >
              Hubungi untuk pembelian
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
