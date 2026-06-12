import { useState } from "react";
import type { ExpenseCategory, VariableExpense } from "../types";
import { EXPENSE_CATEGORIES } from "../types";
import { formatCOP, today } from "../lib/formatting";

type Props = {
  onAdd: (expense: VariableExpense) => void;
};

const QUICK_AMOUNTS = [5_000, 10_000, 20_000, 50_000];

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Otros");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today());
  const [amountError, setAmountError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0 || isNaN(num)) {
      setAmountError("Ingresa un valor mayor a $ 0");
      return;
    }
    setAmountError("");
    onAdd({
      id: newId(),
      amount: num,
      category,
      description: description.trim() || undefined,
      date,
      isHormiga: category === "Gastos hormiga",
    });
    setAmount("");
    setDescription("");
    setDate(today());
  }

  function handleAmountChange(value: string) {
    setAmount(value);
    if (amountError && Number(value) > 0) setAmountError("");
  }

  return (
    <section id="expense-form-section" className="card">
      <h2>Agregar gasto</h2>
      <div className="quick-amounts">
        {QUICK_AMOUNTS.map((q) => (
          <button
            key={q}
            type="button"
            className={`quick-btn${amount === String(q) ? " quick-btn--active" : ""}`}
            onClick={() => {
              setAmount(String(q));
              setAmountError("");
            }}
          >
            {formatCOP(q)}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="expense-form" noValidate>
        <div className="field">
          <label htmlFor="expense-amount">Valor</label>
          <input
            id="expense-amount"
            type="number"
            className={amountError ? "input--error" : ""}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Ingresa el valor"
          />
          {amountError && <p className="field-error">{amountError}</p>}
        </div>

        <div className="field">
          <label htmlFor="expense-category">Categoría</label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="expense-desc">
            Descripción <span className="label-optional">(opcional)</span>
          </label>
          <input
            id="expense-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Tinto de la mañana"
          />
        </div>

        <div className="field">
          <label htmlFor="expense-date">Fecha</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Agregar gasto
        </button>
      </form>
    </section>
  );
}
