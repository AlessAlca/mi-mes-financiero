import { useState } from "react";
import type { Asset, AssetType } from "../types";
import { ASSET_TYPE_LABELS, ASSET_TYPES } from "../types";
import { formatCOP } from "../lib/formatting";

type Props = {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
  onDelete: (id: string) => void;
};

function newId(): string {
  return `as-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function AssetsCard({ assets, onAdd, onDelete }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("ahorro");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const total = assets.reduce((s, a) => s + a.value, 0);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(value);
    if (!name.trim()) { setError("Ingresa el nombre del activo"); return; }
    if (!num || num <= 0) { setError("Ingresa un valor mayor a $ 0"); return; }
    setError("");
    onAdd({ id: newId(), name: name.trim(), type, value: num });
    setName("");
    setValue("");
    setType("ahorro");
  }

  return (
    <section className="card">
      <h2>Activos</h2>
      <p className="card-helper">
        Todo lo que tienes y que tiene valor: ahorros, inversiones, inmuebles, vehículos.
      </p>

      {assets.length > 0 && (
        <ul className="entity-list">
          {assets.map((a) => (
            <li key={a.id} className="entity-item">
              <div className="entity-name-group">
                <span className="entity-name">{a.name}</span>
                <span className="entity-type-tag">{ASSET_TYPE_LABELS[a.type]}</span>
              </div>
              <span className="entity-amount positive">{formatCOP(a.value)}</span>
              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(a.id)}
                aria-label="Eliminar"
              >×</button>
            </li>
          ))}
          <li className="entity-item entity-item--total">
            <span className="entity-name">Total activos</span>
            <span className="entity-amount positive">{formatCOP(total)}</span>
          </li>
        </ul>
      )}

      <form onSubmit={handleAdd} className="entity-form" noValidate>
        <div className="entity-form-row">
          <div className="field" style={{ flex: 2 }}>
            <label htmlFor="as-name">Nombre</label>
            <input
              id="as-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cuenta de ahorros"
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="as-type">Tipo</label>
            <select
              id="as-type"
              value={type}
              onChange={(e) => setType(e.target.value as AssetType)}
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>{ASSET_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="as-value">Valor actual</label>
          <input
            id="as-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="3.500.000"
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-secondary-add">+ Agregar activo</button>
      </form>
    </section>
  );
}
