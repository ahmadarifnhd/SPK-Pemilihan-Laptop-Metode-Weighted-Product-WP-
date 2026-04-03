import { getSupabaseServerClient } from "@/lib/databaseServer";
import type { Alternative, Criteria, SubCriteria } from "@/types/spk";

const TABLE_CRITERIA = "wp_criteria";
const TABLE_SUB_CRITERIA = "wp_sub_criteria";
const TABLE_ALTERNATIVES = "wp_alternatives";

type CriteriaRow = {
    id: number;
    kode: string;
    nama: string;
    bobot: number;
    atribut: "Benefit" | "Cost";
};

type SubCriteriaRow = {
    id: number;
    criteria_id: number;
    label: string;
    score: number;
};

type AlternativeRow = {
    id: number;
    nama: string;
    values: Record<string, string | number>;
};

function isMissingTableError(message?: string): boolean {
    if (!message) return false;
    return message.includes("Could not find the table");
}

type LegacyCriteriaRow = {
    id: number;
    kode: string;
    nama: string;
    bobot: number;
    atribut: "Benefit" | "Cost";
};

type LegacySubCriteriaRow = {
    id: number;
    kriteria_id: number | null;
    by_kriteria: string | null;
    sub_kriteria: string;
    skor_sub_kriteria: number;
};

type LegacyAlternativeRow = {
    id: number;
    nama: string;
    C1?: string | number | null;
    C2?: string | number | null;
    C3?: string | number | null;
    C4?: string | number | null;
    C5?: string | number | null;
    C6?: string | number | null;
};

function mapCriteria(
    criteriaRows: CriteriaRow[],
    subRows: SubCriteriaRow[],
): Criteria[] {
    return criteriaRows
        .sort((a, b) => a.kode.localeCompare(b.kode))
        .map((row) => ({
            id: row.id,
            kode: row.kode,
            nama: row.nama,
            bobot: Number(row.bobot),
            atribut: row.atribut,
            sub_criteria: subRows
                .filter((sub) => sub.criteria_id === row.id)
                .map((sub) => ({
                    id: sub.id,
                    criteria_id: sub.criteria_id,
                    label: sub.label,
                    score: Number(sub.score),
                })),
        }));
}

export async function getCriteriaWithSubCriteria(): Promise<Criteria[]> {
    const supabase = getSupabaseServerClient();

    let criteriaRows: CriteriaRow[] | null = null;
    let criteriaError: { message: string } | null = null;
    let subRows: SubCriteriaRow[] | null = null;
    let subError: { message: string } | null = null;

    try {
        const [criteriaRes, subRes] = await Promise.all([
            supabase
                .from(TABLE_CRITERIA)
                .select("id, kode, nama, bobot, atribut")
                .order("id", { ascending: true }),
            supabase
                .from(TABLE_SUB_CRITERIA)
                .select("id, criteria_id, label, score")
                .order("id", { ascending: true }),
        ]);
        criteriaRows = (criteriaRes.data ?? []) as CriteriaRow[];
        criteriaError = criteriaRes.error ? { message: criteriaRes.error.message } : null;
        subRows = (subRes.data ?? []) as SubCriteriaRow[];
        subError = subRes.error ? { message: subRes.error.message } : null;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        criteriaError = { message };
        subError = { message };
    }

    if (criteriaError && !isMissingTableError(criteriaError.message)) {
        throw new Error(criteriaError.message);
    }
    if (subError && !isMissingTableError(subError.message)) {
        throw new Error(subError.message);
    }

    const mappedWp = mapCriteria((criteriaRows ?? []) as CriteriaRow[], (subRows ?? []) as SubCriteriaRow[]);
    if (mappedWp.length > 0) {
        return mappedWp;
    }

    const [{ data: legacyCriteriaRows, error: legacyCriteriaError }, { data: legacySubRows, error: legacySubError }] =
        await Promise.all([
            supabase
                .from("kriterias")
                .select("id, kode, nama, bobot, atribut")
                .order("id", { ascending: true }),
            supabase
                .from("sub_kriterias")
                .select("id, kriteria_id, by_kriteria, sub_kriteria, skor_sub_kriteria")
                .order("id", { ascending: true }),
        ]);

    if (legacyCriteriaError) {
        throw new Error(legacyCriteriaError.message);
    }
    if (legacySubError) {
        throw new Error(legacySubError.message);
    }

    const criteria = ((legacyCriteriaRows ?? []) as LegacyCriteriaRow[]).map((row) => {
        const directSub = ((legacySubRows ?? []) as LegacySubCriteriaRow[]).filter(
            (sub) => sub.kriteria_id === row.id,
        );

        const byNameSub = directSub.length > 0
            ? directSub
            : ((legacySubRows ?? []) as LegacySubCriteriaRow[]).filter(
                (sub) => (sub.by_kriteria ?? "").trim().toLowerCase() === row.nama.trim().toLowerCase(),
            );

        return {
            id: row.id,
            kode: row.kode,
            nama: row.nama,
            bobot: Number(row.bobot),
            atribut: row.atribut,
            sub_criteria: byNameSub.map((sub) => ({
                id: sub.id,
                criteria_id: row.id,
                label: sub.sub_kriteria,
                score: Number(sub.skor_sub_kriteria),
            })),
        };
    });

    return criteria.sort((a, b) => a.kode.localeCompare(b.kode));
}

export async function createCriteria(input: {
    kode: string;
    nama: string;
    bobot: number;
    atribut: "Benefit" | "Cost";
    sub_criteria: SubCriteria[];
}) {
    const supabase = getSupabaseServerClient();

    const { data: created, error } = await supabase
        .from(TABLE_CRITERIA)
        .insert({
            kode: input.kode,
            nama: input.nama,
            bobot: input.bobot,
            atribut: input.atribut,
        })
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    if (input.sub_criteria.length > 0) {
        const payload = input.sub_criteria
            .filter((sub) => sub.label.trim().length > 0)
            .map((sub) => ({
                criteria_id: created.id,
                label: sub.label,
                score: Number(sub.score),
            }));

        if (payload.length > 0) {
            const { error: subError } = await supabase.from(TABLE_SUB_CRITERIA).insert(payload);
            if (subError) {
                throw new Error(subError.message);
            }
        }
    }

    return created;
}

export async function updateCriteria(
    id: number,
    input: {
        kode: string;
        nama: string;
        bobot: number;
        atribut: "Benefit" | "Cost";
        sub_criteria: SubCriteria[];
    },
) {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
        .from(TABLE_CRITERIA)
        .update({
            kode: input.kode,
            nama: input.nama,
            bobot: input.bobot,
            atribut: input.atribut,
        })
        .eq("id", id);

    if (error && !isMissingTableError(error.message)) {
        throw new Error(error.message);
    }

    const { error: deleteError } = await supabase
        .from(TABLE_SUB_CRITERIA)
        .delete()
        .eq("criteria_id", id);

    if (deleteError) {
        throw new Error(deleteError.message);
    }

    const payload = input.sub_criteria
        .filter((sub) => sub.label.trim().length > 0)
        .map((sub) => ({
            criteria_id: id,
            label: sub.label,
            score: Number(sub.score),
        }));

    if (payload.length > 0) {
        const { error: createError } = await supabase.from(TABLE_SUB_CRITERIA).insert(payload);
        if (createError) {
            throw new Error(createError.message);
        }
    }
}

export async function deleteCriteria(id: number) {
    const supabase = getSupabaseServerClient();

    const { error: deleteSubError } = await supabase
        .from(TABLE_SUB_CRITERIA)
        .delete()
        .eq("criteria_id", id);

    if (deleteSubError) {
        throw new Error(deleteSubError.message);
    }

    const { error: deleteCriteriaError } = await supabase
        .from(TABLE_CRITERIA)
        .delete()
        .eq("id", id);

    if (deleteCriteriaError) {
        throw new Error(deleteCriteriaError.message);
    }
}

export async function getAlternatives(): Promise<Alternative[]> {
    const supabase = getSupabaseServerClient();

    let data: AlternativeRow[] | null = null;
    let error: { message: string } | null = null;
    try {
        const response = await supabase
            .from(TABLE_ALTERNATIVES)
            .select("id, nama, values")
            .order("id", { ascending: true });

        data = (response.data ?? []) as AlternativeRow[];
        error = response.error ? { message: response.error.message } : null;
    } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Unexpected error";
        error = { message };
    }

    if (error) {
        throw new Error(error.message);
    }

    const mappedWp = ((data ?? []) as AlternativeRow[]).map((row) => ({
        id: row.id,
        nama: row.nama,
        values: row.values ?? {},
    }));
    if (mappedWp.length > 0) {
        return mappedWp;
    }

    const { data: legacyData, error: legacyError } = await supabase
        .from("alternatifs")
        .select("id, nama, C1, C2, C3, C4, C5, C6")
        .order("id", { ascending: true });

    if (legacyError) {
        throw new Error(legacyError.message);
    }

    return ((legacyData ?? []) as LegacyAlternativeRow[]).map((row) => ({
        id: row.id,
        nama: row.nama,
        values: {
            C1: row.C1 ?? 0,
            C2: row.C2 ?? 0,
            C3: row.C3 ?? 0,
            C4: row.C4 ?? 0,
            C5: row.C5 ?? 0,
            C6: row.C6 ?? 0,
        },
    }));
}

export async function createAlternative(input: {
    nama: string;
    values: Record<string, string | number>;
}) {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
        .from(TABLE_ALTERNATIVES)
        .insert({ nama: input.nama, values: input.values })
        .select("id")
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateAlternative(
    id: number,
    input: {
        nama: string;
        values: Record<string, string | number>;
    },
) {
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
        .from(TABLE_ALTERNATIVES)
        .update({ nama: input.nama, values: input.values })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

export async function deleteAlternative(id: number) {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from(TABLE_ALTERNATIVES).delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
