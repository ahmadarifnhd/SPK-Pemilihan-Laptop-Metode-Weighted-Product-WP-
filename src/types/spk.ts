export type CriteriaAttribute = "Benefit" | "Cost";

export type SubCriteria = {
  id?: number;
  criteria_id?: number;
  label: string;
  score: number;
};

export type Criteria = {
  id: number;
  kode: string;
  nama: string;
  bobot: number;
  atribut: CriteriaAttribute;
  sub_criteria: SubCriteria[];
};

export type Alternative = {
  id: number;
  nama: string;
  values: Record<string, string | number>;
};

export type ScoredValue = {
  kode: string;
  input_value: string | number | null;
  mapped_score: number;
};

export type WpResultItem = {
  id: number;
  nama: string;
  vector_s: number;
  vector_v: number;
  rank: number;
  values: ScoredValue[];
};

export type WpCalculationResponse = {
  criteria: Array<Criteria & { normalized_weight: number }>;
  results: WpResultItem[];
};
