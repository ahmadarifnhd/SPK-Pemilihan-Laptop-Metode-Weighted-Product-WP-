'use client';

import React, { useState, useEffect } from 'react';

export default function AlternatifPage() {
  const [alternatif, setAlternatif] = useState<any[]>([]);
  const [kriteria, setKriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    nama: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resAlt, resKrit] = await Promise.all([
        fetch('/api/alternatif'),
        fetch('/api/kriteria'),
      ]);
      const dataAlt = await resAlt.json();
      const dataKrit = await resKrit.json();

      const nextAlternatif = Array.isArray(dataAlt) ? dataAlt : [];
      const nextKriteria = Array.isArray(dataKrit) ? dataKrit : [];

      setAlternatif(nextAlternatif);
      setKriteria(nextKriteria);

      // Keep form keys in sync with criteria so new criteria (C7, C8, ...) appear automatically.
      setFormData((prev: any) => {
        const next = { ...prev };
        for (const k of nextKriteria) {
          if (next[k.kode] === undefined) {
            next[k.kode] = '';
          }
        }
        return next;
      });
    } catch (err) {
      console.error('Gagal memuat data alternatif:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCriterionValue = (item: any, kode: string): any => {
    const lower = kode.toLowerCase();
    if (item?.[kode] !== undefined && item?.[kode] !== null) return item[kode];
    if (item?.[lower] !== undefined && item?.[lower] !== null) return item[lower];
    return '';
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      const dynamicValues: Record<string, string> = {};
      for (const k of kriteria) {
        const raw = getCriterionValue(item, k.kode);
        dynamicValues[k.kode] = raw === '' ? '' : String(raw);
      }

      setFormData({
        id: item.id,
        nama: item.nama,
        ...dynamicValues,
      });
    } else {
      const emptyValues: Record<string, string> = {};
      for (const k of kriteria) {
        emptyValues[k.kode] = '';
      }

      setFormData({
        id: null,
        nama: '',
        ...emptyValues,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/alternatif/${formData.id}` : '/api/alternatif';
    const method = formData.id ? 'PUT' : 'POST';

    const payload: Record<string, any> = {
      id: formData.id,
      nama: formData.nama,
    };
    for (const k of kriteria) {
      const raw = formData[k.kode];
      if (raw === '' || raw === undefined || raw === null) {
        payload[k.kode] = 0;
      } else {
        const asNumber = Number(raw);
        payload[k.kode] = Number.isFinite(asNumber) ? asNumber : raw;
      }
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    } else {
      const data = await res.json();
      alert(data.error || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Yakin ingin menghapus alternatif ini?')) {
      const res = await fetch(`/api/alternatif/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Terjadi kesalahan');
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white">
          Manajemen Alternatif
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Alternatif
        </button>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Memuat...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:pl-6">Alternatif</th>
                {kriteria.map(k => (
                  <th key={k.kode} className="px-4 py-4 font-medium text-gray-800 dark:text-white">
                    {k.nama} ({k.kode})
                  </th>
                ))}
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alternatif.length === 0 && (
                <tr>
                  <td colSpan={kriteria.length + 2} className="px-4 py-6 text-center text-gray-500">Tidak ada alternatif.</td>
                </tr>
              )}
              {alternatif.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-4 xl:pl-6 font-semibold text-gray-800 dark:text-white">{item.nama}</td>
                  {kriteria.map(k => (
                    <td key={k.kode} className="px-4 py-4 dark:text-white">
                      {getCriterionValue(item, k.kode) || '-'}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/30 dark:bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 border dark:border-gray-800 text-gray-900">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              {formData.id ? 'Edit Alternatif' : 'Tambah Alternatif'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Nama Alternatif (Laptop)</label>
                <input type="text" placeholder="Masukkan nama alternatif" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {kriteria.map(k => (
                  <div key={k.kode}>
                    <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">
                      {k.nama} ({k.kode})
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Masukkan nilai"
                      value={formData[k.kode]}
                      onChange={(e) => setFormData({ ...formData, [k.kode]: e.target.value })}
                      className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  Batal
                </button>
                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
