import type { FinancialSummary, MonthlyPlan } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  plan: MonthlyPlan;
  summary: FinancialSummary;
};

export function GastosHormiga({ plan, summary }: Props) {
  const pct = Math.round(summary.percentageHormigaUsed * 100);
  const exceeded = summary.hormigaTotal > plan.hormigaLimit;
  const hormigaPctOfTotal = Math.round(summary.hormigaPercentageOfTotal * 100);

  const fillClass =
    exceeded   ? "progress-fill--danger"
    : pct >= 80 ? "progress-fill--warning"
    : "";

  return (
    <section className="card">
      <h2>Gastos hormiga</h2>
      <div className="stat-row">
        <span>Límite hormiga</span>
        <strong>{formatCOP(plan.hormigaLimit)}</strong>
      </div>
      <div className="stat-row">
        <span>Total en gastos hormiga</span>
        <strong className={exceeded ? "negative" : ""}>
          {formatCOP(summary.hormigaTotal)}
        </strong>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>Del límite hormiga usado</span>
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
        {exceeded
          ? `Tus gastos hormiga superaron el límite en ${formatCOP(summary.hormigaTotal - plan.hormigaLimit)}.`
          : summary.totalSpent > 0
          ? `Tus gastos hormiga representan el ${hormigaPctOfTotal}% de todo lo que has gastado este mes.`
          : "Aún no tienes gastos hormiga registrados este mes."}
      </p>
    </section>
  );
}
