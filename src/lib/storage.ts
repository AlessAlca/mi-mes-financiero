import type { Expense, MonthlyPlan } from "../types";

const PLAN_KEY = "personal-finance-monthly-plan";
const EXPENSES_KEY = "personal-finance-expenses";

export function loadPlan(): MonthlyPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as MonthlyPlan) : null;
  } catch {
    return null;
  }
}

export function savePlan(plan: MonthlyPlan): void {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function clearAll(): void {
  localStorage.removeItem(PLAN_KEY);
  localStorage.removeItem(EXPENSES_KEY);
}
