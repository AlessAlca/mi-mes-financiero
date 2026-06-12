import type { VariableExpense } from "../types";
import { formatCOP, formatDate } from "../lib/formatting";

type Props = {
  expenses: VariableExpense[];
  onDelete: (id: string) => void;
  limit?: number;
  title?: string;
};

export function RecentExpenses({
  expenses,
  onDelete,
  limit,
  title = "Últimos gastos",
}: Props) {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));
  const visible = limit !== undefined ? sorted.slice(0, limit) : sorted;

  if (visible.length === 0) {
    return (
      <section className="card">
        <h2>{title}</h2>
        <p className="card-empty">Aún no has registrado gastos este mes.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>{title}</h2>
      <ul className="expense-list">
        {visible.map((e) => (
          <li key={e.id} className="expense-item">
            <div className="expense-info">
              <div className="expense-top">
                <span className="expense-category">{e.category}</span>
                {e.isHormiga && <span className="expense-tag">hormiga</span>}
              </div>
              {e.description && <span className="expense-desc">{e.description}</span>}
              <span className="expense-date">{formatDate(e.date)}</span>
            </div>
            <div className="expense-right">
              <span className="expense-amount">{formatCOP(e.amount)}</span>
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(e.id)}
                aria-label="Eliminar gasto"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
