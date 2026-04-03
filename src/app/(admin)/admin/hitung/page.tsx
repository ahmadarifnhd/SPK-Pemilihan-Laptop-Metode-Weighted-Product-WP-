'use client';

import type { WpCalculationResponse } from '@/types/spk';
import React, { useEffect, useState } from 'react';

export default function HitungPage() {
  const [data, setData] = useState<WpCalculationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/spk/wp')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData?.data ?? null);
        setLoading(false);
      })
      .catch((e: Error) => {
        console.error(e);
        setError('Gagal menghitung Weighted Product');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Memuat kalkulasi WP...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!data || data.results.length === 0) {
    return <div className="p-6 text-center text-gray-500">Belum ada data alternatif untuk dihitung.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white">
          Perhitungan WP (Weighted Product)
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Langkah-langkah detail proses perhitungan rekomendasi sistem dengan metode Weighted Product.
        </p>
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-white">1. Bobot Preferensi & Normalisasi (W)</h3>
        </div>
        <div className="p-4 sm:p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Kode</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Nama Kriteria</th>
                <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-white">Atribut</th>
                <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-white">Bobot Awal</th>
                <th className="px-4 py-3 text-center font-medium text-gray-800 dark:text-white">Bobot Normalisasi</th>
              </tr>
            </thead>
            <tbody>
              {data.criteria.map((k) => (
                <tr key={k.kode} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">{k.kode}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{k.nama}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${k.atribut === 'Benefit' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'}`}
                    >
                      {k.atribut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{k.bobot}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600 dark:text-blue-400">
                    {k.normalized_weight.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-white">2. Matriks Keputusan Konversi (X)</h3>
        </div>
        <div className="p-4 sm:p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="w-16 px-4 py-3 text-center font-medium text-gray-800 dark:text-white">No</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Alternatif</th>
                {data.criteria.map((k) => (
                  <th key={k.kode} className="px-4 py-3 text-center font-medium text-gray-800 dark:text-white">
                    {k.kode}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.results.map((res, index) => (
                <tr key={res.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">{res.nama}</td>
                  {data.criteria.map((k) => {
                    const val = res.values.find((v) => v.kode === k.kode);
                    return (
                      <td key={k.kode} className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                        {val?.mapped_score ?? 0}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-white">3. Perhitungan Vector S</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rumus: Sᵢ = ∏(xᵢⱼ ^ wⱼ), atribut Cost menggunakan pangkat negatif.</p>
        </div>
        <div className="p-4 sm:p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Alternatif</th>
                <th className="px-4 py-3 font-medium text-gray-800 dark:text-white">Perkalian Berpangkat</th>
                <th className="px-4 py-3 text-right font-medium text-gray-800 dark:text-white">Vector S</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((res) => (
                <tr key={res.id} className="border-b border-gray-200 align-top dark:border-gray-800">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">{res.nama}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                    {res.values.map((value) => {
                      const criterion = data.criteria.find((item) => item.kode === value.kode);
                      const weight = criterion ? criterion.normalized_weight : 0;
                      const signedWeight = criterion?.atribut === 'Cost' ? -weight : weight;
                      return `${value.kode}: ${value.mapped_score}^${signedWeight.toFixed(4)}`;
                    }).join(' × ')}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">{res.vector_s.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-white">4. Hasil Akhir (Vector V) & Perankingan</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rumus: Vᵢ = Sᵢ / ΣS</p>
        </div>
        <div className="p-4 sm:p-6">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-left">
                <th className="w-24 px-4 py-4 text-center font-medium text-white">Peringkat</th>
                <th className="px-4 py-4 font-medium text-white">Alternatif</th>
                <th className="px-4 py-4 text-right font-medium text-white">Vector S</th>
                <th className="px-4 py-4 text-right font-medium text-white">Nilai Akhir (V)</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((res) => (
                <tr key={res.id} className="border-b border-gray-200 hover:bg-blue-50 dark:border-gray-800 dark:hover:bg-blue-900/20">
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${res.rank === 1 ? 'bg-yellow-400 text-white shadow-md' : res.rank === 2 ? 'bg-gray-300 text-gray-800 shadow-md' : res.rank === 3 ? 'bg-orange-400 text-white shadow-md' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                      {res.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-lg font-semibold text-gray-800 dark:text-white">{res.nama}</td>
                  <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">{res.vector_s.toFixed(6)}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-xl font-black ${res.rank === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                      {res.vector_v.toFixed(6)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
