import { describe, expect, it } from "vitest";
import { calculateSummary, paceMetrics, spendingByCategory } from "./calculations";
import type {
  Asset,
  FixedExpense,
  Liability,
  MonthlyProfile,
  VariableExpense,
} from "../types";

// Fixed reference: June 15 2026, day 15 of 30.
// initialVariableCash = 4_500_000 - 1_490_000 (fixed) - 850_000 (liab payments) - 700_000 (goal)
//                     = 1_460_000
// expectedSpendByToday = 1_460_000 / 30 * 15 = 730_000
const REF_DATE = new Date("2026-06-15");

const PROFILE: MonthlyProfile = {
  id: "p1",
  month: "2026-06",
  monthlyIncome: 4_500_000,
  monthlySavingsGoal: 700_000,
};

const FIXED: FixedExpense[] = [
  { id: "f1", name: "Arriendo",           monthlyAmount: 1_200_000 },
  { id: "f2", name: "Servicios públicos", monthlyAmount:   210_000 },
  { id: "f3", name: "Internet",           monthlyAmount:    80_000 },
];
// fixedExpensesTotal = 1_490_000

const LIABILITIES: Liability[] = [
  { id: "l1", name: "Carro",   totalAmount: 15_000_000, monthlyPayment: 650_000 },
  { id: "l2", name: "Tarjeta", totalAmount:  2_500_000, monthlyPayment: 200_000 },
];
// liabilityMonthlyPaymentsTotal = 850_000
// liabilitiesTotal              = 17_500_000

const ASSETS: Asset[] = [
  { id: "a1", name: "Ahorros",  type: "ahorro",   value:  3_500_000 },
  { id: "a2", name: "Vehículo", type: "vehiculo", value: 28_000_000 },
];
// assetsTotal = 31_500_000

function ve(id: string, amount: number, isHormiga = false): VariableExpense {
  return {
    id,
    amount,
    category: isHormiga ? "Gastos hormiga" : "Mercado",
    date: "2026-06-01",
    isHormiga,
  };
}

// ── Cash flow calculations ───────────────────────────────────────────────────

describe("calculateSummary — cash flow", () => {
  it("fixedExpensesTotal sums all fixed expenses", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.fixedExpensesTotal).toBe(1_490_000);
  });

  it("liabilityMonthlyPaymentsTotal sums monthly payments only", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.liabilityMonthlyPaymentsTotal).toBe(850_000);
  });

  it("initialVariableCashAvailable = income − fixed − liabPayments − savingsGoal", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    // 4_500_000 − 1_490_000 − 850_000 − 700_000 = 1_460_000
    expect(s.initialVariableCashAvailable).toBe(1_460_000);
  });

  it("currentVariableCashAvailable decreases as variable expenses are added", () => {
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 400_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.currentVariableCashAvailable).toBe(1_060_000);
  });

  it("currentVariableCashAvailable is zero when empty variable expenses", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.currentVariableCashAvailable).toBe(1_460_000);
  });
});

// ── Savings ──────────────────────────────────────────────────────────────────

describe("calculateSummary — savings", () => {
  it("projectedSavings = income − fixed − liabPayments − variableExpenses", () => {
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 300_000)], LIABILITIES, ASSETS, REF_DATE);
    // 4_500_000 − 1_490_000 − 850_000 − 300_000 = 1_860_000
    expect(s.projectedSavings).toBe(1_860_000);
  });

  it("savingsGap is positive when above goal", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.savingsGap).toBe(s.projectedSavings - PROFILE.monthlySavingsGoal);
    expect(s.savingsGap).toBeGreaterThan(0);
  });

  it("savingsGap is negative when below goal", () => {
    // Need projectedSavings < 700_000
    // projectedSavings = 4_500_000 - 1_490_000 - 850_000 - variableExpenses < 700_000
    // variableExpenses > 1_460_000
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 1_600_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.savingsGap).toBeLessThan(0);
  });
});

// ── Net worth ────────────────────────────────────────────────────────────────

describe("calculateSummary — net worth", () => {
  it("assetsTotal sums all asset values", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.assetsTotal).toBe(31_500_000);
  });

  it("liabilitiesTotal sums totalAmount, not monthlyPayment", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.liabilitiesTotal).toBe(17_500_000);
  });

  it("netWorth = assetsTotal − liabilitiesTotal", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.netWorth).toBe(14_000_000);
  });

  it("projectedNetWorth = netWorth + max(projectedSavings, 0)", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    const expectedProjected = s.netWorth + Math.max(s.projectedSavings, 0);
    expect(s.projectedNetWorth).toBe(expectedProjected);
  });

  it("projectedNetWorth does not add negative projectedSavings", () => {
    // projectedSavings = 4_500_000 - 1_490_000 - 850_000 - 2_500_000 = -340_000 (negative)
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 2_500_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.projectedSavings).toBeLessThan(0);
    expect(s.projectedNetWorth).toBe(s.netWorth); // max(negative, 0) = 0, so no addition
  });
});

// ── Status ───────────────────────────────────────────────────────────────────

describe("calculateSummary — status", () => {
  it("onTrack with low variable spending", () => {
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 200_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.status).toBe("onTrack");
  });

  it("offTrack when projectedSavings < monthlySavingsGoal", () => {
    // variableExpenses > initialVariable = 1_460_000 to miss goal
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 1_600_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.status).toBe("offTrack");
  });

  it("offTrack when currentVariableCashAvailable < 0", () => {
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 1_600_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.currentVariableCashAvailable).toBeLessThan(0);
    expect(s.status).toBe("offTrack");
  });

  it("warning when variable spending is ahead of daily pace", () => {
    // expectedSpendByToday = 1_460_000 / 30 * 15 = 730_000
    // Spending 900_000 is ahead of pace but projectedSavings still OK
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 900_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.status).toBe("warning");
  });

  it("warning when 80%+ of variable cash is used", () => {
    // 80% of 1_460_000 = 1_168_000
    const s = calculateSummary(PROFILE, FIXED, [ve("a", 1_168_000)], LIABILITIES, ASSETS, REF_DATE);
    expect(s.status).toBe("warning");
  });
});

// ── Hormiga ──────────────────────────────────────────────────────────────────

describe("calculateSummary — hormiga", () => {
  it("hormigaTotal counts only isHormiga=true expenses", () => {
    const s = calculateSummary(
      PROFILE, FIXED,
      [ve("a", 100_000, true), ve("b", 200_000, false)],
      LIABILITIES, ASSETS, REF_DATE
    );
    expect(s.hormigaTotal).toBe(100_000);
  });

  it("hormigaPercentageOfTotal is zero when no variable expenses", () => {
    const s = calculateSummary(PROFILE, FIXED, [], LIABILITIES, ASSETS, REF_DATE);
    expect(s.hormigaPercentageOfTotal).toBe(0);
  });
});

// ── paceMetrics ──────────────────────────────────────────────────────────────

describe("paceMetrics", () => {
  it("computes correct daysLeft and expectedSpendByToday", () => {
    const { daysLeft, expectedSpendByToday } = paceMetrics(1_460_000, REF_DATE);
    expect(daysLeft).toBe(16);                                   // 30 − 15 + 1
    expect(expectedSpendByToday).toBeCloseTo(730_000);           // 1_460_000 / 30 * 15
  });

  it("daysLeft is at least 1 on the last day of the month", () => {
    const { daysLeft } = paceMetrics(1_460_000, new Date("2026-06-30"));
    expect(daysLeft).toBe(1);
  });

  it("expectedSpendByToday is 0 when initialVariableCash is 0", () => {
    const { expectedSpendByToday } = paceMetrics(0, REF_DATE);
    expect(expectedSpendByToday).toBe(0);
  });
});

// ── spendingByCategory ───────────────────────────────────────────────────────

describe("spendingByCategory", () => {
  it("groups variable expenses by category", () => {
    const expenses: VariableExpense[] = [
      { id: "1", amount: 200_000, category: "Mercado",    date: "2026-06-01", isHormiga: false },
      { id: "2", amount: 150_000, category: "Mercado",    date: "2026-06-02", isHormiga: false },
      { id: "3", amount:  80_000, category: "Transporte", date: "2026-06-01", isHormiga: false },
    ];
    const result = spendingByCategory(expenses);
    expect(result["Mercado"]).toBe(350_000);
    expect(result["Transporte"]).toBe(80_000);
  });

  it("returns empty object for no expenses", () => {
    expect(spendingByCategory([])).toEqual({});
  });
});
