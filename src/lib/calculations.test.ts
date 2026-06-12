import { describe, expect, it } from "vitest";
import { calculateSummary, paceMetrics, spendingByCategory } from "./calculations";
import type { Expense, MonthlyPlan } from "../types";

// Fixed date: June 15 2026, day 15 of a 30-day month.
// expectedPaceByToday = 3_800_000 / 30 * 15 = 1_900_000
const REF_DATE = new Date("2026-06-15");

const PLAN: MonthlyPlan = {
  expectedIncome: 4_500_000,
  savingsGoal: 700_000,
  monthlySpendingLimit: 3_800_000,
  hormigaLimit: 250_000,
  month: "2026-06",
};

function expense(id: string, amount: number, isHormiga = false): Expense {
  return { id, amount, category: isHormiga ? "Gastos hormiga" : "Mercado", date: "2026-06-01", isHormiga };
}

// ── Core calculations ────────────────────────────────────────────────────────

describe("calculateSummary — core fields", () => {
  it("all fields are zero for an empty expense list", () => {
    const s = calculateSummary(PLAN, [], REF_DATE);
    expect(s.totalSpent).toBe(0);
    expect(s.hormigaTotal).toBe(0);
    expect(s.remainingToSpend).toBe(PLAN.monthlySpendingLimit);
    expect(s.projectedSavings).toBe(PLAN.expectedIncome);
  });

  it("availableToSpend = expectedIncome − savingsGoal", () => {
    const s = calculateSummary(PLAN, [], REF_DATE);
    expect(s.availableToSpend).toBe(3_800_000);
  });

  it("totalSpent sums all expense amounts", () => {
    const s = calculateSummary(PLAN, [expense("a", 500_000), expense("b", 200_000)], REF_DATE);
    expect(s.totalSpent).toBe(700_000);
  });

  it("hormigaTotal only sums isHormiga=true expenses", () => {
    const s = calculateSummary(
      PLAN,
      [expense("a", 100_000, true), expense("b", 200_000, false)],
      REF_DATE
    );
    expect(s.hormigaTotal).toBe(100_000);
  });

  it("remainingToSpend = monthlySpendingLimit − totalSpent", () => {
    const s = calculateSummary(PLAN, [expense("a", 800_000)], REF_DATE);
    expect(s.remainingToSpend).toBe(3_000_000);
  });

  it("projectedSavings = expectedIncome − totalSpent", () => {
    const s = calculateSummary(PLAN, [expense("a", 1_000_000)], REF_DATE);
    expect(s.projectedSavings).toBe(3_500_000);
  });

  it("savingsGap = projectedSavings − savingsGoal", () => {
    const s = calculateSummary(PLAN, [expense("a", 1_000_000)], REF_DATE);
    expect(s.savingsGap).toBe(2_800_000);
  });

  it("savingsGap is negative when savings goal will be missed", () => {
    const s = calculateSummary(PLAN, [expense("a", 4_000_000)], REF_DATE);
    expect(s.savingsGap).toBeLessThan(0);
  });

  it("percentageBudgetUsed = totalSpent / monthlySpendingLimit", () => {
    const s = calculateSummary(PLAN, [expense("a", 1_900_000)], REF_DATE);
    expect(s.percentageBudgetUsed).toBeCloseTo(0.5);
  });

  it("recommendedDailySpend = remainingToSpend / daysLeft", () => {
    // remainingToSpend = 3_800_000 − 600_000 = 3_200_000
    // daysLeft on June 15: 30 − 15 + 1 = 16
    const s = calculateSummary(PLAN, [expense("a", 600_000)], REF_DATE);
    expect(s.recommendedDailySpend).toBeCloseTo(3_200_000 / 16);
  });
});

// ── Status logic ─────────────────────────────────────────────────────────────

describe("calculateSummary — status", () => {
  it("onTrack when spending is well within pace and limits", () => {
    // Day 15, expectedPace = 1_900_000, spending 500_000 → under pace, under limit
    const s = calculateSummary(PLAN, [expense("a", 500_000)], REF_DATE);
    expect(s.status).toBe("onTrack");
  });

  it("offTrack when projectedSavings < savingsGoal", () => {
    // projectedSavings = 4_500_000 − 4_000_000 = 500_000 < 700_000
    const s = calculateSummary(PLAN, [expense("a", 4_000_000)], REF_DATE);
    expect(s.status).toBe("offTrack");
  });

  it("offTrack when totalSpent exceeds monthlySpendingLimit", () => {
    const s = calculateSummary(PLAN, [expense("a", 3_900_000)], REF_DATE);
    expect(s.status).toBe("offTrack");
  });

  it("warning when hormiga usage is >= 80% of hormigaLimit", () => {
    // hormigaLimit = 250_000, spending 200_000 = 80%
    const s = calculateSummary(PLAN, [expense("a", 200_000, true)], REF_DATE);
    expect(s.status).toBe("warning");
  });

  it("warning when spending is ahead of the daily pace", () => {
    // expectedPaceByToday = 1_900_000; spending 2_100_000 is ahead of pace
    // projectedSavings = 4_500_000 − 2_100_000 = 2_400_000 >= 700_000, so not offTrack
    const s = calculateSummary(PLAN, [expense("a", 2_100_000)], REF_DATE);
    expect(s.status).toBe("warning");
  });

  it("warning when budget usage is >= 80%", () => {
    // 80% of 3_800_000 = 3_040_000; projectedSavings = 4_500_000 − 3_040_000 = 1_460_000 >= 700_000
    const s = calculateSummary(PLAN, [expense("a", 3_040_000)], REF_DATE);
    expect(s.status).toBe("warning");
  });
});

// ── paceMetrics ──────────────────────────────────────────────────────────────

describe("paceMetrics", () => {
  it("computes correct daysLeft and expectedPaceByToday", () => {
    const { daysLeft, expectedPaceByToday } = paceMetrics(PLAN, REF_DATE);
    expect(daysLeft).toBe(16); // June 15 → 30 − 15 + 1
    expect(expectedPaceByToday).toBeCloseTo(1_900_000); // 3_800_000 / 30 * 15
  });

  it("daysLeft is at least 1 on the last day of the month", () => {
    const lastDay = new Date("2026-06-30");
    const { daysLeft } = paceMetrics(PLAN, lastDay);
    expect(daysLeft).toBe(1);
  });
});

// ── spendingByCategory ───────────────────────────────────────────────────────

describe("spendingByCategory", () => {
  it("groups amounts by category", () => {
    const expenses: Expense[] = [
      { id: "1", amount: 200_000, category: "Mercado", date: "2026-06-01", isHormiga: false },
      { id: "2", amount: 150_000, category: "Mercado", date: "2026-06-02", isHormiga: false },
      { id: "3", amount: 80_000, category: "Transporte", date: "2026-06-01", isHormiga: false },
    ];
    const result = spendingByCategory(expenses);
    expect(result["Mercado"]).toBe(350_000);
    expect(result["Transporte"]).toBe(80_000);
  });

  it("returns empty object for no expenses", () => {
    expect(spendingByCategory([])).toEqual({});
  });
});
