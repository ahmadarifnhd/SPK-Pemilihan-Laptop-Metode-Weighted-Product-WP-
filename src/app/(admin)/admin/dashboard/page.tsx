import type { Metadata } from 'next';
import { supabaseSpk } from '@/lib/database-spk';

export const metadata: Metadata = {
  title: 'Dashboard Admin | Laptopku SPK',
  description: 'Dashboard Admin SPK Laptop Bekas — Laptopku',
};

export default async function DashboardPage() {
  const { count: laptopCount } = await supabaseSpk.from('laptops').select('*', { count: 'exact', head: true });
  const { count: kriteriaCount } = await supabaseSpk.from('kriterias').select('*', { count: 'exact', head: true });
  const { count: alternatifCount } = await supabaseSpk.from('alternatifs').select('*', { count: 'exact', head: true });
  const { count: messageCount } = await supabaseSpk.from('messages').select('*', { count: 'exact', head: true });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Selamat datang di Panel Admin Sistem Pendukung Keputusan Laptopku (laptop bekas).</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <span className="text-xl">💻</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-sm font-bold text-gray-800 dark:text-white">
                {laptopCount || 0}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Laptop</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <span className="text-xl">📋</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-sm font-bold text-gray-800 dark:text-white">
                {kriteriaCount || 0}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Kriteria</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <span className="text-xl">📊</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-sm font-bold text-gray-800 dark:text-white">
                {alternatifCount || 0}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Alternatif</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <span className="text-xl">✉️</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-sm font-bold text-gray-800 dark:text-white">
                {messageCount || 0}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">Pesan Masuk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
