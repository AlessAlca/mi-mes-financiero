# SPEC.md

## 1. Product Goal

Build a frontend-only personal finance app for an average Colombian user with a monthly income below 10,000,000 COP.

The app should help the user manage their monthly money in a simple way by answering one main question:

> Am I spending in a way that allows me to reach my savings goal this month?

The app must help the user:

* Define expected monthly income.
* Define a monthly savings goal.
* Define a monthly spending limit.
* Track daily or weekly expenses.
* Control “gastos hormiga”.
* Understand how much money can still be spent during the month.
* Know if they are on track, at risk, or off track from their monthly goal.

The app should be simple, visual, and easy to update frequently.

---

## 2. Target User

The target user is an average Colombian person who:

* Earns less than 10,000,000 COP per month.
* Wants to save more money.
* Needs better control over monthly spending.
* Wants to reduce small unnecessary expenses, also known as “gastos hormiga”.
* Does not want to use a complex accounting or budgeting tool.
* Needs a fast, simple app to check financial status day by day or week by week.

The user may not be highly technical, so the app must use simple language and avoid financial complexity.

---

## 3. Product Promise

The app should communicate this promise:

> Controla tus gastos del mes, evita que los gastos hormiga se coman tu plata y mantente cerca de tu meta de ahorro.

The app should not feel like an accounting system. It should feel like a personal monthly control dashboard.

---

## 4. MVP Scope

The MVP must include:

1. Monthly financial plan
2. One-page financial dashboard
3. Quick expense registration
4. Gastos hormiga control
5. Spending limit tracking
6. Savings goal tracking
7. Recent expense list
8. Category summary
9. Local persistence using localStorage

The MVP must not include:

* Backend
* Authentication
* Bank integrations
* Investment tracking
* Credit score
* Multi-user accounts
* Multi-currency support
* Complex debt management
* AI financial advice
* PDF export
* Heavy charts
* Complex reports
* Multiple pages or complex navigation

---

## 5. Core User Flow

### First-time user flow

1. User opens the app.

2. User creates their monthly financial plan by entering:

   * Expected monthly income
   * Monthly savings goal
   * Monthly spending limit
   * Monthly “gastos hormiga” limit

3. User sees a one-page dashboard with:

   * Expected income
   * Total spent
   * Remaining money available
   * Projected savings
   * Savings goal progress
   * Spending limit progress
   * Gastos hormiga status
   * Recommended daily spend
   * Overall financial status

4. User starts registering expenses.

---

### Daily or weekly usage flow

1. User opens the app.

2. User quickly checks:

   * How much has been spent
   * How much money remains available
   * Whether they are close to the savings goal
   * Whether gastos hormiga are under control

3. User adds new expenses using the quick expense form.

4. Dashboard updates immediately.

5. User adjusts behavior based on the status message.

---

## 6. Main One-Page Sections

The app must be a one-page experience with these sections in this order:

### 1. Header

Purpose:

Introduce the app and remind the user of the main goal.

Suggested title:

> Mi mes financiero

Suggested subtitle:

> Controla tus gastos, cuida tus gastos hormiga y mantente cerca de tu meta de ahorro.

---

### 2. Monthly Setup Card

Purpose:

Allow the user to define or update their monthly financial plan.

Fields:

* Ingreso esperado del mes
* Meta de ahorro mensual
* Límite de gastos del mes
* Límite para gastos hormiga

Helper text:

> Define tu plan para saber cuánto puedes gastar sin alejarte de tu meta.

Expected behavior:

* User can edit these values.
* Values are saved in localStorage.
* Dashboard calculations update when values change.

---

### 3. Main Financial Status Card

Purpose:

Show the most important financial information at a glance.

Must show:

* Ingreso esperado
* Gastado hasta hoy
* Disponible restante
* Ahorro proyectado
* Gasto diario recomendado
* General financial status

Possible status messages:

On track:

> Vas bien. Si mantienes este ritmo, puedes cumplir tu meta de ahorro.

Warning:

> Ten cuidado. Tu ritmo de gasto está alto para este punto del mes.

Off track:

> Alerta. Con tus gastos actuales podrías no cumplir tu meta de ahorro.

---

### 4. Savings Goal Card

Purpose:

Show whether the user is close to reaching the monthly savings goal.

Must show:

* Meta de ahorro
* Ahorro proyectado
* Difference versus savings goal
* Progress bar

Example copy:

> Te faltan $180.000 para cumplir tu meta de ahorro.

Or:

> Vas $120.000 por encima de tu meta de ahorro.

---

### 5. Spending Limit Card

Purpose:

Show how much of the monthly spending limit has been used.

Must show:

* Límite de gastos del mes
* Total gastado
* Disponible restante
* Percentage of budget used
* Progress bar

Example copy:

> Has usado el 49% de tu límite mensual de gastos.

---

### 6. Gastos Hormiga Card

Purpose:

Make small expenses visible and help the user control them.

Must show:

* Total spent in gastos hormiga
* Monthly hormiga limit
* Difference versus hormiga limit
* Percentage of total spending that comes from gastos hormiga

Example copy:

> Tus gastos hormiga ya representan el 15% de todo lo que has gastado este mes.

If the user exceeds the limit:

> Tus gastos hormiga ya superaron el límite que definiste para este mes.

---

### 7. Quick Expense Form

Purpose:

Allow the user to register expenses in less than 10 seconds.

Fields:

* Amount
* Category
* Optional description
* Date

Button:

> Agregar gasto

Quick amount buttons:

* $5.000
* $10.000
* $20.000
* $50.000

Expected behavior:

* Date defaults to today.
* Description is optional.
* If category is “Gastos hormiga”, expense is automatically marked as hormiga.
* Form clears after adding an expense.
* Dashboard updates immediately.

---

### 8. Recent Expenses List

Purpose:

Show the user their latest expenses.

Must show:

* Last 5 expenses
* Amount
* Category
* Description, if available
* Date

Optional behavior:

* Allow deleting an expense if easy to implement.
* Keep the list simple.

---

### 9. Category Summary

Purpose:

Show where the money is going.

Must show total spending by category.

Categories:

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

The summary can be shown as simple rows with category name and total amount.

No complex charts are required for the MVP.

---

## 7. Data Model

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

Field descriptions:

* `expectedIncome`: Money the user expects to receive during the month.
* `savingsGoal`: Amount the user wants to save during the month.
* `monthlySpendingLimit`: Maximum amount the user can spend during the month.
* `hormigaLimit`: Maximum amount the user wants to spend in gastos hormiga.
* `month`: Current month identifier.

---

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

Field descriptions:

* `id`: Unique expense identifier.
* `amount`: Expense amount in COP.
* `category`: Expense category.
* `description`: Optional description.
* `date`: Expense date.
* `isHormiga`: Indicates whether the expense counts as gasto hormiga.

---

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

### FinancialSummary

```ts
type FinancialSummary = {
  totalSpent: number;
  availableToSpend: number;
  remainingToSpend: number;
  projectedSavings: number;
  savingsGap: number;
  hormigaTotal: number;
  percentageBudgetUsed: number;
  daysRemainingInMonth: number;
  recommendedDailySpend: number;
  status: FinancialStatus;
};
```

---

### FinancialStatus

```ts
type FinancialStatus = "onTrack" | "warning" | "offTrack";
```

---

## 8. Core Calculations

### Available to spend

```ts
availableToSpend = expectedIncome - savingsGoal;
```

This represents how much the user can spend while still reaching the savings goal.

---

### Total spent

```ts
totalSpent = sum of all expenses for the selected month;
```

---

### Remaining to spend

```ts
remainingToSpend = monthlySpendingLimit - totalSpent;
```

---

### Projected savings

```ts
projectedSavings = expectedIncome - totalSpent;
```

---

### Savings gap

```ts
savingsGap = projectedSavings - savingsGoal;
```

If positive, the user is above the savings goal.

If negative, the user is below the savings goal.

---

### Percentage budget used

```ts
percentageBudgetUsed = totalSpent / monthlySpendingLimit;
```

---

### Hormiga total

```ts
hormigaTotal = sum of all expenses where isHormiga is true;
```

---

### Days remaining in month

```ts
daysRemainingInMonth = number of days left in the current month;
```

Include today if it makes the calculation easier and clearer for the user.

---

### Recommended daily spend

```ts
recommendedDailySpend = remainingToSpend / daysRemainingInMonth;
```

If remainingToSpend is negative, recommendedDailySpend should not show a positive amount.

Example copy:

> Ya superaste tu límite de gastos para este mes.

---

## 9. Financial Status Logic

The app should show one of three statuses.

### On Track

Use `onTrack` when:

* Projected savings are greater than or equal to the savings goal.
* Total spending is within the expected pace for the current day of the month.
* Hormiga spending is not close to the hormiga limit.

Message:

> Vas bien. Si mantienes este ritmo, puedes cumplir tu meta de ahorro.

---

### Warning

Use `warning` when:

* Projected savings are still greater than or equal to the savings goal, but the user is close to falling behind.
* Or total spending is above the expected pace for this point in the month.
* Or hormiga spending is close to the hormiga limit.

Message:

> Ten cuidado. Tu ritmo de gasto está alto para este punto del mes.

Suggested thresholds:

* Budget used is above expected monthly pace by more than 10%.
* Hormiga spending is equal to or above 80% of the hormiga limit.
* Savings gap is positive but small.

---

### Off Track

Use `offTrack` when:

* Projected savings are below the savings goal.
* Or total spending is greater than the monthly spending limit.
* Or remainingToSpend is negative.

Message:

> Alerta. Con tus gastos actuales podrías no cumplir tu meta de ahorro.

---

## 10. Validation Rules

### Monthly Plan

* Expected income is required.
* Expected income must be greater than 0.
* Expected income must be less than or equal to 10,000,000 COP.
* Savings goal is required.
* Savings goal must be greater than or equal to 0.
* Monthly spending limit is required.
* Monthly spending limit must be greater than 0.
* Hormiga limit is required.
* Hormiga limit must be greater than or equal to 0.
* Monthly spending limit should ideally not be greater than expected income.
* Savings goal plus monthly spending limit should ideally not exceed expected income, but this can be shown as a warning instead of blocking the user.

### Expense Form

* Amount is required.
* Amount must be greater than 0.
* Category is required.
* Date is required.
* Date defaults to today.
* Description is optional.
* Do not allow negative values.

---

## 11. Local Persistence

Use `localStorage`.

Persist:

* Monthly plan
* Expenses

Suggested keys:

```ts
personal-finance-monthly-plan
personal-finance-expenses
```

Expected behavior:

* Data remains after refreshing the browser.
* User can reset the month.
* User can load demo data.
* No backend is needed.

---

## 12. Currency Formatting

All money values must be shown in Colombian pesos.

Use this formatter:

```ts
new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
```

Expected examples:

* $4.500.000
* $700.000
* $25.000

---

## 13. Demo Data

The app should include an option to load demo data.

Button text:

> Cargar datos de ejemplo

Demo monthly plan:

```ts
{
  expectedIncome: 4500000,
  savingsGoal: 700000,
  monthlySpendingLimit: 3800000,
  hormigaLimit: 250000,
  month: "current-month"
}
```

Demo expenses:

```ts
[
  {
    amount: 320000,
    category: "Mercado",
    description: "Compra de mercado",
    isHormiga: false
  },
  {
    amount: 85000,
    category: "Transporte",
    description: "Transporte semanal",
    isHormiga: false
  },
  {
    amount: 210000,
    category: "Servicios",
    description: "Servicios públicos",
    isHormiga: false
  },
  {
    amount: 65000,
    category: "Comida fuera",
    description: "Almuerzo fuera de casa",
    isHormiga: false
  },
  {
    amount: 8000,
    category: "Gastos hormiga",
    description: "Café",
    isHormiga: true
  },
  {
    amount: 12000,
    category: "Gastos hormiga",
    description: "Mecato",
    isHormiga: true
  },
  {
    amount: 6000,
    category: "Gastos hormiga",
    description: "Antojo",
    isHormiga: true
  },
  {
    amount: 15000,
    category: "Gastos hormiga",
    description: "Domicilio pequeño",
    isHormiga: true
  },
  {
    amount: 45000,
    category: "Otros",
    description: "Compra ocasional",
    isHormiga: false
  }
]
```

---

## 14. Reset Month

The app should include a reset option.

Button text:

> Reiniciar mes

Expected behavior:

* Clear current expenses.
* Keep or reset the monthly plan depending on what is easier for the MVP.
* If easy to implement, ask for browser confirmation before resetting.

Confirmation message:

> ¿Seguro que quieres reiniciar el mes? Se eliminarán los gastos registrados.

---

## 15. UI and UX Requirements

The app must be:

* Mobile-first.
* Clean.
* Friendly.
* Easy to scan.
* Built with cards.
* Clear in Spanish.
* Simple enough for frequent use.

Avoid:

* Complex financial terms.
* Too many categories.
* Heavy charts.
* Confusing navigation.
* Multiple pages.
* Large forms.
* Excessive explanations.

The app should prioritize speed and clarity.

---

## 16. Empty States

If there are no expenses, show:

> Aún no has registrado gastos este mes.

If there is no monthly plan, show helpful default values or ask the user to create one.

If category summary has no data, show:

> Cuando agregues gastos, aquí verás en qué se está yendo tu plata.

---

## 17. Manual Testing Scenarios

Use these scenarios to validate the app.

### Scenario 1: User creates monthly plan

Given the user enters:

* Ingreso esperado: $4.500.000
* Meta de ahorro: $700.000
* Límite de gastos: $3.800.000
* Límite gastos hormiga: $250.000

Then the app should show:

* Available to spend: $3.800.000
* Projected savings before expenses: $4.500.000
* Total spent: $0
* Status should be on track.

---

### Scenario 2: User adds normal expense

Given the user adds:

* Amount: $320.000
* Category: Mercado
* Description: Compra de mercado

Then:

* Total spent increases by $320.000.
* Remaining to spend decreases by $320.000.
* Category summary shows Mercado: $320.000.

---

### Scenario 3: User adds gasto hormiga

Given the user adds:

* Amount: $8.000
* Category: Gastos hormiga
* Description: Café

Then:

* Total spent increases by $8.000.
* Hormiga total increases by $8.000.
* Expense is marked as hormiga.
* Gastos hormiga card updates.

---

### Scenario 4: User exceeds spending limit

Given total expenses exceed the monthly spending limit:

Then:

* Remaining to spend is negative.
* Status should be off track.
* App shows the off track message.

---

### Scenario 5: User refreshes page

Given the user has created a plan and added expenses:

When the browser refreshes:

Then:

* Monthly plan is still available.
* Expenses are still available.
* Dashboard calculations remain correct.

---

## 18. Suggested File Structure

Use this structure if starting from scratch:

```txt
src/
  App.tsx
  main.tsx
  components/
    Header.tsx
    MonthlySetupCard.tsx
    FinancialStatusCard.tsx
    SavingsGoalCard.tsx
    SpendingLimitCard.tsx
    HormigaCard.tsx
    ExpenseForm.tsx
    RecentExpenses.tsx
    CategorySummary.tsx
  lib/
    calculations.ts
    currency.ts
    storage.ts
    dates.ts
  types/
    finance.ts
  data/
    categories.ts
    demoData.ts
  styles/
    app.css
```

This structure can be adjusted if the existing project already has a different convention.

---

## 19. Implementation Order

Build the app in this order:

1. Create project structure.
2. Create types.
3. Create financial calculation utilities.
4. Create localStorage utilities.
5. Create demo data.
6. Build static UI layout.
7. Connect monthly plan state.
8. Connect expense form.
9. Connect dashboard calculations.
10. Add persistence.
11. Add validations.
12. Add final UX polish.
13. Run build/typecheck.
14. Perform manual test scenarios.

---

## 20. Acceptance Criteria

The MVP is complete when:

* User can define a monthly financial plan.
* User can add expenses.
* User can identify gastos hormiga.
* User can see total spent.
* User can see remaining money available.
* User can see projected savings.
* User can see if they are on track, warning, or off track.
* User can see recent expenses.
* User can see spending by category.
* User can load demo data.
* User can reset the month.
* Data persists after refreshing the browser.
* The app works without backend.
* The UI is mobile-friendly.
* All UI copy is in Spanish.
* Money values are displayed in Colombian pesos.
* Build/typecheck runs successfully.
