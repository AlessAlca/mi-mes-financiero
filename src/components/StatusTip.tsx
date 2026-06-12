import type { FinancialStatus } from "../types";

const TIP: Record<FinancialStatus, string> = {
  onTrack:  "Vas bien este mes. Sigue así y llegarás a tu meta de ahorro.",
  warning:  "Tus gastos están subiendo. Intenta reducir los gastos no esenciales en lo que queda del mes.",
  offTrack: "Necesitas reducir gastos para cumplir tu meta. Revisa qué categorías te están costando más.",
};

type Props = { status: FinancialStatus };

export function StatusTip({ status }: Props) {
  return (
    <div className={`status-tip status-tip--${status}`}>
      {TIP[status]}
    </div>
  );
}
