import type {
  Asset,
  FixedExpense,
  Liability,
  MonthlyProfile,
  VariableExpense,
} from "../types";

const KEYS = {
  profile:          "pf-profile",
  fixedExpenses:    "pf-fixed-expenses",
  variableExpenses: "pf-variable-expenses",
  liabilities:      "pf-liabilities",
  assets:           "pf-assets",
} as const;

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const loadProfile        = (): MonthlyProfile | null  => load<MonthlyProfile>(KEYS.profile);
export const saveProfile        = (v: MonthlyProfile)        => save(KEYS.profile, v);

export const loadFixedExpenses   = (): FixedExpense[]        => load<FixedExpense[]>(KEYS.fixedExpenses) ?? [];
export const saveFixedExpenses   = (v: FixedExpense[])       => save(KEYS.fixedExpenses, v);

export const loadVariableExpenses = (): VariableExpense[]    => load<VariableExpense[]>(KEYS.variableExpenses) ?? [];
export const saveVariableExpenses = (v: VariableExpense[])   => save(KEYS.variableExpenses, v);

export const loadLiabilities    = (): Liability[]            => load<Liability[]>(KEYS.liabilities) ?? [];
export const saveLiabilities    = (v: Liability[])           => save(KEYS.liabilities, v);

export const loadAssets         = (): Asset[]                => load<Asset[]>(KEYS.assets) ?? [];
export const saveAssets         = (v: Asset[])               => save(KEYS.assets, v);

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
