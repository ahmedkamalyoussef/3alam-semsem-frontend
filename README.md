
# 3alam Semsem Store Management System (Frontend)

This is a modern store management system built with React and Tailwind CSS. It provides a full-featured dashboard for managing products, sales, repairs, expenses, and more.

## Features

- **Dashboard**: Real-time statistics, recent sales, and quick actions
- **Product Management**: Add, edit, delete, and view products
- **Category Management**: Organize and manage product categories
- **Sales Management**: Register and track sales operations
- **Sale Items**: View details and performance of sold items
- **Repairs Management**: Register and follow up on repair requests
- **Expenses Management**: Register and track expenses
- **Responsive Design**: Works on all devices
- **RTL & Arabic UI**: Full support for Arabic and RTL layout

### Backend Integration
Fully compatible with the backend API, supporting all modules:
- Admin
- Category
- Product
- Sale
- SaleItem
- Repair
- Expense

## Tech Stack

- **React 19**
- **Tailwind CSS**
- **Lucide React** (icons)
- **Vite** (build tool)

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Start the development server:**
	```bash
	npm run dev
	```
3. **Open the app:**
	Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── ui/              # UI components (Button, Card, Modal)
│   ├── layout/          # Layout components (Sidebar, Header)
│   └── StoreManagement.jsx
├── pages/               # Main app pages (fully API-driven)
│   ├── Dashboard.jsx
│   ├── ProductsManager.jsx
│   ├── CategoriesManager.jsx
│   ├── SalesManager.jsx
│   ├── SaleItemsManager.jsx
│   ├── RepairsManager.jsx
│   ├── ExpensesManager.jsx
│   └── ComingSoon.jsx
├── App.jsx
├── App.css
└── index.css
```

## Usage

- **Dashboard**: View sales stats, pending repairs, and quick navigation
- **Products**: Add, edit, delete, search, and filter products by category
- **Categories**: Create, edit, delete, and view product categories
- **Sales**: Register new sales, view details, and monthly stats
- **Sale Items**: View sold item details and performance
- **Repairs**: Register and track repair requests and costs
- **Expenses**: Register, categorize, and track expenses

## Customization

- **Colors**: Customize via Tailwind CSS variables in `index.css`
- **Fonts**: Uses Cairo (Arabic) by default; change in `index.css` if needed

## Roadmap

- [x] Full API integration for all modules
- [ ] Authentication system
- [ ] Advanced reporting
- [ ] Notifications system
- [ ] Mobile app

## Contribution

Contributions are welcome! Please open a Pull Request or Issue for discussion.

## License

This project is licensed under the MIT License.
