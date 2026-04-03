'use client';

import React, { useState, useEffect } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-gray-800 dark:text-white">
          Daftar Semua Pesan
        </h2>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900 overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Memuat...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-800">
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white xl:pl-6 w-16 text-center">No</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Nama</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Email</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Telepon</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Subjek</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Pesan</th>
                <th className="px-4 py-4 font-medium text-gray-800 dark:text-white">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Data kosong</td>
                </tr>
              )}
              {messages.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-4 xl:pl-6 text-center">{index + 1}</td>
                  <td className="px-4 py-4 font-semibold text-gray-800 dark:text-white">{item.name}</td>
                  <td className="px-4 py-4 dark:text-gray-300">{item.email}</td>
                  <td className="px-4 py-4 dark:text-gray-300">{item.nomor}</td>
                  <td className="px-4 py-4 font-medium dark:text-gray-200">{item.subjek}</td>
                  <td className="px-4 py-4 text-sm dark:text-gray-400">{item.pesan}</td>
                  <td className="px-4 py-4 text-xs dark:text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
