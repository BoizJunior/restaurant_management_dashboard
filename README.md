# Restaurant Management Dashboard

A modern, comprehensive dashboard for managing restaurant operations, built with [Next.js 14](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Radix UI](https://www.radix-ui.com/).

## 🚀 Features

The dashboard includes the following core management modules:

- **Overview**: General dashboard view for quick insights.
- **POS & Sales** (`/pos-sales`): Point of Sale interface and sales tracking.
- **Inventory Management** (`/inventory`): Track stock levels and inventory items.
- **Menu & Pricing** (`/menu-pricing`): Manage menu items and pricing strategies.
- **Staff Management** (`/staff`): Manage staff schedules and information.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Primitives), [Lucide React](https://lucide.dev/) (Icons)
- **Visualization**: [Recharts](https://recharts.org/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd restaurant-management
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

To build the application for production:

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## 🧪 Testing

Run the test suite using Jest:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── inventory/        # Inventory management route
│   ├── menu-pricing/     # Menu and pricing route
│   ├── pos-sales/        # POS and sales route
│   ├── staff/            # Staff management route
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard overview
├── components/           # Reusable UI components
├── lib/                  # Utility functions
├── public/               # Static assets
└── __tests__/            # Unit and integration tests
```

## 📄 License

This project is licensed under the MIT License.
