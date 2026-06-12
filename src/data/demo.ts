import type { Asset, FixedExpense, Liability, MonthlyProfile, VariableExpense } from "../types";
import { currentMonth } from "../lib/formatting";

// ── Static seeds (used as first-load fallback in App) ────────────────────────

export const DEMO_PROFILE: MonthlyProfile = {
  id: "profile-demo",
  month: currentMonth(),
  monthlyIncome: 4_500_000,
  monthlySavingsGoal: 700_000,
};

export const DEMO_FIXED_EXPENSES: FixedExpense[] = [
  { id: "f1", name: "Arriendo",          monthlyAmount: 1_200_000 },
  { id: "f2", name: "Servicios públicos", monthlyAmount:   210_000 },
  { id: "f3", name: "Internet y celular", monthlyAmount:    80_000 },
];

export const DEMO_VARIABLE_EXPENSES: VariableExpense[] = [
  { id: "v1", amount: 320_000, category: "Mercado",        date: "2026-06-01", isHormiga: false },
  { id: "v2", amount:  85_000, category: "Transporte",     date: "2026-06-03", isHormiga: false },
  { id: "v3", amount:  65_000, category: "Comida fuera",   date: "2026-06-07", isHormiga: false },
  { id: "v4", amount:   8_000, category: "Gastos hormiga", date: "2026-06-08", isHormiga: true  },
  { id: "v5", amount:  12_000, category: "Gastos hormiga", date: "2026-06-09", isHormiga: true  },
  { id: "v6", amount:   6_000, category: "Gastos hormiga", date: "2026-06-09", isHormiga: true  },
  { id: "v7", amount:  15_000, category: "Gastos hormiga", date: "2026-06-10", isHormiga: true  },
  { id: "v8", amount:  45_000, category: "Otros",          date: "2026-06-10", isHormiga: false },
];

export const DEMO_LIABILITIES: Liability[] = [
  { id: "l1", name: "Crédito vehículo",    totalAmount: 15_000_000, monthlyPayment: 650_000 },
  { id: "l2", name: "Tarjeta de crédito",  totalAmount:  2_500_000, monthlyPayment: 200_000 },
];

export const DEMO_ASSETS: Asset[] = [
  { id: "a1", name: "Cuenta de ahorros", type: "ahorro",   value:  3_500_000 },
  { id: "a2", name: "Vehículo",          type: "vehiculo", value: 28_000_000 },
];

// ── createDemoData — always uses current month dates ─────────────────────────

export function createDemoData(): {
  profile: MonthlyProfile;
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  liabilities: Liability[];
  assets: Asset[];
} {
  const month = currentMonth();
  const [y, mo] = month.split("-");
  const d = (day: number) => `${y}-${mo}-${String(day).padStart(2, "0")}`;
  const ts = Date.now();

  return {
    profile: { ...DEMO_PROFILE, month },
    fixedExpenses: DEMO_FIXED_EXPENSES.map((e) => ({ ...e, id: `f-${ts}-${e.id}` })),
    variableExpenses: [
      { id: `${ts}-v1`, amount: 320_000, category: "Mercado",        date: d(1),  isHormiga: false },
      { id: `${ts}-v2`, amount:  85_000, category: "Transporte",     date: d(3),  isHormiga: false },
      { id: `${ts}-v3`, amount:  65_000, category: "Comida fuera",   date: d(7),  isHormiga: false },
      { id: `${ts}-v4`, amount:   8_000, category: "Gastos hormiga", date: d(8),  isHormiga: true  },
      { id: `${ts}-v5`, amount:  12_000, category: "Gastos hormiga", date: d(9),  isHormiga: true  },
      { id: `${ts}-v6`, amount:   6_000, category: "Gastos hormiga", date: d(9),  isHormiga: true  },
      { id: `${ts}-v7`, amount:  15_000, category: "Gastos hormiga", date: d(10), isHormiga: true  },
      { id: `${ts}-v8`, amount:  45_000, category: "Otros",          date: d(10), isHormiga: false },
    ],
    liabilities: DEMO_LIABILITIES.map((l) => ({ ...l, id: `l-${ts}-${l.id}` })),
    assets: DEMO_ASSETS.map((a) => ({ ...a, id: `a-${ts}-${a.id}` })),
  };
}
