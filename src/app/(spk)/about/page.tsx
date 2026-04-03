import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Laptopku — SPK Laptop Bekas (WP)',
  description: 'Tentang platform sistem pendukung keputusan pemilihan laptop bekas menggunakan metode WP',
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .about-breadcrumb {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0.75rem 2rem;
        }
        .about-breadcrumb-inner {
          max-width: 1000px;
          margin: 0 auto;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        .about-breadcrumb-inner a { color: rgba(255,255,255,0.5); text-decoration: none; }
        .about-breadcrumb-inner a:hover { color: #e94560; }
        .about-hero {
          text-align: center;
          padding: 4rem 2rem 2rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(233,69,96,0.1) 0%, transparent 70%);
        }
        .about-logo {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e94560, #0f3460);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          margin: 0 auto 1.5rem;
          border: 4px solid rgba(255,255,255,0.1);
          position: relative;
          z-index: 1;
        }
        .about-hero h1 {
          font-size: 2.2rem;
          font-weight: 900;
          color: white;
          margin: 0 0 0.5rem;
          position: relative;
          z-index: 1;
        }
        .about-hero p {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          position: relative;
          z-index: 1;
        }
        .about-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(233,69,96,0.5), transparent);
          margin: 0 4rem;
        }
        .about-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }
        .about-overview h2 {
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          text-align: center;
          margin: 0 0 2rem;
        }
        .about-text {
          color: rgba(255,255,255,0.7);
          line-height: 1.9;
          font-size: 1rem;
          text-indent: 2.5em;
          margin-bottom: 1.5rem;
        }
        .about-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .about-feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s;
        }
        .about-feature-card:hover {
          background: rgba(233,69,96,0.08);
          border-color: rgba(233,69,96,0.3);
          transform: translateY(-4px);
        }
        .about-feature-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
        .about-feature-title { font-size: 1rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .about-feature-desc { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
        @media (max-width: 768px) {
          .about-features { grid-template-columns: 1fr; }
          .about-hero h1 { font-size: 1.6rem; }
        }
      `}</style>

      <div className="about-breadcrumb">
        <div className="about-breadcrumb-inner">
          <a href="/">Beranda</a> &rsaquo; <span style={{ color: 'white' }}>Tentang</span>
        </div>
      </div>

      <div className="about-hero">
        <div className="about-logo">🎓</div>
        <h1>Fakultas Teknik</h1>
        <p>Universitas Islam Kadiri - Kediri</p>
      </div>
      <div className="about-divider" />

      <div className="about-content">
        <div className="about-overview">
          <h2>Overview</h2>
          <p className="about-text">
            Platform ini merupakan sebuah Sistem Pendukung Keputusan (SPK) untuk pemilihan laptop bekas
            yang dirancang untuk membantu pengguna menentukan pilihan perangkat terbaik sesuai kebutuhan dan preferensi
            mereka. Melalui sistem ini, pengguna dapat menelusuri laptop bekas berdasarkan merek,
            harga, spesifikasi, dan kondisi, serta memperoleh rekomendasi objektif dari analisis
            berbasis metode Weighted Product (WP).
          </p>
          <p className="about-text">
            Dengan mengintegrasikan data dan kriteria seperti harga, RAM, penyimpanan, tahun, ukuran layar, dan kondisi baterai,
            platform ini menghadirkan solusi informatif dan efisien bagi calon pembeli laptop bekas. Tujuannya adalah meminimalkan risiko
            kesalahan dalam pengambilan keputusan dan membantu pengguna menemukan laptop
            yang sesuai preferensi dan anggaran.
          </p>
        </div>

        <div className="about-features">
          <div className="about-feature-card">
            <span className="about-feature-icon">🎯</span>
            <div className="about-feature-title">Metode WP</div>
            <div className="about-feature-desc">Weighted Product untuk rekomendasi laptop yang objektif berdasarkan bobot kriteria</div>
          </div>
          <div className="about-feature-card">
            <span className="about-feature-icon">📊</span>
            <div className="about-feature-title">Multi Kriteria</div>
            <div className="about-feature-desc">Penilaian berdasarkan harga, RAM, penyimpanan, tahun, layar, dan kondisi baterai</div>
          </div>
          <div className="about-feature-card">
            <span className="about-feature-icon">🔒</span>
            <div className="about-feature-title">Aman & Terpercaya</div>
            <div className="about-feature-desc">Data laptop dan informasi penjual ditampilkan secara transparan</div>
          </div>
        </div>
      </div>
    </>
  );
}
