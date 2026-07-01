import { useState } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./components/AuthPage";
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
import { TabBar } from "./components/TabBar";
import type { Tab } from "./components/TabBar";
import { MonthlySetup } from "./components/MonthlySetup";
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

// ── Init helpers ──────────────────────────────────────────────────────────────

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
  const { session, loading: authLoading } = useAuth();

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

  // ── Auth guards ───────────────────────────────────────────────────────────

  // While Supabase resolves the session, show a minimal loading screen
  // so the user never sees a flash of the login page.
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-hero">
          <h1 className="auth-app-name">Mi mes financiero</h1>
        </div>
      </div>
    );
  }

  if (!session) return <AuthPage />;

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

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
    setProfile(d.profile);                    saveProfile(d.profile);
    setFixedExpenses(d.fixedExpenses);        saveFixedExpenses(d.fixedExpenses);
    setVariableExpenses(d.variableExpenses);  saveVariableExpenses(d.variableExpenses);
    setLiabilities(d.liabilities);           saveLiabilities(d.liabilities);
    setAssets(d.assets);                      saveAssets(d.assets);
  }

  function handleResetMonth() {
    if (
      !window.confirm(
        "¿Seguro que quieres reiniciar el mes?\n\nSe borrarán todos tus gastos variables. Tu plan, fijos, pasivos y activos se conservan."
      )
    ) return;
    const fresh: MonthlyProfile = { ...profile, month: currentMonth() };
    setProfile(fresh);         saveProfile(fresh);
    setVariableExpenses([]);   saveVariableExpenses([]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <Header
        profile={profile}
        summary={summary}
        hasProfile={hasProfile}
        userEmail={session.user.email ?? ""}
        onAddExpense={() => setActiveTab("variables")}
        onSignOut={handleSignOut}
      />

      <main className="main-content">
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* ── Tab: Resumen ────────────────────────────────────────────────── */}
        {activeTab === "resumen" && (
          <>
            {hasProfile ? (
              <SpendingLimit profile={profile} summary={summary} />
            ) : (
              <div className="card">
                <p className="card-empty">
                  Configura tu perfil en la pestaña "Setup" para ver tu resumen mensual.
                </p>
              </div>
            )}
            <DataActions onLoadDemo={handleLoadDemo} onResetMonth={handleResetMonth} />
          </>
        )}

        {/* ── Tab: Setup ──────────────────────────────────────────────────── */}
        {activeTab === "setup" && (
          <MonthlySetup profile={profile} onChange={handleProfileChange} />
        )}

        {/* ── Tab: Fijos (Gastos fijos) ────────────────────────────────────── */}
        {activeTab === "fijos" && (
          <FixedExpensesCard
            fixedExpenses={fixedExpenses}
            onAdd={handleAddFixed}
            onDelete={handleDeleteFixed}
          />
        )}

        {/* ── Tab: Variables (Gastos variables) ────────────────────────────── */}
        {activeTab === "variables" && (
          <>
            <ExpenseForm onAdd={handleAddVariable} />
            <GastosHormiga summary={summary} />
            <RecentExpenses
              expenses={variableExpenses}
              onDelete={handleDeleteVariable}
              title="Movimientos del mes"
            />
            <CategorySummary expenses={variableExpenses} />
          </>
        )}

        {/* ── Tab: Pasivos ─────────────────────────────────────────────────── */}
        {activeTab === "pasivos" && (
          <LiabilitiesCard
            liabilities={liabilities}
            onAdd={handleAddLiability}
            onDelete={handleDeleteLiability}
          />
        )}

        {/* ── Tab: Patrimonio ──────────────────────────────────────────────── */}
        {activeTab === "patrimonio" && (
          <>
            <AssetsCard
              assets={assets}
              onAdd={handleAddAsset}
              onDelete={handleDeleteAsset}
            />
            <NetWorthCard summary={summary} />
          </>
        )}
      </main>
    </div>
  );
}
