'use client';

import React, { useState, useEffect } from 'react';

export default function LaptopsPage() {
  const [laptops, setLaptops] = useState<any[]>([]);
  const [kriteria, setKriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    kode_unit: '',
    nama: '',
    merek: '',
    harga: '',
    tahun: '',
    ram_gb: '',
    storage_gb: '',
    processor: '',
    layar_inci: '',
    kondisi_baterai: '',
    tipe_laptop: '',
    warna: '',
    pemilik: '',
    alamat_pemilik: '',
    deskripsi: '',
    ketersediaan: 'Tersedia',
    seri: '',
    gambar: null,
    filePic: null,
    imagePreview: null,
    slug: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [resLaptops, resKrit] = await Promise.all([
      fetch('/api/laptops'),
      fetch('/api/kriteria'),
    ]);
    const dLaptops = await resLaptops.json();
    const dKrit = await resKrit.json();
    setLaptops(Array.isArray(dLaptops) ? dLaptops : []);
    setKriteria(Array.isArray(dKrit) ? dKrit : []);
    setLoading(false);
  };

  const defaultFormData = () => ({
    id: null,
    kode_unit: '',
    nama: '',
    merek: '',
    harga: '',
    tahun: '',
    ram_gb: '',
    storage_gb: '',
    processor: '',
    layar_inci: '',
    kondisi_baterai: '',
    tipe_laptop: '',
    warna: '',
    pemilik: '',
    alamat_pemilik: '',
    deskripsi: '',
    ketersediaan: 'Tersedia',
    seri: '',
    gambar: null,
    filePic: null,
    imagePreview: null,
    slug: '',
  });

  const handleOpenModal = (item: any = null) => {
    if (item) {
      const initData = { ...defaultFormData(), ...item, filePic: null, imagePreview: item.gambar };
      kriteria.forEach((k) => {
        const key = k.kode.toLowerCase();
        if (item[key] !== undefined) initData[key] = item[key];
        else if (initData[key] === undefined) initData[key] = '';
      });
      setFormData(initData);
    } else {
      const initData: any = { ...defaultFormData() };
      kriteria.forEach((k) => (initData[k.kode.toLowerCase()] = ''));
      setFormData(initData);
    }
    setIsModalOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        filePic: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let { filePic, imagePreview, ...payload } = formData;

    if (!payload.slug) payload.slug = generateSlug(payload.nama);

    if (filePic) {
      const formUpload = new FormData();
      formUpload.append('file', filePic);
      formUpload.append('folder', 'laptops');
      const resImg = await fetch('/api/upload', { method: 'POST', body: formUpload });
      const imgData = await resImg.json();
      if (imgData.success) {
        payload.gambar = imgData.url;
      }
    }

    payload.harga = parseFloat(payload.harga) || 0;
    payload.tahun = parseInt(payload.tahun) || 0;
    payload.ram_gb = parseInt(payload.ram_gb) || 0;
    payload.storage_gb = parseInt(payload.storage_gb) || 0;
    payload.layar_inci = parseFloat(payload.layar_inci) || 0;
    payload.kondisi_baterai = parseInt(payload.kondisi_baterai) || 0;

    kriteria.forEach((k) => {
      const key = k.kode.toLowerCase();
      const n = k.nama.toLowerCase();
      if (n.includes('harga')) payload[key] = payload.harga;
      else if (n.includes('ram')) payload[key] = payload.ram_gb;
      else if (n.includes('penyimpanan')) payload[key] = payload.storage_gb;
      else if (n.includes('tahun')) payload[key] = payload.tahun;
      else if (n.includes('layar') || n.includes('ukuran')) payload[key] = payload.layar_inci;
      else if (n.includes('baterai')) payload[key] = payload.kondisi_baterai;
      else payload[key] = payload[key] ?? null;
    });

    const url = payload.id ? `/api/laptops/${payload.id}` : '/api/laptops';
    const method = payload.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    } else {
      const errData = await res.json();
      alert(errData.error || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Yakin ingin menghapus data laptop ini?')) {
      const res = await fetch(`/api/laptops/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan');
      }
    }
  };

  const covered = (nama: string) => {
    const n = nama.toLowerCase();
    return (
      n.includes('harga') ||
      n.includes('ram') ||
      n.includes('penyimpanan') ||
      n.includes('tahun') ||
      n.includes('layar') ||
      n.includes('ukuran') ||
      n.includes('baterai')
    );
  };

  const getCriterionValue = (item: any, kode: string) => {
    const lower = kode.toLowerCase();
    return item[lower] ?? item[kode] ?? null;
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

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white">Data Laptop Bekas</h2>
        <button
          onClick={() => handleOpenModal()}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Laptop
        </button>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Memuat...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:pl-6">Gambar</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Kode Unit</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Laptop</th>
                {kriteria.map((k) => (
                  <th key={`head-${k.kode}`} className="px-4 py-4 font-medium text-gray-800 dark:text-white">
                    {k.nama}
                  </th>
                ))}
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Status</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laptops.length === 0 && (
                <tr>
                  <td colSpan={kriteria.length + 6} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data laptop.
                  </td>
                </tr>
              )}
              {laptops.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-4 xl:pl-6">
                    {item.gambar ? (
                      <img src={item.gambar} alt="Laptop" className="h-16 w-16 rounded object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                        💻
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-800 dark:text-white">{item.kode_unit}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-gray-800 dark:text-white">{item.nama}</div>
                    <div className="text-xs text-gray-500">
                      {item.merek} — {item.tahun}
                    </div>
                  </td>
                  {kriteria.map((k) => (
                    <td key={`${item.id}-${k.kode}`} className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
                      {formatCriterionValue(k.nama, getCriterionValue(item, k.kode))}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.ketersediaan === 'Tersedia'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.ketersediaan}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/30 px-4 py-10 backdrop-blur-sm dark:bg-black/40">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-gray-800 bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-900">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
              {formData.id ? 'Edit Laptop' : 'Tambah Laptop'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">Informasi Dasar</h4>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Kode Unit</label>
                  <input
                    type="text"
                    value={formData.kode_unit || ''}
                    onChange={(e) => setFormData({ ...formData, kode_unit: e.target.value })}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Nama / Model</label>
                  <input
                    type="text"
                    value={formData.nama || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value, slug: generateSlug(e.target.value) })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Merek</label>
                  <input
                    type="text"
                    value={formData.merek || ''}
                    onChange={(e) => setFormData({ ...formData, merek: e.target.value })}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Harga (Juta Rp)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.harga || ''}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Ketersediaan</label>
                  <select
                    value={formData.ketersediaan}
                    onChange={(e) => setFormData({ ...formData, ketersediaan: e.target.value })}
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-white">Spesifikasi</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Tahun</label>
                    <input
                      type="number"
                      value={formData.tahun || ''}
                      onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">RAM (GB)</label>
                    <input
                      type="number"
                      value={formData.ram_gb || ''}
                      onChange={(e) => setFormData({ ...formData, ram_gb: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Penyimpanan (GB)</label>
                    <input
                      type="number"
                      value={formData.storage_gb || ''}
                      onChange={(e) => setFormData({ ...formData, storage_gb: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Layar (inci)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.layar_inci || ''}
                      onChange={(e) => setFormData({ ...formData, layar_inci: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Kondisi Baterai (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.kondisi_baterai || ''}
                      onChange={(e) => setFormData({ ...formData, kondisi_baterai: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Prosesor</label>
                    <input
                      type="text"
                      value={formData.processor || ''}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Tipe & Warna</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ultrabook, Gaming..."
                      value={formData.tipe_laptop || ''}
                      onChange={(e) => setFormData({ ...formData, tipe_laptop: e.target.value })}
                      className="w-1/2 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Warna"
                      value={formData.warna || ''}
                      onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                      className="w-1/2 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Pemilik & Alamat</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nama Pemilik"
                      value={formData.pemilik || ''}
                      onChange={(e) => setFormData({ ...formData, pemilik: e.target.value })}
                      className="w-1/2 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Alamat Pemilik"
                      value={formData.alamat_pemilik || ''}
                      onChange={(e) => setFormData({ ...formData, alamat_pemilik: e.target.value })}
                      className="w-1/2 rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {kriteria.map((k) => {
                  const key = k.kode.toLowerCase();
                  if (covered(k.nama)) return null;
                  return (
                    <div key={k.kode} className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-blue-500">
                        {k.nama} ({k.kode})
                      </label>
                      <input
                        type="text"
                        value={formData[key] || ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full rounded border border-blue-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-900 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 dark:border-gray-700 md:col-span-2">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">Deskripsi</label>
                    <textarea
                      rows={4}
                      value={formData.deskripsi || ''}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-white">
                      Upload Gambar
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mb-2 w-full rounded border bg-white px-3 py-2 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    {formData.imagePreview && (
                      <img src={formData.imagePreview} alt="Preview" className="h-24 w-24 rounded object-cover" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 border-t pt-4 dark:border-gray-700 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button type="submit" className="rounded bg-blue-600 px-6 py-2 font-medium text-white shadow hover:bg-blue-700">
                  Simpan Laptop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
