import { NextRequest, NextResponse } from 'next/server';
import { supabaseSpk } from '@/lib/database-spk';

// GET /api/kriteria
export async function GET() {
  const { data, error } = await supabaseSpk
    .from('kriterias')
    .select('*, sub_kriterias(*)')
    .order('kode', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/kriteria
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kode, nama, bobot, atribut, sub_kriteria, skor_sub_kriteria } = body;

    // Check max 20 kriteria
    const { count } = await supabaseSpk.from('kriterias').select('*', { count: 'exact', head: true });
    if ((count || 0) >= 20) {
      return NextResponse.json({ error: 'Maksimal 20 kriteria sudah tercapai.' }, { status: 400 });
    }

    const { data: kriteria, error: kriteriaError } = await supabaseSpk
      .from('kriterias')
      .insert({ kode, nama, bobot: parseFloat(bobot), atribut })
      .select()
      .single();

    if (kriteriaError) return NextResponse.json({ error: kriteriaError.message }, { status: 400 });

    // Insert sub_kriterias if provided
    if (Array.isArray(sub_kriteria) && sub_kriteria.length > 0) {
      const subKriteriaData = sub_kriteria
        .map((sk: string, i: number) => ({
          sub_kriteria: sk,
          skor_sub_kriteria: parseFloat(skor_sub_kriteria?.[i] || '0'),
          by_kriteria: nama,
          atribut,
          kriteria_id: kriteria.id,
        }))
        .filter(sk => sk.sub_kriteria.trim() !== '');

      if (subKriteriaData.length > 0) {
        await supabaseSpk.from('sub_kriterias').insert(subKriteriaData);
      }
    }

    return NextResponse.json(kriteria, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
