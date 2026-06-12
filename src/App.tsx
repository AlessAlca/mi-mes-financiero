import { useState } from "react";
import type { Expense, MonthlyPlan } from "./types";
import { loadExpenses, loadPlan, saveExpenses, savePlan } from "./lib/storage";
import { calculateSummary } from "./lib/calculations";
import { currentMonth } from "./lib/formatting";
import { createDemoData, DEMO_EXPENSES, DEMO_PLAN } from "./data/demo";
import { Header } from "./components/Header";
import { CollapsiblePlan } from "./components/CollapsiblePlan";
import { TabBar } from "./components/TabBar";
import type { Tab } from "./components/TabBar";
import { StatusTip } from "./components/StatusTip";
import { SavingsGoal } from "./components/SavingsGoal";
import { SpendingLimit } from "./components/SpendingLimit";
import { GastosHormiga } from "./components/GastosHormiga";
import { ExpenseForm } from "./components/ExpenseForm";
import { RecentExpenses } from "./components/RecentExpenses";
import { CategorySummary } from "./components/CategorySummary";
import { DataActions } from "./components/DataActions";

function initPlan(): MonthlyPlan {
  return loadPlan() ?? DEMO_PLAN;
}

function initExpenses(): Expense[] {
  const stored = loadExpenses();
  return stored.length > 0 ? stored : DEMO_EXPENSES;
}

export function App() {
  const [plan, setPlan] = useState<MonthlyPlan>(initPlan);
  const [expenses, setExpenses] = useState<Expense[]>(initExpenses);
  const [activeTab, setActiveTab] = useState<Tab>("resumen");

  const summary = calculateSummary(plan, expenses);
  const hasPlan = plan.expectedIncome > 0;

  function handlePlanChange(updated: MonthlyPlan) {
    setPlan(updated);
    savePlan(updated);
  }

  function handleAddExpense(expense: Expense) {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  }

  function handleDeleteExpense(id: string) {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  }

  function handleLoadDemo() {
    const { plan: demoPlan, expenses: demoExpenses } = createDemoData();
    setPlan(demoPlan);
    setExpenses(demoExpenses);
    savePlan(demoPlan);
    saveExpenses(demoExpenses);
  }

  function handleResetMonth() {
    if (
      !window.confirm(
        "¿Seguro que quieres reiniciar el mes?\n\nSe borrarán todos tus gastos registrados. Tu plan mensual se conserva."
      )
    ) return;
    const fresh: MonthlyPlan = { ...plan, month: currentMonth() };
    setPlan(fresh);
    setExpenses([]);
    savePlan(fresh);
    saveExpenses([]);
  }

  return (
    <div className="app">
      <Header
        plan={plan}
        summary={summary}
        hasPlan={hasPlan}
        onAddExpense={() => setActiveTab("gasto")}
      />

      <main className="main-content">
        <CollapsiblePlan plan={plan} hasPlan={hasPlan} onChange={handlePlanChange} />

        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* ── Tab: Resumen ── */}
        {activeTab === "resumen" && (
          <>
            {hasPlan ? (
              <>
                <StatusTip status={summary.status} />
                <SavingsGoal plan={plan} summary={summary} />
                <SpendingLimit plan={plan} summary={summary} />
                <GastosHormiga plan={plan} summary={summary} />
              </>
            ) : (
              <div className="card">
                <p className="card-empty">
                  Define tu plan mensual arriba para ver el resumen de tu mes.
                </p>
              </div>
            )}
            <DataActions onLoadDemo={handleLoadDemo} onResetMonth={handleResetMonth} />
          </>
        )}

        {/* ── Tab: Agregar gasto ── */}
        {activeTab === "gasto" && (
          <ExpenseForm onAdd={handleAddExpense} />
        )}

        {/* ── Tab: Movimientos ── */}
        {activeTab === "movimientos" && (
          <RecentExpenses
            expenses={expenses}
            onDelete={handleDeleteExpense}
            title="Movimientos del mes"
          />
        )}

        {/* ── Tab: Categorías ── */}
        {activeTab === "categorias" && (
          <CategorySummary expenses={expenses} />
        )}
      </main>
    </div>
  );
}
