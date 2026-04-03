import { deleteAlternative, updateAlternative } from "@/lib/spkRepository";
import { NextResponse } from "next/server";

function parseId(params: { id: string }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("ID tidak valid");
  }
  return id;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = parseId({ id: rawId });
    const body = await request.json();

    await updateAlternative(id, {
      nama: String(body.nama).trim(),
      values: typeof body.values === "object" && body.values ? body.values : {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("ID") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = parseId({ id: rawId });
    await deleteAlternative(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("ID") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
