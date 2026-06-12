export type ExpenseCategory =
  | "Mercado"
  | "Transporte"
  | "Servicios"
  | "Vivienda"
  | "Comida fuera"
  | "Deudas"
  | "Salud"
  | "Entretenimiento"
  | "Gastos hormiga"
  | "Otros";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Mercado",
  "Transporte",
  "Servicios",
  "Vivienda",
  "Comida fuera",
  "Deudas",
  "Salud",
  "Entretenimiento",
  "Gastos hormiga",
  "Otros",
];

// ── Monthly profile ──────────────────────────────────────────────────────────

export type MonthlyProfile = {
  id: string;
  month: string;
  monthlyIncome: number;
  monthlySavingsGoal: number;
};

// ── Fixed expenses ───────────────────────────────────────────────────────────

export type FixedExpense = {
  id: string;
  name: string;
  monthlyAmount: number;
};

// ── Variable expenses ────────────────────────────────────────────────────────

export type VariableExpense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  isHormiga: boolean;
};

// ── Liabilities ──────────────────────────────────────────────────────────────

export type Liability = {
  id: string;
  name: string;
  totalAmount: number;    // affects net worth (balance sheet)
  monthlyPayment: number; // affects monthly cash flow
};

// ── Assets ───────────────────────────────────────────────────────────────────

export type AssetType =
  | "efectivo"
  | "ahorro"
  | "inversion"
  | "inmueble"
  | "vehiculo"
  | "otro";

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  efectivo:  "Efectivo",
  ahorro:    "Ahorros",
  inversion: "Inversión",
  inmueble:  "Inmueble",
  vehiculo:  "Vehículo",
  otro:      "Otro",
};

export const ASSET_TYPES: AssetType[] = [
  "efectivo",
  "ahorro",
  "inversion",
  "inmueble",
  "vehiculo",
  "otro",
];

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  value: number;
};

// ── Financial summary ────────────────────────────────────────────────────────

export type FinancialStatus = "onTrack" | "warning" | "offTrack";

export type FinancialSummary = {
  // Monthly cash flow breakdown
  fixedExpensesTotal: number;
  liabilityMonthlyPaymentsTotal: number;
  initialVariableCashAvailable: number;
  variableExpensesTotal: number;
  currentVariableCashAvailable: number;
  // Savings
  projectedSavings: number;
  savingsGap: number;
  // Gastos hormiga
  hormigaTotal: number;
  hormigaPercentageOfTotal: number;
  // Net worth
  assetsTotal: number;
  liabilitiesTotal: number;
  netWorth: number;
  projectedNetWorth: number;
  // Daily guidance
  recommendedDailySpend: number;
  status: FinancialStatus;
};
