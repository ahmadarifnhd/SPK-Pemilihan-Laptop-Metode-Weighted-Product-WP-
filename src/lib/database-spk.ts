import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseSpk = createClient(supabaseUrl, supabaseKey);

export interface Laptop {
  id: number;
  kode_unit: string | null;
  nama: string;
  slug: string;
  gambar: string | null;
  harga: number;
  tahun: number;
  ram_gb: number | null;
  storage_gb: number | null;
  processor: string | null;
  layar_inci: number | null;
  kondisi_baterai: number | null;
  tipe_laptop: string | null;
  warna: string;
  merek: string;
  pemilik: string;
  alamat_pemilik: string;
  deskripsi: string | null;
  ketersediaan: string;
  seri?: string | null;
  c1?: number | null;
  c2?: number | null;
  c3?: number | null;
  c4?: number | null;
  c5?: number | null;
  c6?: string | null;
  c7?: any;
  c8?: any;
  c9?: any;
  c10?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  bobot: number | string;
  atribut: 'Cost' | 'Benefit';
  created_at?: string;
  updated_at?: string;
  sub_kriterias?: SubKriteria[];
}

export interface SubKriteria {
  id: number;
  sub_kriteria: string;
  skor_sub_kriteria: number;
  by_kriteria: string;
  atribut: string;
  kriteria_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Alternatif {
  id: number;
  nama: string;
  C1: number | string;
  C2: number | string;
  C3: number | string;
  C4: number | string;
  C5: number | string;
  C6: string;
  kriteria_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: number;
  name: string;
  email: string;
  nomor: string;
  subjek: string;
  pesan: string;
  created_at?: string;
  updated_at?: string;
}

