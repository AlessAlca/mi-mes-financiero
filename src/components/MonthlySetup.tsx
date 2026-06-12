import { useState } from "react";
import type { MonthlyPlan } from "../types";

type Props = {
  plan: MonthlyPlan;
  onChange: (plan: MonthlyPlan) => void;
};

type Field = Exclude<keyof MonthlyPlan, "month">;

function validate(field: Field, value: number): string {
  if (field === "expectedIncome") {
    if (!value || value <= 0) return "Ingresa tu ingreso mensual esperado";
    if (value > 10_000_000) return "El ingreso no puede superar $ 10.000.000";
  }
  if (field === "monthlySpendingLimit") {
    if (!value || value <= 0) return "El límite de gastos debe ser mayor a $ 0";
  }
  if ((field === "savingsGoal" || field === "hormigaLimit") && value < 0) {
    return "El valor no puede ser negativo";
  }
  return "";
}

export function MonthlySetup({ plan, onChange }: Props) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  function handleChange(field: Field, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    if (isNaN(value)) return;
    // Clear the error as soon as the field becomes valid
    const error = validate(field, value);
    if (!error) setErrors((prev) => ({ ...prev, [field]: undefined }));
    onChange({ ...plan, [field]: value });
  }

  function handleBlur(field: Field) {
    const error = validate(field, plan[field] as number);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  }

  function inputClass(field: Field) {
    return errors[field] ? "input--error" : "";
  }

  return (
    <section className="card">
      <h2>Tu plan del mes</h2>
      <p className="card-helper">
        Define tu plan para saber cuánto puedes gastar sin alejarte de tu meta.
      </p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="expectedIncome">Ingreso esperado del mes</label>
          <input
            id="expectedIncome"
            type="number"
            className={inputClass("expectedIncome")}
            value={plan.expectedIncome || ""}
            onChange={(e) => handleChange("expectedIncome", e.target.value)}
            onBlur={() => handleBlur("expectedIncome")}
            placeholder="4.500.000"
          />
          {errors.expectedIncome && (
            <p className="field-error">{errors.expectedIncome}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="savingsGoal">Meta de ahorro mensual</label>
          <input
            id="savingsGoal"
            type="number"
            className={inputClass("savingsGoal")}
            value={plan.savingsGoal || ""}
            onChange={(e) => handleChange("savingsGoal", e.target.value)}
            onBlur={() => handleBlur("savingsGoal")}
            placeholder="700.000"
          />
          {errors.savingsGoal && (
            <p className="field-error">{errors.savingsGoal}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="monthlySpendingLimit">Límite de gastos del mes</label>
          <input
            id="monthlySpendingLimit"
            type="number"
            className={inputClass("monthlySpendingLimit")}
            value={plan.monthlySpendingLimit || ""}
            onChange={(e) => handleChange("monthlySpendingLimit", e.target.value)}
            onBlur={() => handleBlur("monthlySpendingLimit")}
            placeholder="3.800.000"
          />
          {errors.monthlySpendingLimit && (
            <p className="field-error">{errors.monthlySpendingLimit}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="hormigaLimit">Límite para gastos hormiga</label>
          <input
            id="hormigaLimit"
            type="number"
            className={inputClass("hormigaLimit")}
            value={plan.hormigaLimit || ""}
            onChange={(e) => handleChange("hormigaLimit", e.target.value)}
            onBlur={() => handleBlur("hormigaLimit")}
            placeholder="250.000"
          />
          {errors.hormigaLimit && (
            <p className="field-error">{errors.hormigaLimit}</p>
          )}
        </div>
      </div>
    </section>
  );
}
