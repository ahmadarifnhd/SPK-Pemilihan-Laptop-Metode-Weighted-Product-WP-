'use client';

import React, { useState, useEffect } from 'react';

export default function KriteriaPage() {
  const [kriteria, setKriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, kode: '', nama: '', bobot: '', atribut: 'Benefit', sub_kriteria: [''], skor_sub_kriteria: [''] });

  useEffect(() => {
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    try {
      const res = await fetch('/api/kriteria');
      const data = await res.json();
      setKriteria(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat kriteria:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (k: any = null) => {
    if (k) {
      setFormData({
        id: k.id,
        kode: k.kode,
        nama: k.nama,
        bobot: k.bobot.toString(),
        atribut: k.atribut,
        sub_kriteria: k.sub_kriterias?.length > 0 ? k.sub_kriterias.map((sk: any) => sk.sub_kriteria) : [''],
        skor_sub_kriteria: k.sub_kriterias?.length > 0 ? k.sub_kriterias.map((sk: any) => sk.skor_sub_kriteria.toString()) : ['']
      });
    } else {
      setFormData({ id: null, kode: '', nama: '', bobot: '', atribut: 'Benefit', sub_kriteria: [''], skor_sub_kriteria: [''] });
    }
    setIsModalOpen(true);
  };

  const handleSubKriteriaChange = (index: number, field: 'sub_kriteria' | 'skor_sub_kriteria', value: string) => {
    const newData = { ...formData };
    newData[field][index] = value;
    setFormData(newData);
  };

  const addSubKriteria = () => {
    setFormData({
      ...formData,
      sub_kriteria: [...formData.sub_kriteria, ''],
      skor_sub_kriteria: [...formData.skor_sub_kriteria, '']
    });
  };

  const removeSubKriteria = (index: number) => {
    const newSubKriteria = [...formData.sub_kriteria];
    const newSkor = [...formData.skor_sub_kriteria];
    newSubKriteria.splice(index, 1);
    newSkor.splice(index, 1);
    setFormData({
      ...formData,
      sub_kriteria: newSubKriteria.length > 0 ? newSubKriteria : [''],
      skor_sub_kriteria: newSkor.length > 0 ? newSkor : ['']
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.id ? `/api/kriteria/${formData.id}` : '/api/kriteria';
    const method = formData.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchKriteria();
    } else {
      const data = await res.json();
      alert(data.error || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Yakin ingin menghapus kriteria ini? Ini juga akan menghapus data kolom pada alternatif.')) {
      const res = await fetch(`/api/kriteria/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchKriteria();
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
          Manajemen Kriteria & Sub Kriteria
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={kriteria.length >= 20}
        >
          {kriteria.length >= 20 ? 'Maksimal 20 Kriteria' : '+ Tambah Kriteria'}
        </button>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Memuat...</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left dark:bg-gray-800">
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:pl-6">Kode</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Kriteria</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Atribut</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Bobot</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Sub Kriteria</th>
                  <th className="px-4 py-4 font-medium text-gray-800 dark:text-white text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kriteria.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Tidak ada kriteria.</td>
                  </tr>
                )}
                {kriteria.map((item, index) => (
                  <tr key={item.id} className={index !== kriteria.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}>
                    <td className="px-4 py-4 xl:pl-6">
                      <span className="font-semibold text-gray-800 dark:text-white">{item.kode}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-800 dark:text-white">{item.nama}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.atribut === 'Benefit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.atribut}
                      </span>
                    </td>
                    <td className="px-4 py-4 dark:text-white">{item.bobot}</td>
                    <td className="px-4 py-4">
                      <ul className="list-disc pl-4 text-sm dark:text-gray-300">
                        {item.sub_kriterias?.map((sk: any, i: number) => (
                          <li key={i}>{sk.sub_kriteria} (Skor: {sk.skor_sub_kriteria})</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3.5">
                        <button onClick={() => handleOpenModal(item)} className="hover:text-blue-500 dark:text-white">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="hover:text-red-500 dark:text-white text-red-500">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/30 dark:bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900 border dark:border-gray-800 max-h-[90vh] overflow-y-auto text-gray-900">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              {formData.id ? 'Edit Kriteria' : 'Tambah Kriteria'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Kode Kriteria</label>
                  <input type="text" value={formData.kode} onChange={e => setFormData({ ...formData, kode: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Nama Kriteria</label>
                  <input type="text" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Bobot</label>
                  <input type="number" step="0.01" value={formData.bobot} onChange={e => setFormData({ ...formData, bobot: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Atribut</label>
                  <select value={formData.atribut} onChange={e => setFormData({ ...formData, atribut: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-800 dark:text-white">Sub Kriteria</label>
                  <button type="button" onClick={addSubKriteria} className="text-sm text-blue-500 hover:underline">+ Tambah Sub</button>
                </div>
                {formData.sub_kriteria.map((sub, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <input type="text" placeholder="Nilai/Rentang (Text / Angka)" value={sub} onChange={e => handleSubKriteriaChange(index, 'sub_kriteria', e.target.value)} className="flex-1 rounded border px-3 py-2 text-sm bg-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                    <input type="number" placeholder="Skor" value={formData.skor_sub_kriteria[index]} onChange={e => handleSubKriteriaChange(index, 'skor_sub_kriteria', e.target.value)} className="w-24 rounded border px-3 py-2 text-sm bg-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                    <button type="button" onClick={() => removeSubKriteria(index)} className="rounded bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200">✗</button>
                  </div>
                ))}
                <p className="mt-2 text-xs text-gray-500">Gunakan format operator untuk sub kriteria angka (contoh: "&lt; 150", "150 - 200", "&gt;= 300") atau teks biasa (contoh: "Bensin").</p>
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
