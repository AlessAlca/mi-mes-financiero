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

export type MonthlyPlan = {
  expectedIncome: number;
  savingsGoal: number;
  monthlySpendingLimit: number;
  hormigaLimit: number;
  month: string;
};

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  isHormiga: boolean;
};

export type FinancialStatus = "onTrack" | "warning" | "offTrack";

export type FinancialSummary = {
  availableToSpend: number;
  totalSpent: number;
  remainingToSpend: number;
  projectedSavings: number;
  savingsGap: number;
  percentageBudgetUsed: number;
  recommendedDailySpend: number;
  hormigaTotal: number;
  percentageHormigaUsed: number;
  hormigaPercentageOfTotal: number;
  status: FinancialStatus;
};
