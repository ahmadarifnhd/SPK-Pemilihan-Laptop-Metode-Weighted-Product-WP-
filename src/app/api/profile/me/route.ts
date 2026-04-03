import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/databaseServer';

export async function GET(req: NextRequest) {
  try {
    // `auth_session` disimpan oleh middleware; saat sudah login isinya id user.
    const cookieUserId = req.cookies.get('auth_session')?.value;
    if (!cookieUserId) {
      return NextResponse.json(
        { name: 'Nama User', email: 'contoh_email@email.com' },
        { status: 200 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('first_name,last_name,email')
      .eq('user_id', cookieUserId)
      .single();

    const name =
      (data?.first_name ? String(data.first_name) : '') +
      (data?.last_name ? ` ${String(data.last_name)}` : '');

    return NextResponse.json({
      name: name.trim() || 'Nama User',
      email: data?.email ? String(data.email) : 'contoh_email@email.com',
    });
  } catch (e: any) {
    return NextResponse.json(
      { name: 'Nama User', email: 'contoh_email@email.com' },
      { status: 200 }
    );
  }
}

