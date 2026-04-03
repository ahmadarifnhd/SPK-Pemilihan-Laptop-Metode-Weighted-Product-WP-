import {
    createAlternative,
    getAlternatives,
    getCriteriaWithSubCriteria,
} from "@/lib/spkRepository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [alternatives, criteria] = await Promise.all([
            getAlternatives(),
            getCriteriaWithSubCriteria(),
        ]);

        return NextResponse.json({ data: alternatives, criteria });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body?.nama) {
            return NextResponse.json({ error: "Field nama wajib diisi" }, { status: 400 });
        }

        await createAlternative({
            nama: String(body.nama).trim(),
            values: typeof body.values === "object" && body.values ? body.values : {},
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
