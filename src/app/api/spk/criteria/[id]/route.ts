import { deleteCriteria, updateCriteria } from "@/lib/spkRepository";
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

        await updateCriteria(id, {
            kode: String(body.kode).trim(),
            nama: String(body.nama).trim(),
            bobot: Number(body.bobot ?? 0),
            atribut: body.atribut === "Cost" ? "Cost" : "Benefit",
            sub_criteria: Array.isArray(body.sub_criteria) ? body.sub_criteria : [],
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
        await deleteCriteria(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        const status = message.includes("ID") ? 400 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
