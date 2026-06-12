import type { Expense, MonthlyPlan } from "../types";
import { currentMonth } from "../lib/formatting";

// Static constants used as initial-seed fallback on first load (App.tsx initPlan/initExpenses)
export const DEMO_PLAN: MonthlyPlan = {
  expectedIncome: 4_500_000,
  savingsGoal: 700_000,
  monthlySpendingLimit: 3_800_000,
  hormigaLimit: 250_000,
  month: currentMonth(),
};

export const DEMO_EXPENSES: Expense[] = [
  { id: "d1", amount: 320_000, category: "Mercado",        date: "2026-06-01", isHormiga: false },
  { id: "d2", amount: 85_000,  category: "Transporte",     date: "2026-06-03", isHormiga: false },
  { id: "d3", amount: 210_000, category: "Servicios",      date: "2026-06-05", isHormiga: false },
  { id: "d4", amount: 65_000,  category: "Comida fuera",   date: "2026-06-07", isHormiga: false },
  { id: "d5", amount: 8_000,   category: "Gastos hormiga", date: "2026-06-08", isHormiga: true  },
  { id: "d6", amount: 12_000,  category: "Gastos hormiga", date: "2026-06-09", isHormiga: true  },
  { id: "d7", amount: 6_000,   category: "Gastos hormiga", date: "2026-06-09", isHormiga: true  },
  { id: "d8", amount: 15_000,  category: "Gastos hormiga", date: "2026-06-10", isHormiga: true  },
  { id: "d9", amount: 45_000,  category: "Otros",          date: "2026-06-10", isHormiga: false },
];

// Called by the "Cargar datos de ejemplo" button — always uses the current month's dates
export function createDemoData(): { plan: MonthlyPlan; expenses: Expense[] } {
  const month = currentMonth();
  const [year, mo] = month.split("-");
  const d = (day: number) => `${year}-${mo}-${String(day).padStart(2, "0")}`;

  const plan: MonthlyPlan = {
    expectedIncome: 4_500_000,
    savingsGoal: 700_000,
    monthlySpendingLimit: 3_800_000,
    hormigaLimit: 250_000,
    month,
  };

  const expenses: Expense[] = [
    { id: `demo-${Date.now()}-1`, amount: 320_000, category: "Mercado",        date: d(1),  isHormiga: false },
    { id: `demo-${Date.now()}-2`, amount: 85_000,  category: "Transporte",     date: d(3),  isHormiga: false },
    { id: `demo-${Date.now()}-3`, amount: 210_000, category: "Servicios",      date: d(5),  isHormiga: false },
    { id: `demo-${Date.now()}-4`, amount: 65_000,  category: "Comida fuera",   date: d(7),  isHormiga: false },
    { id: `demo-${Date.now()}-5`, amount: 8_000,   category: "Gastos hormiga", date: d(8),  isHormiga: true  },
    { id: `demo-${Date.now()}-6`, amount: 12_000,  category: "Gastos hormiga", date: d(9),  isHormiga: true  },
    { id: `demo-${Date.now()}-7`, amount: 6_000,   category: "Gastos hormiga", date: d(9),  isHormiga: true  },
    { id: `demo-${Date.now()}-8`, amount: 15_000,  category: "Gastos hormiga", date: d(10), isHormiga: true  },
    { id: `demo-${Date.now()}-9`, amount: 45_000,  category: "Otros",          date: d(10), isHormiga: false },
  ];

  return { plan, expenses };
}
