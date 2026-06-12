type Props = {
  onLoadDemo: () => void;
  onResetMonth: () => void;
};

export function DataActions({ onLoadDemo, onResetMonth }: Props) {
  return (
    <section className="card">
      <h2>Opciones</h2>
      <div className="data-actions">
        <button type="button" className="btn-action" onClick={onLoadDemo}>
          <div>
            <div className="btn-action-title">Cargar datos de ejemplo</div>
            <div className="btn-action-hint">Ver la app con gastos de demostración</div>
          </div>
          <span className="btn-action-arrow">›</span>
        </button>
        <button type="button" className="btn-action btn-action--danger" onClick={onResetMonth}>
          <div>
            <div className="btn-action-title">Reiniciar mes</div>
            <div className="btn-action-hint">Borrar todos los gastos y empezar de cero</div>
          </div>
          <span className="btn-action-arrow">›</span>
        </button>
      </div>
    </section>
  );
}
