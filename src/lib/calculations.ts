import type {
  Asset,
  FinancialStatus,
  FinancialSummary,
  FixedExpense,
  Liability,
  MonthlyProfile,
  VariableExpense,
} from "../types";

/**
 * `referenceDate` is injectable so unit tests can pin the date and get
 * deterministic spending-pace results without mocking globals.
 */
export function calculateSummary(
  profile: MonthlyProfile,
  fixedExpenses: FixedExpense[],
  variableExpenses: VariableExpense[],
  liabilities: Liability[],
  assets: Asset[],
  referenceDate: Date = new Date()
): FinancialSummary {
  // ── Totals ──────────────────────────────────────────────────────────────────
  const fixedExpensesTotal = fixedExpenses.reduce((s, e) => s + e.monthlyAmount, 0);
  const liabilityMonthlyPaymentsTotal = liabilities.reduce((s, l) => s + l.monthlyPayment, 0);
  const liabilitiesTotal = liabilities.reduce((s, l) => s + l.totalAmount, 0);
  const variableExpensesTotal = variableExpenses.reduce((s, e) => s + e.amount, 0);
  const assetsTotal = assets.reduce((s, a) => s + a.value, 0);

  // ── Monthly cash flow ────────────────────────────────────────────────────────
  const initialVariableCashAvailable =
    profile.monthlyIncome -
    fixedExpensesTotal -
    liabilityMonthlyPaymentsTotal -
    profile.monthlySavingsGoal;

  const currentVariableCashAvailable = initialVariableCashAvailable - variableExpensesTotal;

  // ── Savings ──────────────────────────────────────────────────────────────────
  const projectedSavings =
    profile.monthlyIncome -
    fixedExpensesTotal -
    liabilityMonthlyPaymentsTotal -
    variableExpensesTotal;

  const savingsGap = projectedSavings - profile.monthlySavingsGoal;

  // ── Net worth ────────────────────────────────────────────────────────────────
  const netWorth = assetsTotal - liabilitiesTotal;
  const projectedNetWorth = netWorth + Math.max(projectedSavings, 0);

  // ── Hormiga ──────────────────────────────────────────────────────────────────
  const hormigaTotal = variableExpenses
    .filter((e) => e.isHormiga)
    .reduce((s, e) => s + e.amount, 0);
  const hormigaPercentageOfTotal =
    variableExpensesTotal > 0 ? hormigaTotal / variableExpensesTotal : 0;

  // ── Daily guidance ───────────────────────────────────────────────────────────
  const { daysLeft, expectedSpendByToday } = paceMetrics(
    initialVariableCashAvailable,
    referenceDate
  );
  const recommendedDailySpend =
    currentVariableCashAvailable > 0 ? currentVariableCashAvailable / daysLeft : 0;

  const status = deriveStatus(
    profile,
    projectedSavings,
    currentVariableCashAvailable,
    initialVariableCashAvailable,
    variableExpensesTotal,
    expectedSpendByToday
  );

  return {
    fixedExpensesTotal,
    liabilityMonthlyPaymentsTotal,
    initialVariableCashAvailable,
    variableExpensesTotal,
    currentVariableCashAvailable,
    projectedSavings,
    savingsGap,
    hormigaTotal,
    hormigaPercentageOfTotal,
    assetsTotal,
    liabilitiesTotal,
    netWorth,
    projectedNetWorth,
    recommendedDailySpend,
    status,
  };
}

/**
 * How many days are left in the month and how much of the variable cash budget
 * should have been used by today (linear pace).
 *
 * Takes `initialVariableCashAvailable` directly so it can be called from tests
 * without needing a full profile.
 */
export function paceMetrics(
  initialVariableCashAvailable: number,
  referenceDate: Date = new Date()
): { daysLeft: number; expectedSpendByToday: number } {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const daysInCurrentMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const dayOfMonth = referenceDate.getUTCDate();
  const daysLeft = Math.max(1, daysInCurrentMonth - dayOfMonth + 1);
  const expectedSpendByToday =
    initialVariableCashAvailable > 0
      ? (initialVariableCashAvailable / daysInCurrentMonth) * dayOfMonth
      : 0;
  return { daysLeft, expectedSpendByToday };
}

function deriveStatus(
  profile: MonthlyProfile,
  projectedSavings: number,
  currentVariableCashAvailable: number,
  initialVariableCashAvailable: number,
  variableExpensesTotal: number,
  expectedSpendByToday: number
): FinancialStatus {
  // Off track: savings goal will be missed or variable cash exhausted
  if (
    projectedSavings < profile.monthlySavingsGoal ||
    currentVariableCashAvailable < 0
  ) {
    return "offTrack";
  }
  // Warning: spending faster than daily pace or 80%+ of variable cash used
  const aheadOfPace =
    expectedSpendByToday > 0 && variableExpensesTotal > expectedSpendByToday;
  const highUsage =
    initialVariableCashAvailable > 0 &&
    variableExpensesTotal / initialVariableCashAvailable >= 0.8;
  if (aheadOfPace || highUsage) {
    return "warning";
  }
  return "onTrack";
}

export function spendingByCategory(
  expenses: VariableExpense[]
): Record<string, number> {
  return expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
}
