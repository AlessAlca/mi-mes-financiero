import type { FinancialSummary } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = { summary: FinancialSummary };

export function NetWorthCard({ summary }: Props) {
  const growing = summary.projectedNetWorth > summary.netWorth;

  return (
    <section className="card">
      <h2>Patrimonio neto</h2>
      <div className="stat-row">
        <span>Total activos</span>
        <strong className="positive">{formatCOP(summary.assetsTotal)}</strong>
      </div>
      <div className="stat-row">
        <span>Total deudas</span>
        <strong className="negative">− {formatCOP(summary.liabilitiesTotal)}</strong>
      </div>
      <div className="stat-row">
        <span>Patrimonio actual</span>
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
      <p className="card-note">
        {growing
          ? `Tu patrimonio crecerá ${formatCOP(summary.projectedNetWorth - summary.netWorth)} este mes si mantienes el ritmo.`
          : "Tus gastos actuales no están aumentando tu patrimonio este mes."}
      </p>
    </section>
  );
}
