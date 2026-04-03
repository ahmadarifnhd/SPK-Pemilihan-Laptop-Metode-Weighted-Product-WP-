import type {
    Alternative,
    Criteria,
    WpCalculationResponse,
    WpResultItem,
} from "@/types/spk";

function normalizeCriteriaWeights(criteria: Criteria[]) {
    const total = criteria.reduce((acc, item) => acc + Number(item.bobot || 0), 0);

    return criteria.map((item) => ({
        ...item,
        normalized_weight: total > 0 ? Number(item.bobot || 0) / total : 0,
    }));
}

function toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    const num = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(num) ? num : null;
}

function mapAlternativeValueToScore(
    value: string | number | null | undefined,
    criteria: Criteria,
): number {
    const numeric = toNumber(value);

    if (numeric !== null && criteria.sub_criteria.length === 0) {
        return numeric;
    }

    if (criteria.sub_criteria.length > 0) {
        const asString = String(value ?? "").trim().toLowerCase();
        const textMatch = criteria.sub_criteria.find(
            (sub) => sub.label.trim().toLowerCase() === asString,
        );
        if (textMatch) {
            return Number(textMatch.score);
        }

        if (numeric !== null) {
            const exactNumericMatch = criteria.sub_criteria.find((sub) => {
                const asNumber = toNumber(sub.label);
                return asNumber !== null && asNumber === numeric;
            });
            if (exactNumericMatch) {
                return Number(exactNumericMatch.score);
            }
        }
    }

    return numeric ?? 0;
}

export function calculateWp(criteria: Criteria[], alternatives: Alternative[]): WpCalculationResponse {
    const normalizedCriteria = normalizeCriteriaWeights(criteria);

    const vectorsS = alternatives.map((alternative) => {
        let vectorS = 1;
        const values = normalizedCriteria.map((criterion) => {
            const raw = alternative.values?.[criterion.kode] ?? null;
            const mappedScore = mapAlternativeValueToScore(raw, criterion);

            const safeScore = mappedScore > 0 ? mappedScore : 0.000001;
            const exponent = criterion.atribut === "Cost"
                ? -criterion.normalized_weight
                : criterion.normalized_weight;

            vectorS *= Math.pow(safeScore, exponent);

            return {
                kode: criterion.kode,
                input_value: raw,
                mapped_score: mappedScore,
            };
        });

        return {
            id: alternative.id,
            nama: alternative.nama,
            vector_s: vectorS,
            values,
        };
    });

    const totalS = vectorsS.reduce((acc, item) => acc + item.vector_s, 0);

    const ranked: WpResultItem[] = vectorsS
        .map((item) => ({
            ...item,
            vector_v: totalS > 0 ? item.vector_s / totalS : 0,
            rank: 0,
        }))
        .sort((a, b) => b.vector_v - a.vector_v)
        .map((item, index) => ({
            ...item,
            rank: index + 1,
        }));

    return {
        criteria: normalizedCriteria,
        results: ranked,
    };
}
