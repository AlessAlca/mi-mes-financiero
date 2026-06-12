import { useState } from "react";
import type { MonthlyPlan } from "../types";
import { formatCOPShort } from "../lib/formatting";
import { MonthlySetup } from "./MonthlySetup";

type Props = {
  plan: MonthlyPlan;
  hasPlan: boolean;
  onChange: (plan: MonthlyPlan) => void;
};

export function CollapsiblePlan({ plan, hasPlan, onChange }: Props) {
  // Expand by default when no plan exists so the user sees the form immediately
  const [open, setOpen] = useState(!hasPlan);

  if (open) {
    return (
      <div className="collapsible-expanded">
        <div className="collapsible-close-row">
          <button type="button" className="btn-close-plan" onClick={() => setOpen(false)}>
            Cerrar ×
          </button>
        </div>
        <MonthlySetup plan={plan} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="card collapsible-summary">
      <div className="collapsible-header">
        <div className="collapsible-info">
          <p className="collapsible-title">Tu plan del mes</p>
          <p className="collapsible-detail">
            {hasPlan
              ? `Ingreso ${formatCOPShort(plan.expectedIncome)} · Meta ${formatCOPShort(plan.savingsGoal)} · Límite ${formatCOPShort(plan.monthlySpendingLimit)}`
              : "Define tu plan mensual para empezar."}
          </p>
        </div>
        <button type="button" className="btn-plan" onClick={() => setOpen(true)}>
          Editar
        </button>
      </div>
    </div>
  );
}
