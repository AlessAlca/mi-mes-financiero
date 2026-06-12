import type { FinancialStatus, FinancialSummary, MonthlyProfile } from "../types";
import { formatCOPShort, formatMonth } from "../lib/formatting";

type Props = {
  profile: MonthlyProfile;
  summary: FinancialSummary;
  hasProfile: boolean;
  onAddExpense: () => void;
};

const STATUS_LABEL: Record<FinancialStatus, string> = {
  onTrack:  "Al día",
  warning:  "Ten cuidado",
  offTrack: "Alerta",
};

const STATUS_MSG: Record<FinancialStatus, string> = {
  onTrack:  "Vas bien. Si mantienes este ritmo, puedes cumplir tu meta.",
  warning:  "Tu ritmo de gasto está alto para este punto del mes.",
  offTrack: "Con tus gastos actuales podrías no cumplir tu meta de ahorro.",
};

export function Header({ profile, summary, hasProfile, onAddExpense }: Props) {
  return (
    <header className="app-header">
      <div className="header-inner">

        <div className="header-top">
          <h1 className="header-title">Mi mes financiero</h1>
          {hasProfile && (
            <span className="header-month">{formatMonth(profile.month)}</span>
          )}
        </div>

        {hasProfile ? (
          <div className={`header-status header-status--${summary.status}`}>
            <span className="header-status-dot" aria-hidden="true" />
            <div className="header-status-body">
              <span className="header-status-label">{STATUS_LABEL[summary.status]}</span>
              <span className="header-status-msg">{STATUS_MSG[summary.status]}</span>
            </div>
          </div>
        ) : (
          <p className="header-empty-prompt">
            Define tu plan mensual para ver cómo va tu mes.
          </p>
        )}

        {hasProfile && (
          <div className="header-kpis">
            <div className="header-kpi">
              <span className="header-kpi-label">Gastado</span>
              <span className="header-kpi-value">{formatCOPShort(summary.variableExpensesTotal)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Disponible</span>
              <span className="header-kpi-value">{formatCOPShort(summary.currentVariableCashAvailable)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Meta</span>
              <span className="header-kpi-value">{formatCOPShort(profile.monthlySavingsGoal)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Diario</span>
              <span className="header-kpi-value">{formatCOPShort(summary.recommendedDailySpend)}</span>
            </div>
          </div>
        )}

        <div className="header-actions">
          <button
            type="button"
            className="header-btn header-btn--primary"
            onClick={onAddExpense}
          >
            + Agregar gasto
          </button>
        </div>

      </div>
    </header>
  );
}
