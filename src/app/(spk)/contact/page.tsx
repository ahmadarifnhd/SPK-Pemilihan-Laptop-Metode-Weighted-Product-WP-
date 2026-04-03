'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const searchParams = useSearchParams();
  const initSubjek = searchParams?.get('subjek') || '';
  const initPesan = searchParams?.get('pesan') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nomor: '',
    subjek: initSubjek,
    pesan: initPesan,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Pesan Anda Berhasil DiKirim');
        setFormData({ name: '', email: '', nomor: '', subjek: '', pesan: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Terjadi kesalahan');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Gagal mengirim pesan');
    }
  };

  return (
    <div className="contact-from-area">
      <h3 className="mb-10 text-center text-white">Kontak Kami</h3>
      <p className="text-white mb-30 text-center font-sm" style={{ marginBottom: '2rem' }}>
        Silahkan tinggalkan pesan anda, pada kolom yang tersedia
      </p>

      {status === 'success' && (
        <div style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '1rem' }}>
          {message}
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form-style text-center">
        <div className="contact-grid">
          <input
            name="name"
            placeholder="Nama Lengkap"
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="contact-input"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="contact-input"
          />
          <input
            name="nomor"
            placeholder="Telepon"
            type="tel"
            required
            value={formData.nomor}
            onChange={e => setFormData({ ...formData, nomor: e.target.value })}
            className="contact-input"
          />
          <input
            name="subjek"
            placeholder="Subjek"
            type="text"
            required
            value={formData.subjek}
            onChange={e => setFormData({ ...formData, subjek: e.target.value })}
            className="contact-input"
          />
          <textarea
            name="pesan"
            placeholder="Pesan"
            required
            rows={6}
            value={formData.pesan}
            onChange={e => setFormData({ ...formData, pesan: e.target.value })}
            className="contact-input contact-textarea"
          />
        </div>
        <button type="submit" className="contact-submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <style>{`
        .contact-breadcrumb {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0.75rem 2rem;
        }
        .contact-breadcrumb-inner {
          max-width: 1000px;
          margin: 0 auto;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        .contact-breadcrumb-inner a { color: rgba(255,255,255,0.5); text-decoration: none; }
        .contact-breadcrumb-inner a:hover { color: #e94560; }
        .contact-container {
          max-width: 800px;
          margin: 4rem auto;
          padding: 0 2rem;
        }
        .contact-from-area {
          background-color: #1a1a2e;
          border-radius: 16px;
          padding: 3rem 2rem;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .contact-textarea {
          grid-column: 1 / -1;
        }
        .contact-input {
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.3s;
          outline: none;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.4); }
        .contact-input:focus { border-color: #e94560; background: rgba(255,255,255,0.1); }
        .contact-submit {
          background: linear-gradient(135deg, #e94560, #c23152);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 6px 20px rgba(233,69,96,0.35);
        }
        .contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(233,69,96,0.45);
        }
        .contact-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="contact-breadcrumb">
        <div className="contact-breadcrumb-inner">
          <a href="/">Beranda</a> &rsaquo; <span style={{ color: 'white' }}>Contact</span>
        </div>
      </div>

      <div className="contact-container">
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </>
  );
}
