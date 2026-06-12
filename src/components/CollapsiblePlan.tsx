import { useState } from "react";
import type { MonthlyProfile } from "../types";
import { formatCOPShort } from "../lib/formatting";
import { MonthlySetup } from "./MonthlySetup";

type Props = {
  profile: MonthlyProfile;
  hasProfile: boolean;
  onChange: (profile: MonthlyProfile) => void;
};

export function CollapsiblePlan({ profile, hasProfile, onChange }: Props) {
  const [open, setOpen] = useState(!hasProfile);

  if (open) {
    return (
      <div className="collapsible-expanded">
        <div className="collapsible-close-row">
          <button type="button" className="btn-close-plan" onClick={() => setOpen(false)}>
            Cerrar ×
          </button>
        </div>
        <MonthlySetup profile={profile} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="card collapsible-summary">
      <div className="collapsible-header">
        <div className="collapsible-info">
          <p className="collapsible-title">Tu plan del mes</p>
          <p className="collapsible-detail">
            {hasProfile
              ? `Ingreso ${formatCOPShort(profile.monthlyIncome)} · Meta ${formatCOPShort(profile.monthlySavingsGoal)}`
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
