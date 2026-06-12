import type { FinancialSummary, MonthlyProfile } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  profile: MonthlyProfile;
  summary: FinancialSummary;
};

export function SpendingLimit({ profile, summary }: Props) {
  const pct = summary.initialVariableCashAvailable > 0
    ? Math.round((summary.variableExpensesTotal / summary.initialVariableCashAvailable) * 100)
    : 0;
  const over = summary.currentVariableCashAvailable < 0;

  const fillClass =
    pct >= 100 ? "progress-fill--danger"
    : pct >= 80  ? "progress-fill--warning"
    : "";

  return (
    <section className="card">
      <h2>Flujo de efectivo mensual</h2>
      <div className="stat-row">
        <span>Ingreso mensual</span>
        <strong>{formatCOP(profile.monthlyIncome)}</strong>
      </div>
      <div className="stat-row">
        <span>Gastos fijos</span>
        <strong className="negative">− {formatCOP(summary.fixedExpensesTotal)}</strong>
      </div>
      <div className="stat-row">
        <span>Cuotas deudas</span>
        <strong className="negative">− {formatCOP(summary.liabilityMonthlyPaymentsTotal)}</strong>
      </div>
      <div className="stat-row">
        <span>Meta de ahorro</span>
        <strong className="negative">− {formatCOP(profile.monthlySavingsGoal)}</strong>
      </div>
      <div className="stat-row">
        <span>Disponible para gastos variables</span>
        <strong className={summary.initialVariableCashAvailable < 0 ? "negative" : "positive"}>
          {formatCOP(summary.initialVariableCashAvailable)}
        </strong>
      </div>
      <div className="stat-row">
        <span>Gastos variables hasta hoy</span>
        <strong className="negative">− {formatCOP(summary.variableExpensesTotal)}</strong>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>Usado del presupuesto variable</span>
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
        {over
          ? `Superaste tu presupuesto variable en ${formatCOP(Math.abs(summary.currentVariableCashAvailable))}.`
          : `Te quedan ${formatCOP(summary.currentVariableCashAvailable)} para gastos variables este mes.`}
      </p>
    </section>
  );
}
