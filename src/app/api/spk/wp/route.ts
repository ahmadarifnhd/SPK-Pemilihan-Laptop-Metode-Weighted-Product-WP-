import { calculateWp } from "@/lib/spkWp";
import { supabaseSpk } from "@/lib/database-spk";
import type { Alternative, Criteria } from "@/types/spk";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [criteriaRes, subCriteriaRes, alternativesRes] = await Promise.all([
            supabaseSpk
                .from("kriterias")
                .select("id, kode, nama, bobot, atribut")
                .order("id", { ascending: true }),
            supabaseSpk
                .from("sub_kriterias")
                .select("id, kriteria_id, by_kriteria, sub_kriteria, skor_sub_kriteria")
                .order("id", { ascending: true }),
            supabaseSpk
                .from("alternatifs")
                .select("*")
                .order("id", { ascending: true }),
        ]);

        if (criteriaRes.error) throw new Error(criteriaRes.error.message);
        if (subCriteriaRes.error) throw new Error(subCriteriaRes.error.message);
        if (alternativesRes.error) throw new Error(alternativesRes.error.message);

        const criteriaRows = criteriaRes.data ?? [];
        const subCriteriaRows = subCriteriaRes.data ?? [];
        const alternativesRows = alternativesRes.data ?? [];

        const criteria: Criteria[] = criteriaRows.map((row: any) => {
            const subs = subCriteriaRows.filter(
                (sub: any) =>
                    sub.kriteria_id === row.id ||
                    String(sub.by_kriteria ?? "").toLowerCase() === String(row.nama).toLowerCase(),
            );

            return {
                id: row.id,
                kode: row.kode,
                nama: row.nama,
                bobot: Number(row.bobot),
                atribut: row.atribut,
                sub_criteria: subs.map((sub: any) => ({
                    id: sub.id,
                    criteria_id: row.id,
                    label: sub.sub_kriteria,
                    score: Number(sub.skor_sub_kriteria),
                })),
            };
        });

        const alternatives: Alternative[] = alternativesRows.map((row: any) => {
            const values: Record<string, string | number> = {};
            for (const criterion of criteria) {
                const kode = criterion.kode;
                const lower = kode.toLowerCase();
                values[kode] = row[lower] ?? row[kode] ?? 0;
            }

            return {
                id: row.id,
                nama: row.nama,
                values,
            };
        });

        const calculation = calculateWp(criteria, alternatives);

        return NextResponse.json({
            data: calculation,
            metadata: {
                criteria_count: criteria.length,
                alternatives_count: alternatives.length,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
