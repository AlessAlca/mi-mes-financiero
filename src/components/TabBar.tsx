export type Tab =
  | "resumen"
  | "setup"
  | "fijos"
  | "variables"
  | "pasivos"
  | "patrimonio";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumen",    label: "Resumen" },
  { id: "setup",      label: "Setup" },
  { id: "fijos",      label: "Fijos" },
  { id: "variables",  label: "Variables" },
  { id: "pasivos",    label: "Pasivos" },
  { id: "patrimonio", label: "Patrimonio" },
];

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar" aria-label="Secciones de la app">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab-btn${active === t.id ? " tab-btn--active" : ""}`}
          aria-current={active === t.id ? "page" : undefined}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
