import {
  createCriteria,
  getCriteriaWithSubCriteria,
} from "@/lib/spkRepository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const criteria = await getCriteriaWithSubCriteria();
    return NextResponse.json({ data: criteria });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.kode || !body?.nama || !body?.atribut) {
      return NextResponse.json(
        { error: "Field kode, nama, atribut wajib diisi" },
        { status: 400 },
      );
    }

    await createCriteria({
      kode: String(body.kode).trim(),
      nama: String(body.nama).trim(),
      bobot: Number(body.bobot ?? 0),
      atribut: body.atribut === "Cost" ? "Cost" : "Benefit",
      sub_criteria: Array.isArray(body.sub_criteria) ? body.sub_criteria : [],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
