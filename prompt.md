# HRIS Next.js Frontend Architecture

This document provides a **complete overview of the HRIS frontend** using **Next.js**, including pages, components, and their hierarchy for easy understanding and development.

---

## 1. Project Structure

```
/hris-web
├─ /public # Static assets (images, logos, PDFs)
├─ /components # Reusable UI components
│ ├─ Button.tsx
│ ├─ Input.tsx
│ ├─ Modal.tsx
│ ├─ Table.tsx
│ ├─ Card.tsx
│ ├─ Charts.tsx
│ └─ Notification.tsx
├─ /layouts # Layouts for pages
│ ├─ DashboardLayout.tsx
│ └─ AuthLayout.tsx
├─ /pages
│ ├─ _app.tsx # Next.js wrapper for providers, state, global CSS
│ ├─ _document.tsx # HTML structure
│ ├─ index.tsx # Landing / Dashboard redirect
│ ├─ login.tsx
│ ├─ password-reset.tsx
│ ├─ dashboard.tsx
│ ├─ employees
│ │ ├─ index.tsx # Employee list
│ │ └─ [id].tsx # Employee details
│ ├─ attendance
│ │ ├─ index.tsx # Attendance list
│ │ └─ checkin.tsx # Check-in/out
│ ├─ leave
│ │ ├─ index.tsx # Leave dashboard
│ │ ├─ apply.tsx # Apply leave
│ │ └─ approvals.tsx # Manager approvals
│ ├─ payroll
│ │ ├─ index.tsx # Payroll list
│ │ └─ [id].tsx # Payroll details
│ ├─ reports
│ │ ├─ index.tsx # Reports dashboard
│ │ └─ custom.tsx # Custom reports
│ ├─ profile.tsx
│ └─ settings.tsx
├─ /services # API service layer
│ ├─ auth.ts
│ ├─ employees.ts
│ ├─ attendance.ts
│ ├─ leave.ts
│ ├─ payroll.ts
│ ├─ reports.ts
│ └─ notifications.ts
├─ /store # Global state (Zustand / Redux)
│ ├─ userStore.ts
│ ├─ employeeStore.ts
│ ├─ attendanceStore.ts
│ ├─ leaveStore.ts
│ ├─ payrollStore.ts
│ └─ reportStore.ts
├─ /utils # Helpers & constants
│ ├─ validation.ts
│ ├─ constants.ts
│ ├─ apiHandler.ts
│ └─ notifications.ts
├─ /styles # Global & component CSS (or Tailwind config)
│ ├─ globals.css
│ └─ components.css
└─ next.config.js
```

---

## 2. Pages Overview

| Page              | Route                 | Purpose                | Layout          | Components                        |
| ----------------- | --------------------- | ---------------------- | --------------- | --------------------------------- |
| Login             | `/login`              | User login             | AuthLayout      | LoginForm, Button, ErrorMessage   |
| Password Reset    | `/password-reset`     | Reset password         | AuthLayout      | ResetForm, Button, Toast          |
| Dashboard         | `/dashboard`          | Overview metrics       | DashboardLayout | Card, Chart, WidgetCard           |
| Employees List    | `/employees`          | Employee CRUD list     | DashboardLayout | Table, Filters, Pagination, Modal |
| Employee Details  | `/employees/[id]`     | View & edit employee   | DashboardLayout | Tabs, Forms, Buttons              |
| Attendance List   | `/attendance`         | Daily attendance       | DashboardLayout | Table, Filters, Charts            |
| Check-in/out      | `/attendance/checkin` | Employee check-in/out  | DashboardLayout | Button, GPSIntegration, Toast     |
| Leave Dashboard   | `/leave`              | Overview of leaves     | DashboardLayout | InfoCard, Charts                  |
| Apply Leave       | `/leave/apply`        | Employee leave request | DashboardLayout | Form, DatePicker, Button          |
| Approvals         | `/leave/approvals`    | Manager/HR approvals   | DashboardLayout | Table, Actions                    |
| Payroll List      | `/payroll`            | Payroll cycles         | DashboardLayout | Table, Filters                    |
| Payroll Details   | `/payroll/[id]`       | Salary breakdown       | DashboardLayout | Table, Forms, ExportButton        |
| Reports Dashboard | `/reports`            | Reports overview       | DashboardLayout | Charts, Cards                     |
| Custom Reports    | `/reports/custom`     | Build custom reports   | DashboardLayout | Filters, Table, ExportButton      |
| Profile           | `/profile`            | User info              | DashboardLayout | Forms, Button                     |
| Settings          | `/settings`           | System configurations  | DashboardLayout | Tabs, Forms                       |

---

## 3. Components Overview

### 3.1 Basic UI Components

- **Button**: primary, secondary, disabled, loading
- **Input**: text, number, password, email, date
- **Modal**: confirm, alert, form modal
- **Table**: sortable, paginated, selectable
- **Card**: info display, metrics
- **Charts**: bar, line, pie for dashboards
- **Notification**: toast, alerts, push placeholder

### 3.2 Advanced Components

- **Filters**: search, dropdown, date range
- **Pagination**: numeric, next/prev
- **Tabs**: for profile, employee details
- **ExportButton**: CSV/PDF exports
- **SkeletonLoader**: for tables/charts

---

## 4. Layouts

### 4.1 AuthLayout

- For pages: login, password reset
- Centered forms
- Minimal header/footer
- Toast notifications

### 4.2 DashboardLayout

- For all authenticated pages
- Sidebar navigation (role-based)
- Top bar with notifications & profile menu
- Breadcrumbs for current page
- Main content area for components

---

## 5. Routing & Navigation

- Next.js **file-based routing**:
  - `/pages` folder automatically maps to routes
- Protected routes:
  - Use HOC or middleware for role-based access
- Nested routes for modules:
  - Employees `[id]`, Payroll `[id]`
- Redirect:
  - Unauthenticated → `/login`
  - Unauthorized → `/dashboard`

---

## 6. State Management

- Use **Zustand / Redux**:
  - userStore → current user, roles, token
  - employeeStore → employee list, details
  - attendanceStore → daily logs, check-in/out
  - leaveStore → leave balance, requests
  - payrollStore → payroll cycles, payslips
  - reportStore → report filters, export data

- Global notifications via notificationStore

---

## 7. API Integration

- Centralized API service (`/services`) for all CRUD:
  - Employees, Attendance, Leave, Payroll, Reports, Notifications
- Async calls with **error handling and toast notifications**
- Axios or Fetch with JWT token
- Optimistic updates for quick UX

---

## 8. Forms & Validation

- All forms use **react-hook-form** or **Formik**
- Validation rules centralized (`/utils/validation.ts`)
- Includes NIC, bank account, date range, email, password strength

---

## 9. Performance Guidelines

- Lazy load pages with dynamic imports
- Memoize expensive components (React.memo / useMemo)
- Table virtualization for large datasets
- Cache frequently used API data

---

## 10. Security Guidelines

- Role-based access on pages/components
- Token stored securely in HTTP-only cookies or local storage
- Sanitize all inputs
- Mask sensitive data in UI (NIC, salary, bank)

---

> This single `.md` provides a **full blueprint for the Next.js frontend**, including **pages, components, layouts, routing, state, API, forms, performance, and security**, making it easy to implement the entire HRIS system step by step.
