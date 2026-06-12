import type { FinancialStatus, FinancialSummary, MonthlyProfile } from "../types";
import { formatCOP, formatCOPShort, formatMonth } from "../lib/formatting";

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
  onTrack:  "Todavía tienes caja disponible y puedes cumplir tu meta.",
  warning:  "Tu caja disponible se está reduciendo.",
  offTrack: "Tus gastos variables están afectando tu meta de ahorro.",
};

export function Header({ profile, summary, hasProfile, onAddExpense }: Props) {
  const cajaPositive = summary.currentVariableCashAvailable >= 0;

  return (
    <header className="app-header">
      <div className="header-inner">

        {/* Row 1 — title + month */}
        <div className="header-top">
          <h1 className="header-title">Mi mes financiero</h1>
          {hasProfile && (
            <span className="header-month">{formatMonth(profile.month)}</span>
          )}
        </div>

        {/* Row 2 — status */}
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
            Configura tu plan en la pestaña "Setup" para ver tu resumen.
          </p>
        )}

        {/* Row 3 — hero KPI: caja disponible */}
        {hasProfile && (
          <div className="header-hero">
            <div className={`header-hero-value${cajaPositive ? "" : " header-hero-value--danger"}`}>
              {formatCOP(summary.currentVariableCashAvailable)}
            </div>
            <div className="header-hero-label">Caja disponible para variables</div>
          </div>
        )}

        {/* Row 4 — secondary KPIs */}
        {hasProfile && (
          <div className="header-kpis">
            <div className="header-kpi">
              <span className="header-kpi-label">Ingreso</span>
              <span className="header-kpi-value">{formatCOPShort(profile.monthlyIncome)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Gastado</span>
              <span className="header-kpi-value">{formatCOPShort(summary.variableExpensesTotal)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Ahorro proy.</span>
              <span className="header-kpi-value">{formatCOPShort(summary.projectedSavings)}</span>
            </div>
            <div className="header-kpi">
              <span className="header-kpi-label">Patrimonio</span>
              <span className="header-kpi-value">{formatCOPShort(summary.netWorth)}</span>
            </div>
          </div>
        )}

        {/* Row 5 — action */}
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
