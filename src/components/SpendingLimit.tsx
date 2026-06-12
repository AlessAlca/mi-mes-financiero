import type { FinancialSummary, MonthlyPlan } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  plan: MonthlyPlan;
  summary: FinancialSummary;
};

export function SpendingLimit({ plan, summary }: Props) {
  const pct = Math.round(summary.percentageBudgetUsed * 100);
  const overLimit = summary.remainingToSpend < 0;

  const fillClass =
    pct >= 100 ? "progress-fill--danger"
    : pct >= 80  ? "progress-fill--warning"
    : "";

  return (
    <section className="card">
      <h2>Límite de gastos</h2>
      <div className="stat-row">
        <span>Límite mensual</span>
        <strong>{formatCOP(plan.monthlySpendingLimit)}</strong>
      </div>
      <div className="stat-row">
        <span>Gastado hasta hoy</span>
        <strong>{formatCOP(summary.totalSpent)}</strong>
      </div>
      <div className="stat-row">
        <span>{overLimit ? "Excedido en" : "Disponible restante"}</span>
        <strong className={overLimit ? "negative" : ""}>
          {overLimit
            ? formatCOP(Math.abs(summary.remainingToSpend))
            : formatCOP(summary.remainingToSpend)}
        </strong>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>Del límite mensual usado</span>
          <span>{Math.min(pct, 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${fillClass}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      <p className="card-note">
        {overLimit
          ? `Superaste tu límite mensual en ${formatCOP(Math.abs(summary.remainingToSpend))}.`
          : `Has usado el ${pct}% de tu límite mensual de gastos.`}
      </p>
    </section>
  );
}
