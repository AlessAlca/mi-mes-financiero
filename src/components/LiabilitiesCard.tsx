import { useState } from "react";
import type { Liability } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  liabilities: Liability[];
  onAdd: (liability: Liability) => void;
  onDelete: (id: string) => void;
};

function newId(): string {
  return `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function LiabilitiesCard({ liabilities, onAdd, onDelete }: Props) {
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [error, setError] = useState("");

  const totalDebt = liabilities.reduce((s, l) => s + l.totalAmount, 0);
  const totalPayments = liabilities.reduce((s, l) => s + l.monthlyPayment, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const total = Number(totalAmount);
    const monthly = Number(monthlyPayment);
    if (!name.trim()) { setError("Ingresa el nombre de la deuda"); return; }
    if (!total || total <= 0) { setError("Ingresa el saldo total de la deuda"); return; }
    if (!monthly || monthly <= 0) { setError("Ingresa la cuota mensual"); return; }
    setError("");
    onAdd({ id: newId(), name: name.trim(), totalAmount: total, monthlyPayment: monthly });
    setName("");
    setTotalAmount("");
    setMonthlyPayment("");
  }

  return (
    <section className="card">
      <h2>Deudas y obligaciones</h2>
      <p className="card-helper">
        El saldo total afecta tu patrimonio. La cuota mensual afecta tu flujo de caja.
      </p>

      {liabilities.length > 0 && (
        <ul className="entity-list">
          {liabilities.map((l) => (
            <li key={l.id} className="entity-item entity-item--two-lines">
              <div className="entity-item-main">
                <span className="entity-name">{l.name}</span>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => onDelete(l.id)}
                  aria-label="Eliminar"
                >×</button>
              </div>
              <div className="entity-item-sub">
                <span>Saldo: <strong>{formatCOP(l.totalAmount)}</strong></span>
                <span>Cuota: <strong>{formatCOP(l.monthlyPayment)}</strong>/mes</span>
              </div>
            </li>
          ))}
          <li className="entity-item entity-item--total">
            <span className="entity-name">Saldo total deudas</span>
            <span className="entity-amount negative">{formatCOP(totalDebt)}</span>
          </li>
          <li className="entity-item entity-item--total">
            <span className="entity-name">Total cuotas/mes</span>
            <span className="entity-amount negative">{formatCOP(totalPayments)}</span>
          </li>
        </ul>
      )}

      <form onSubmit={handleAdd} className="entity-form" noValidate>
        <div className="field">
          <label htmlFor="li-name">Nombre de la deuda</label>
          <input
            id="li-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Crédito vehículo"
          />
        </div>
        <div className="entity-form-row">
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="li-total">Saldo total</label>
            <input
              id="li-total"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="15.000.000"
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="li-payment">Cuota mensual</label>
            <input
              id="li-payment"
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              placeholder="650.000"
            />
          </div>
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-secondary-add">+ Agregar deuda</button>
      </form>
    </section>
  );
}
