import { NextRequest, NextResponse } from 'next/server';
import { supabaseSpk } from '@/lib/database-spk';

export async function GET() {
  const { data, error } = await supabaseSpk
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, nomor, subjek, pesan } = body;

    if (!name || !email || !nomor || !subjek || !pesan) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    const { data, error } = await supabaseSpk
      .from('messages')
      .insert({ name, email, nomor, subjek, pesan })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
