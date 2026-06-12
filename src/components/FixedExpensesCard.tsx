import { useState } from "react";
import type { FixedExpense } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  fixedExpenses: FixedExpense[];
  onAdd: (expense: FixedExpense) => void;
  onDelete: (id: string) => void;
};

function newId(): string {
  return `fe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function FixedExpensesCard({ fixedExpenses, onAdd, onDelete }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const total = fixedExpenses.reduce((s, e) => s + e.monthlyAmount, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim()) { setError("Ingresa el nombre del gasto fijo"); return; }
    if (!num || num <= 0) { setError("Ingresa un valor mayor a $ 0"); return; }
    setError("");
    onAdd({ id: newId(), name: name.trim(), monthlyAmount: num });
    setName("");
    setAmount("");
  }

  return (
    <section className="card">
      <h2>Gastos fijos mensuales</h2>
      <p className="card-helper">
        Gastos que pagas cada mes sin importar lo que hagas: arriendo, servicios, suscripciones.
      </p>

      {fixedExpenses.length > 0 && (
        <ul className="entity-list">
          {fixedExpenses.map((fe) => (
            <li key={fe.id} className="entity-item">
              <span className="entity-name">{fe.name}</span>
              <span className="entity-amount">{formatCOP(fe.monthlyAmount)}</span>
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(fe.id)}
                aria-label="Eliminar"
              >×</button>
            </li>
          ))}
          <li className="entity-item entity-item--total">
            <span className="entity-name">Total fijos</span>
            <span className="entity-amount">{formatCOP(total)}</span>
          </li>
        </ul>
      )}

      <form onSubmit={handleAdd} className="entity-form" noValidate>
        <div className="entity-form-row">
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="fe-name">Nombre</label>
            <input
              id="fe-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Arriendo"
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="fe-amount">Valor mensual</label>
            <input
              id="fe-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.200.000"
            />
          </div>
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-secondary-add">+ Agregar gasto fijo</button>
      </form>
    </section>
  );
}
