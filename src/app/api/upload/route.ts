import { NextRequest, NextResponse } from 'next/server';
import { supabaseSpk } from '@/lib/database-spk';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'laptops';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const bucket = process.env.SUPABASE_BUCKET || 'laptop-images';

    const { data, error } = await supabaseSpk.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: publicUrl } = supabaseSpk.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ success: true, url: publicUrl.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
