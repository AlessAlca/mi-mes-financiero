import type { Expense, FinancialStatus, FinancialSummary, MonthlyPlan } from "../types";

/**
 * `referenceDate` is injectable so unit tests can pin the date and get
 * deterministic spending-pace results without mocking globals.
 */
export function calculateSummary(
  plan: MonthlyPlan,
  expenses: Expense[],
  referenceDate: Date = new Date()
): FinancialSummary {
  const availableToSpend = plan.expectedIncome - plan.savingsGoal;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingToSpend = plan.monthlySpendingLimit - totalSpent;
  const projectedSavings = plan.expectedIncome - totalSpent;
  const savingsGap = projectedSavings - plan.savingsGoal;
  const percentageBudgetUsed =
    plan.monthlySpendingLimit > 0 ? totalSpent / plan.monthlySpendingLimit : 0;

  const { daysLeft, expectedPaceByToday } = paceMetrics(plan, referenceDate);
  const recommendedDailySpend = remainingToSpend > 0 ? remainingToSpend / daysLeft : 0;

  const hormigaTotal = expenses
    .filter((e) => e.isHormiga)
    .reduce((sum, e) => sum + e.amount, 0);
  const percentageHormigaUsed =
    plan.hormigaLimit > 0 ? hormigaTotal / plan.hormigaLimit : 0;
  const hormigaPercentageOfTotal = totalSpent > 0 ? hormigaTotal / totalSpent : 0;

  const status = deriveStatus(
    plan,
    totalSpent,
    projectedSavings,
    percentageHormigaUsed,
    expectedPaceByToday
  );

  return {
    availableToSpend,
    totalSpent,
    remainingToSpend,
    projectedSavings,
    savingsGap,
    percentageBudgetUsed,
    recommendedDailySpend,
    hormigaTotal,
    percentageHormigaUsed,
    hormigaPercentageOfTotal,
    status,
  };
}

/** How many days are left in the month and how much should have been spent by today. */
export function paceMetrics(
  plan: MonthlyPlan,
  referenceDate: Date = new Date()
): { daysLeft: number; expectedPaceByToday: number } {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const daysInCurrentMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const dayOfMonth = referenceDate.getUTCDate();
  const daysLeft = Math.max(1, daysInCurrentMonth - dayOfMonth + 1);
  const expectedPaceByToday =
    plan.monthlySpendingLimit > 0
      ? (plan.monthlySpendingLimit / daysInCurrentMonth) * dayOfMonth
      : 0;
  return { daysLeft, expectedPaceByToday };
}

function deriveStatus(
  plan: MonthlyPlan,
  totalSpent: number,
  projectedSavings: number,
  percentageHormigaUsed: number,
  expectedPaceByToday: number
): FinancialStatus {
  // Off track: savings goal will be missed or limit already exceeded
  if (projectedSavings < plan.savingsGoal || totalSpent > plan.monthlySpendingLimit) {
    return "offTrack";
  }
  // Warning: spending faster than the daily pace, budget nearly gone, or hormiga high
  const aheadOfPace = expectedPaceByToday > 0 && totalSpent > expectedPaceByToday;
  const highBudget =
    plan.monthlySpendingLimit > 0 && totalSpent / plan.monthlySpendingLimit >= 0.8;
  const highHormiga = percentageHormigaUsed >= 0.8;
  if (aheadOfPace || highBudget || highHormiga) {
    return "warning";
  }
  return "onTrack";
}

export function spendingByCategory(expenses: Expense[]): Record<string, number> {
  return expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
}
