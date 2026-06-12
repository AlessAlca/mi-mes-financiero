import { useState } from "react";
import type { Asset, FixedExpense, Liability, MonthlyProfile, VariableExpense } from "./types";
import {
  loadProfile, saveProfile,
  loadFixedExpenses, saveFixedExpenses,
  loadVariableExpenses, saveVariableExpenses,
  loadLiabilities, saveLiabilities,
  loadAssets, saveAssets,
} from "./lib/storage";
import { calculateSummary } from "./lib/calculations";
import { currentMonth } from "./lib/formatting";
import {
  createDemoData,
  DEMO_ASSETS,
  DEMO_FIXED_EXPENSES,
  DEMO_LIABILITIES,
  DEMO_PROFILE,
  DEMO_VARIABLE_EXPENSES,
} from "./data/demo";
import { Header } from "./components/Header";
import { CollapsiblePlan } from "./components/CollapsiblePlan";
import { TabBar } from "./components/TabBar";
import type { Tab } from "./components/TabBar";
import { StatusTip } from "./components/StatusTip";
import { SavingsGoal } from "./components/SavingsGoal";
import { SpendingLimit } from "./components/SpendingLimit";
import { GastosHormiga } from "./components/GastosHormiga";
import { NetWorthCard } from "./components/NetWorthCard";
import { ExpenseForm } from "./components/ExpenseForm";
import { RecentExpenses } from "./components/RecentExpenses";
import { CategorySummary } from "./components/CategorySummary";
import { FixedExpensesCard } from "./components/FixedExpensesCard";
import { LiabilitiesCard } from "./components/LiabilitiesCard";
import { AssetsCard } from "./components/AssetsCard";
import { DataActions } from "./components/DataActions";

// ── Init helpers ─────────────────────────────────────────────────────────────

function initProfile(): MonthlyProfile {
  return loadProfile() ?? DEMO_PROFILE;
}
function initFixed(): FixedExpense[] {
  const s = loadFixedExpenses();
  return s.length > 0 ? s : DEMO_FIXED_EXPENSES;
}
function initVariable(): VariableExpense[] {
  const s = loadVariableExpenses();
  return s.length > 0 ? s : DEMO_VARIABLE_EXPENSES;
}
function initLiabilities(): Liability[] {
  const s = loadLiabilities();
  return s.length > 0 ? s : DEMO_LIABILITIES;
}
function initAssets(): Asset[] {
  const s = loadAssets();
  return s.length > 0 ? s : DEMO_ASSETS;
}

// ── App ───────────────────────────────────────────────────────────────────────

export function App() {
  const [profile,          setProfile]         = useState<MonthlyProfile>(initProfile);
  const [fixedExpenses,    setFixedExpenses]    = useState<FixedExpense[]>(initFixed);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>(initVariable);
  const [liabilities,      setLiabilities]      = useState<Liability[]>(initLiabilities);
  const [assets,           setAssets]           = useState<Asset[]>(initAssets);
  const [activeTab,        setActiveTab]        = useState<Tab>("resumen");

  const summary = calculateSummary(
    profile, fixedExpenses, variableExpenses, liabilities, assets
  );
  const hasProfile = profile.monthlyIncome > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleProfileChange(p: MonthlyProfile) {
    setProfile(p); saveProfile(p);
  }

  function handleAddVariable(e: VariableExpense) {
    const updated = [e, ...variableExpenses];
    setVariableExpenses(updated); saveVariableExpenses(updated);
  }
  function handleDeleteVariable(id: string) {
    const updated = variableExpenses.filter((e) => e.id !== id);
    setVariableExpenses(updated); saveVariableExpenses(updated);
  }

  function handleAddFixed(e: FixedExpense) {
    const updated = [...fixedExpenses, e];
    setFixedExpenses(updated); saveFixedExpenses(updated);
  }
  function handleDeleteFixed(id: string) {
    const updated = fixedExpenses.filter((e) => e.id !== id);
    setFixedExpenses(updated); saveFixedExpenses(updated);
  }

  function handleAddLiability(l: Liability) {
    const updated = [...liabilities, l];
    setLiabilities(updated); saveLiabilities(updated);
  }
  function handleDeleteLiability(id: string) {
    const updated = liabilities.filter((l) => l.id !== id);
    setLiabilities(updated); saveLiabilities(updated);
  }

  function handleAddAsset(a: Asset) {
    const updated = [...assets, a];
    setAssets(updated); saveAssets(updated);
  }
  function handleDeleteAsset(id: string) {
    const updated = assets.filter((a) => a.id !== id);
    setAssets(updated); saveAssets(updated);
  }

  function handleLoadDemo() {
    const d = createDemoData();
    setProfile(d.profile);        saveProfile(d.profile);
    setFixedExpenses(d.fixedExpenses);       saveFixedExpenses(d.fixedExpenses);
    setVariableExpenses(d.variableExpenses); saveVariableExpenses(d.variableExpenses);
    setLiabilities(d.liabilities);          saveLiabilities(d.liabilities);
    setAssets(d.assets);                    saveAssets(d.assets);
  }

  function handleResetMonth() {
    if (
      !window.confirm(
        "¿Seguro que quieres reiniciar el mes?\n\nSe borrarán todos tus gastos variables. Tu plan, fijos, deudas y activos se conservan."
      )
    ) return;
    const fresh: MonthlyProfile = { ...profile, month: currentMonth() };
    setProfile(fresh);     saveProfile(fresh);
    setVariableExpenses([]); saveVariableExpenses([]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <Header
        profile={profile}
        summary={summary}
        hasProfile={hasProfile}
        onAddExpense={() => setActiveTab("gastos")}
      />

      <main className="main-content">
        <CollapsiblePlan
          profile={profile}
          hasProfile={hasProfile}
          onChange={handleProfileChange}
        />

        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* ── Resumen ─────────────────────────────────────────────────────── */}
        {activeTab === "resumen" && (
          <>
            {hasProfile ? (
              <>
                <StatusTip status={summary.status} />
                <SpendingLimit profile={profile} summary={summary} />
                <SavingsGoal profile={profile} summary={summary} />
                <GastosHormiga summary={summary} />
                <NetWorthCard summary={summary} />
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

        {/* ── Gastos ──────────────────────────────────────────────────────── */}
        {activeTab === "gastos" && (
          <>
            <ExpenseForm onAdd={handleAddVariable} />
            <RecentExpenses
              expenses={variableExpenses}
              onDelete={handleDeleteVariable}
              title="Movimientos del mes"
            />
            <CategorySummary expenses={variableExpenses} />
          </>
        )}

        {/* ── Compromisos ─────────────────────────────────────────────────── */}
        {activeTab === "compromisos" && (
          <>
            <FixedExpensesCard
              fixedExpenses={fixedExpenses}
              onAdd={handleAddFixed}
              onDelete={handleDeleteFixed}
            />
            <LiabilitiesCard
              liabilities={liabilities}
              onAdd={handleAddLiability}
              onDelete={handleDeleteLiability}
            />
          </>
        )}

        {/* ── Patrimonio ──────────────────────────────────────────────────── */}
        {activeTab === "patrimonio" && (
          <>
            <AssetsCard
              assets={assets}
              onAdd={handleAddAsset}
              onDelete={handleDeleteAsset}
            />
            <LiabilitiesCard
              liabilities={liabilities}
              onAdd={handleAddLiability}
              onDelete={handleDeleteLiability}
            />
            <NetWorthCard summary={summary} />
          </>
        )}
      </main>
    </div>
  );
}
