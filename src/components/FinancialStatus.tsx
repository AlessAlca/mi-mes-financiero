import type { FinancialStatus, FinancialSummary, MonthlyPlan } from "../types";
import { formatCOP } from "../lib/formatting";

const STATUS_LABEL: Record<FinancialStatus, string> = {
  onTrack:  "Al día",
  warning:  "Ten cuidado",
  offTrack: "Alerta",
};

const STATUS_MESSAGES: Record<FinancialStatus, string> = {
  onTrack:  "Vas bien. Si mantienes este ritmo, puedes cumplir tu meta de ahorro.",
  warning:  "Ten cuidado. Tu ritmo de gasto está alto para este punto del mes.",
  offTrack: "Alerta. Con tus gastos actuales podrías no cumplir tu meta de ahorro.",
};

const STATUS_CLASS: Record<FinancialStatus, string> = {
  onTrack:  "on-track",
  warning:  "warning",
  offTrack: "off-track",
};

type Props = {
  plan: MonthlyPlan;
  summary: FinancialSummary;
};

export function FinancialStatus({ plan, summary }: Props) {
  const cssClass = STATUS_CLASS[summary.status];

  return (
    <section className={`card status-card status--${cssClass}`}>
      <span className="status-badge">{STATUS_LABEL[summary.status]}</span>
      <p className="status-message">{STATUS_MESSAGES[summary.status]}</p>
      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Ingreso esperado</span>
          <span className="stat-value">{formatCOP(plan.expectedIncome)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Gastado hasta hoy</span>
          <span className="stat-value">{formatCOP(summary.totalSpent)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Disponible restante</span>
          <span className="stat-value">{formatCOP(summary.remainingToSpend)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Ahorro proyectado</span>
          <span className="stat-value">{formatCOP(summary.projectedSavings)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Gasto diario recomendado</span>
          <span className="stat-value">{formatCOP(summary.recommendedDailySpend)}</span>
        </div>
      </div>
    </section>
  );
}
