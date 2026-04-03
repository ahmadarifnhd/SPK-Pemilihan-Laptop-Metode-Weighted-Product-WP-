import type { Metadata } from 'next';
import FrontendNavbar from '@/components/spk/FrontendNavbar';

export const metadata: Metadata = {
  title: 'Laptopku — SPK Laptop Bekas (WP)',
  description: 'Platform rekomendasi laptop bekas dengan metode WP (Weighted Product)',
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: 'Inter, sans-serif' }}>
      <FrontendNavbar />
      <main>{children}</main>
      <footer style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        marginTop: '4rem'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          © 2024 <strong style={{ color: '#e94560' }}>Laptopku</strong> — Sistem Pendukung Keputusan Pemilihan Laptop Bekas
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '0.8rem' }}>
          Menggunakan Metode WP (Weighted Product) | Universitas Islam Kadiri - Kediri
        </p>
      </footer>
    </div>
  );
}
