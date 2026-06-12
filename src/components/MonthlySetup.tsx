import { useState } from "react";
import type { MonthlyProfile } from "../types";

type Props = {
  profile: MonthlyProfile;
  onChange: (profile: MonthlyProfile) => void;
};

type Field = Exclude<keyof MonthlyProfile, "id" | "month">;

function validate(field: Field, value: number): string {
  if (field === "monthlyIncome") {
    if (!value || value <= 0) return "Ingresa tu ingreso mensual esperado";
    if (value > 10_000_000) return "El ingreso no puede superar $ 10.000.000";
  }
  if (field === "monthlySavingsGoal" && value < 0) {
    return "La meta de ahorro no puede ser negativa";
  }
  return "";
}

export function MonthlySetup({ profile, onChange }: Props) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  function handleChange(field: Field, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    if (isNaN(value)) return;
    const error = validate(field, value);
    if (!error) setErrors((prev) => ({ ...prev, [field]: undefined }));
    onChange({ ...profile, [field]: value });
  }

  function handleBlur(field: Field) {
    const error = validate(field, profile[field] as number);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  }

  return (
    <section className="card">
      <h2>Tu plan del mes</h2>
      <p className="card-helper">
        Define tu ingreso y meta de ahorro para calcular cuánto puedes gastar.
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="monthlyIncome">Ingreso esperado del mes</label>
          <input
            id="monthlyIncome"
            type="number"
            className={errors.monthlyIncome ? "input--error" : ""}
            value={profile.monthlyIncome || ""}
            onChange={(e) => handleChange("monthlyIncome", e.target.value)}
            onBlur={() => handleBlur("monthlyIncome")}
            placeholder="4.500.000"
          />
          {errors.monthlyIncome && <p className="field-error">{errors.monthlyIncome}</p>}
        </div>

        <div className="field">
          <label htmlFor="monthlySavingsGoal">Meta de ahorro mensual</label>
          <input
            id="monthlySavingsGoal"
            type="number"
            className={errors.monthlySavingsGoal ? "input--error" : ""}
            value={profile.monthlySavingsGoal || ""}
            onChange={(e) => handleChange("monthlySavingsGoal", e.target.value)}
            onBlur={() => handleBlur("monthlySavingsGoal")}
            placeholder="700.000"
          />
          {errors.monthlySavingsGoal && <p className="field-error">{errors.monthlySavingsGoal}</p>}
        </div>
      </div>
    </section>
  );
}
