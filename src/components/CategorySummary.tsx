import type { Expense } from "../types";
import { EXPENSE_CATEGORIES } from "../types";
import { formatCOP } from "../lib/formatting";
import { spendingByCategory } from "../lib/calculations";

type Props = {
  expenses: Expense[];
};

export function CategorySummary({ expenses }: Props) {
  const byCategory = spendingByCategory(expenses);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const rows = EXPENSE_CATEGORIES
    .filter((c) => (byCategory[c] ?? 0) > 0)
    .sort((a, b) => (byCategory[b] ?? 0) - (byCategory[a] ?? 0));

  if (rows.length === 0) {
    return (
      <section className="card">
        <h2>Gastos por categoría</h2>
        <p className="card-empty">Agrega un gasto para ver el desglose por categoría.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Gastos por categoría</h2>
      <ul className="category-list">
        {rows.map((c) => {
          const amount = byCategory[c] ?? 0;
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
          return (
            <li key={c} className="category-item">
              <span className="category-name">{c}</span>
              <div className="category-bar-wrap">
                <div className="category-bar" style={{ width: `${pct}%` }} />
              </div>
              <span className="category-amount">{formatCOP(amount)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
