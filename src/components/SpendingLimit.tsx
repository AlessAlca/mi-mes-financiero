import type { FinancialStatus, FinancialSummary, MonthlyProfile } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  profile: MonthlyProfile;
  summary: FinancialSummary;
};

const STATUS_COPY: Record<FinancialStatus, string> = {
  onTrack:  "Vas bien. Todavía tienes caja disponible y puedes cumplir tu meta de ahorro.",
  warning:  "Ten cuidado. Tu caja disponible se está reduciendo.",
  offTrack: "Alerta. Tus gastos variables están afectando tu meta de ahorro.",
};

const STATUS_CSS: Record<FinancialStatus, string> = {
  onTrack:  "status-tip--onTrack",
  warning:  "status-tip--warning",
  offTrack: "status-tip--offTrack",
};

export function SpendingLimit({ profile, summary }: Props) {
  const pct = summary.initialVariableCashAvailable > 0
    ? Math.round((summary.variableExpensesTotal / summary.initialVariableCashAvailable) * 100)
    : 0;

  const fillClass =
    pct >= 100 ? "progress-fill--danger"
    : pct >= 80 ? "progress-fill--warning"
    : "";

  const cajaPositive = summary.currentVariableCashAvailable >= 0;
  const savingsPositive = summary.projectedSavings >= profile.monthlySavingsGoal;

  return (
    <section className="card">
      {/* Status banner */}
      <div className={`summary-status-banner ${STATUS_CSS[summary.status]}`}>
        {STATUS_COPY[summary.status]}
      </div>

      {/* ── Cash flow waterfall ── */}
      <h2 className="summary-section-title">Flujo mensual</h2>

      <div className="stat-row">
        <span>Ingreso mensual</span>
        <strong>{formatCOP(profile.monthlyIncome)}</strong>
      </div>
      <div className="stat-row stat-row--deduction">
        <span>Gastos fijos</span>
        <strong className="negative">− {formatCOP(summary.fixedExpensesTotal)}</strong>
      </div>
      <div className="stat-row stat-row--deduction">
        <span>Cuotas de pasivos</span>
        <strong className="negative">− {formatCOP(summary.liabilityMonthlyPaymentsTotal)}</strong>
      </div>
      <div className="stat-row stat-row--deduction">
        <span>Meta de ahorro</span>
        <strong className="negative">− {formatCOP(profile.monthlySavingsGoal)}</strong>
      </div>
      <div className="stat-row stat-row--result">
        <span>Caja inicial para variables</span>
        <strong className={summary.initialVariableCashAvailable < 0 ? "negative" : ""}>
          {formatCOP(summary.initialVariableCashAvailable)}
        </strong>
      </div>
      <div className="stat-row stat-row--deduction">
        <span>Gastos variables hasta hoy</span>
        <strong className="negative">− {formatCOP(summary.variableExpensesTotal)}</strong>
      </div>

      {/* Progress bar */}
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

      <div className="stat-row stat-row--hero">
        <span>Caja disponible actual</span>
        <strong className={cajaPositive ? "positive" : "negative"}>
          {formatCOP(summary.currentVariableCashAvailable)}
        </strong>
      </div>

      {/* ── Savings & net worth ── */}
      <div className="summary-divider" />
      <h2 className="summary-section-title">Ahorro y patrimonio</h2>

      <div className="stat-row">
        <span>Ahorro proyectado</span>
        <strong className={savingsPositive ? "positive" : "negative"}>
          {formatCOP(summary.projectedSavings)}
        </strong>
      </div>
      <div className="stat-row">
        <span>Patrimonio neto</span>
        <strong className={summary.netWorth >= 0 ? "positive" : "negative"}>
          {formatCOP(summary.netWorth)}
        </strong>
      </div>
      <div className="stat-row">
        <span>Patrimonio proyectado (fin de mes)</span>
        <strong className={summary.projectedNetWorth >= 0 ? "positive" : "negative"}>
          {formatCOP(summary.projectedNetWorth)}
        </strong>
      </div>
    </section>
  );
}
