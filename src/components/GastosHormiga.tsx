import type { FinancialSummary } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = { summary: FinancialSummary };

export function GastosHormiga({ summary }: Props) {
  const pct = Math.round(summary.hormigaPercentageOfTotal * 100);

  if (summary.variableExpensesTotal === 0) {
    return (
      <section className="card">
        <h2>Gastos hormiga</h2>
        <p className="card-empty">Aún no tienes gastos hormiga registrados este mes.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Gastos hormiga</h2>
      <div className="stat-row">
        <span>Total en gastos hormiga</span>
        <strong>{formatCOP(summary.hormigaTotal)}</strong>
      </div>
      <div className="stat-row">
        <span>Total gastos variables</span>
        <strong>{formatCOP(summary.variableExpensesTotal)}</strong>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>% del total variable</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${pct >= 25 ? "progress-fill--warning" : ""}`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      <p className="card-note">
        {pct >= 25
          ? `Tus gastos hormiga ya representan el ${pct}% de tus gastos variables. Considera reducirlos.`
          : `Tus gastos hormiga representan el ${pct}% de tus gastos variables este mes.`}
      </p>
    </section>
  );
}
