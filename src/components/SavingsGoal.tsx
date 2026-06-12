import type { FinancialSummary, MonthlyProfile } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  profile: MonthlyProfile;
  summary: FinancialSummary;
};

export function SavingsGoal({ profile, summary }: Props) {
  const progress =
    profile.monthlySavingsGoal > 0
      ? Math.min(1, Math.max(0, summary.projectedSavings / profile.monthlySavingsGoal))
      : 1;
  const pct = Math.round(progress * 100);
  const onTarget = summary.savingsGap >= 0;

  const fillClass =
    progress >= 1 ? "progress-fill--success"
    : progress >= 0.8 ? "progress-fill--warning"
    : "progress-fill--danger";

  return (
    <section className="card">
      <h2>Meta de ahorro</h2>
      <div className="stat-row">
        <span>Meta</span>
        <strong>{formatCOP(profile.monthlySavingsGoal)}</strong>
      </div>
      <div className="stat-row">
        <span>Ahorro proyectado</span>
        <strong className={onTarget ? "positive" : "negative"}>
          {formatCOP(summary.projectedSavings)}
        </strong>
      </div>
      <div className="progress-wrap">
        <div className="progress-meta">
          <span>Progreso hacia la meta</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${fillClass}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="card-note">
        {onTarget
          ? `Vas ${formatCOP(summary.savingsGap)} por encima de tu meta de ahorro.`
          : `Te faltan ${formatCOP(Math.abs(summary.savingsGap))} para cumplir tu meta de ahorro.`}
      </p>
    </section>
  );
}
