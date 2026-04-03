import { NextRequest, NextResponse } from 'next/server';
import { supabaseSpk } from '@/lib/database-spk';

// PUT /api/kriteria/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kode, nama, bobot, atribut, sub_kriteria, skor_sub_kriteria } = body;

    // Get old kriteria name for sub_kriterias deletion
    await supabaseSpk.from('kriterias').select('nama').eq('id', id).single();
    
    const { data, error } = await supabaseSpk
      .from('kriterias')
      .update({ kode, nama, bobot: parseFloat(bobot), atribut })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Delete old sub_kriterias and recreate
    await supabaseSpk.from('sub_kriterias').delete().eq('kriteria_id', id);

    if (Array.isArray(sub_kriteria) && sub_kriteria.length > 0) {
      const subKriteriaData = sub_kriteria
        .map((sk: string, i: number) => ({
          sub_kriteria: sk,
          skor_sub_kriteria: parseFloat(skor_sub_kriteria?.[i] || '0'),
          by_kriteria: nama,
          atribut,
          kriteria_id: id,
        }))
        .filter(sk => sk.sub_kriteria.trim() !== '');

      if (subKriteriaData.length > 0) {
        await supabaseSpk.from('sub_kriterias').insert(subKriteriaData);
      }
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/kriteria/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: kriteria } = await supabaseSpk
      .from('kriterias')
      .select('kode, nama')
      .eq('id', id)
      .single();

    if (!kriteria) return NextResponse.json({ error: 'Kriteria not found' }, { status: 404 });

    // Delete sub_kriterias
    await supabaseSpk.from('sub_kriterias').delete().eq('kriteria_id', id);

    // Delete kriteria
    const { error } = await supabaseSpk.from('kriterias').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/kriteria/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseSpk
      .from('kriterias')
      .select('*, sub_kriterias(*)')
      .eq('id', id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
