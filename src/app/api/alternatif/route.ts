import { NextRequest, NextResponse } from 'next/server';
import { supabaseSpk } from '@/lib/database-spk';

// GET /api/alternatif
export async function GET() {
  const { data, error } = await supabaseSpk
    .from('alternatifs')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/alternatif
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseSpk
      .from('alternatifs')
      .insert(body)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
