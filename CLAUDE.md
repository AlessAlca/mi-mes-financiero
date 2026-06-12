# CLAUDE.md

## Project Overview

This project is a frontend-only personal finance app for an average Colombian user with a monthly income below 10,000,000 COP.

The app helps users control their monthly finances in a simple one-page experience. The main goal is to help the user understand if they are close to or far from reaching their monthly savings goal.

The app focuses on:

* Monthly income planning
* Monthly savings goal
* Monthly spending limit
* Quick expense tracking
* Control of “gastos hormiga”
* Simple financial status: on track, warning, or off track

This is an MVP. Keep the scope simple.

---

## Product Principles

* The app must be simple enough for a non-technical Colombian user.
* The app should feel like a monthly financial control dashboard, not an accounting system.
* The main question the app should answer is:

> “Am I spending in a way that allows me to reach my savings goal this month?”

* Avoid unnecessary complexity.
* Do not add features unless explicitly requested.

---

## Technical Constraints

* Frontend only.
* No backend.
* No authentication.
* No external APIs.
* Use `localStorage` for data persistence.
* Use Colombian pesos as the currency format.
* UI copy must be in Spanish.
* The app should be mobile-first.
* Keep components small, readable, and easy to maintain.

---

## Preferred Tech Stack

Use the existing project stack if one already exists.

If starting from scratch, prefer:

* React
* Vite
* TypeScript
* Plain CSS or simple utility classes

Do not add heavy dependencies unless clearly needed.

---

## Core User Flow

The user should be able to:

1. Define their monthly financial plan:

   * Expected monthly income
   * Monthly savings goal
   * Monthly spending limit
   * Monthly “gastos hormiga” limit

2. See a one-page financial summary:

   * Expected income
   * Total spent
   * Remaining money available to spend
   * Projected savings
   * Financial status
   * Recommended daily spend

3. Register expenses quickly:

   * Amount
   * Category
   * Optional description
   * Date

4. Track “gastos hormiga”:

   * Total spent in small expenses
   * Limit for “gastos hormiga”
   * Alert if the user is close to or above the limit

5. Review recent expenses and spending by category.

---

## Main One-Page Sections

The app should have these sections in this order:

1. Header
2. Monthly setup card
3. Main financial status card
4. Savings goal card
5. Spending limit card
6. Gastos hormiga card
7. Quick expense form
8. Recent expenses list
9. Category summary

---

## Spanish UI Copy Guidelines

Use clear, friendly Spanish.

Avoid technical or corporate language.

Preferred terms:

* “Mi mes financiero”
* “Ingreso esperado”
* “Meta de ahorro”
* “Límite de gastos”
* “Gastos hormiga”
* “Gastado hasta hoy”
* “Disponible restante”
* “Ahorro proyectado”
* “Vas bien”
* “Ten cuidado”
* “Alerta”

Example main subtitle:

> Controla tus gastos, cuida tus gastos hormiga y mantente cerca de tu meta de ahorro.

---

## Expense Categories

Use only these categories for the MVP:

* Mercado
* Transporte
* Servicios
* Vivienda
* Comida fuera
* Deudas
* Salud
* Entretenimiento
* Gastos hormiga
* Otros

When the category is “Gastos hormiga”, the expense should be treated as a hormiga expense.

---

## Data Model

Use TypeScript types when possible.

### MonthlyPlan

```ts
type MonthlyPlan = {
  expectedIncome: number;
  savingsGoal: number;
  monthlySpendingLimit: number;
  hormigaLimit: number;
  month: string;
};
```

### Expense

```ts
type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  isHormiga: boolean;
};
```

### ExpenseCategory

```ts
type ExpenseCategory =
  | "Mercado"
  | "Transporte"
  | "Servicios"
  | "Vivienda"
  | "Comida fuera"
  | "Deudas"
  | "Salud"
  | "Entretenimiento"
  | "Gastos hormiga"
  | "Otros";
```

---

## Core Financial Calculations

Use these formulas:

```ts
availableToSpend = expectedIncome - savingsGoal;
```

```ts
totalSpent = sum of all expenses for the selected month;
```

```ts
remainingToSpend = monthlySpendingLimit - totalSpent;
```

```ts
projectedSavings = expectedIncome - totalSpent;
```

```ts
savingsGap = projectedSavings - savingsGoal;
```

```ts
percentageBudgetUsed = totalSpent / monthlySpendingLimit;
```

```ts
recommendedDailySpend = remainingToSpend / daysRemainingInMonth;
```

```ts
hormigaTotal = sum of all expenses where isHormiga is true;
```

---

## Financial Status Rules

The app should show one of three statuses:

### On Track

Use when:

* Projected savings are greater than or equal to the savings goal.
* Total spending is not above the expected spending pace.
* Hormiga spending is under control.

Message:

> Vas bien. Si mantienes este ritmo, puedes cumplir tu meta de ahorro.

### Warning

Use when:

* The user is close to exceeding the expected spending pace.
* Or hormiga spending is close to the hormiga limit.
* But the user has not fully failed the savings goal yet.

Message:

> Ten cuidado. Tu ritmo de gasto está alto para este punto del mes.

### Off Track

Use when:

* Projected savings are below the savings goal.
* Or the monthly spending limit has been exceeded.

Message:

> Alerta. Con tus gastos actuales podrías no cumplir tu meta de ahorro.

---

## Validation Rules

* Expected income must be greater than 0.
* Expected income must be less than or equal to 10,000,000 COP.
* Savings goal must be greater than or equal to 0.
* Monthly spending limit must be greater than 0.
* Hormiga limit must be greater than or equal to 0.
* Expense amount must be greater than 0.
* Expense date should default to today.
* Expense description is optional.
* Do not allow negative values.

Use friendly validation messages in Spanish.

---

## Currency Formatting

All money values must be displayed in Colombian pesos.

Use this format:

```ts
new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
```

Examples:

* $4.500.000
* $700.000
* $25.000

---

## localStorage Rules

Persist:

* Monthly plan
* Expenses

Suggested keys:

```ts
personal-finance-monthly-plan
personal-finance-expenses
```

The app should keep working after refreshing the browser.

---

## Demo Data

When demo data is needed, use realistic Colombian values.

Example monthly plan:

```ts
{
  expectedIncome: 4500000,
  savingsGoal: 700000,
  monthlySpendingLimit: 3800000,
  hormigaLimit: 250000,
  month: "current-month"
}
```

Example expenses:

* Mercado: 320000
* Transporte: 85000
* Servicios: 210000
* Comida fuera: 65000
* Gastos hormiga: 8000
* Gastos hormiga: 12000
* Gastos hormiga: 6000
* Gastos hormiga: 15000
* Otros: 45000

---

## Design Guidelines

* Mobile-first.
* Use a clean one-page dashboard.
* Use cards to separate sections.
* Keep the interface visually calm and easy to scan.
* Avoid too many colors.
* Use clear status indicators for:

  * On track
  * Warning
  * Off track

Do not add complex charts unless requested. Simple progress bars are enough for the MVP.

---

## Development Rules

Before making changes:

1. Read `SPEC.md` if it exists.
2. Follow this `CLAUDE.md` file.
3. Keep the MVP scope focused.

After making changes:

1. Run build or typecheck if available.
2. Summarize only:

   * Files changed
   * What was implemented
   * Any issues found
   * How to test manually

Avoid long explanations unless requested.

---

## Out of Scope for MVP

Do not implement these features unless explicitly requested:

* Bank integrations
* Authentication
* Backend
* Multi-user accounts
* Investment tracking
* Credit score
* Complex debt management
* Recurring transactions
* PDF exports
* AI financial advice
* Multi-currency support
* Complex reports
* Charts with heavy dependencies
* Multiple pages or complex navigation

---

## Main Product Promise

The app should help the user understand:

> “How much can I still spend this month without moving away from my savings goal?”

In Spanish, the product promise can be expressed as:

> Controla tus gastos del mes, evita que los gastos hormiga se coman tu plata y mantente cerca de tu meta de ahorro.
