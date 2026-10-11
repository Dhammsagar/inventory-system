# Inventory Management System

A full-stack inventory management application built with **Spring Boot 3** (Java 17) and **React** (Vite + Tailwind CSS).

## Tech Stack

### Backend
- Java 17, Spring Boot 3.3.4
- Spring Web, Spring Data JPA, Hibernate Validation
- SQLite (file-based database)
- Hibernate Community Dialects (SQLiteDialect)
- Lombok
- JUnit 5 + Mockito

### Frontend
- React 19, Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- React Hot Toast
- Lucide React Icons

## Project Structure

```
inventory-system/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/inventory/inventorysystem/
│       ├── InventorySystemApplication.java
│       ├── config/
│       │   ├── DataSeeder.java            # Seeds 10 sample products
│       │   ├── InventoryMapper.java        # Entity ↔ DTO mapper
│       │   └── WebConfig.java              # CORS configuration
│       ├── controller/
│       │   ├── ProductController.java      # CRUD + search + low-stock
│       │   ├── StockController.java        # Stock updates
│       │   ├── MovementController.java     # Movement history
│       │   └── DashboardController.java    # Aggregated stats
│       ├── service/
│       │   ├── ProductService.java
│       │   ├── ProductServiceImpl.java
│       │   ├── StockService.java
│       │   ├── StockServiceImpl.java
│       │   ├── DashboardService.java
│       │   └── DashboardServiceImpl.java
│       ├── repository/
│       │   ├── ProductRepository.java
│       │   └── StockMovementRepository.java
│       ├── entity/
│       │   ├── Product.java
│       │   ├── StockMovement.java
│       │   └── MovementType.java           # IN, OUT, ADJUSTMENT
│       ├── dto/
│       │   ├── ProductRequest.java
│       │   ├── ProductResponse.java
│       │   ├── StockUpdateRequest.java
│       │   ├── StockMovementResponse.java
│       │   └── DashboardResponse.java
│       └── exception/
│           ├── ResourceNotFoundException.java
│           ├── DuplicateResourceException.java
│           ├── InsufficientStockException.java
│           ├── ErrorResponse.java
│           └── GlobalExceptionHandler.java
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                        # Router + Toaster
        ├── index.css                      # Tailwind entry
        ├── api/
        │   ├── axios.js                   # Axios instance (port 8080)
        │   ├── products.js
        │   ├── stock.js
        │   └── dashboard.js
        ├── components/
        │   ├── Layout.jsx                 # Sidebar + top bar
        │   ├── Button.jsx
        │   ├── Card.jsx
        │   ├── Badge.jsx
        │   ├── Modal.jsx
        │   ├── Spinner.jsx
        │   ├── EmptyState.jsx
        │   ├── ConfirmModal.jsx
        │   ├── ProductForm.jsx
        │   └── StockUpdateForm.jsx
        ├── pages/
        │   ├── DashboardPage.jsx
        │   ├── ProductsPage.jsx
        │   └── MovementsPage.jsx
        └── hooks/
            ├── useProducts.js
            └── useDebounce.js
```

## Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **npm 9+**

## Setup & Run

### Backend (Port 8080)

```bash
cd inventory-system/backend
mvn spring-boot:run
```

The database file `inventory.db` is created automatically in the backend directory.
On first run, 10 sample products are seeded.

### Frontend (Port 5173)

```bash
cd inventory-system/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests

```bash
cd inventory-system/backend
mvn test
```

## API Endpoints

### Products

| Method   | Endpoint                    | Description                          |
|----------|-----------------------------|--------------------------------------|
| `GET`    | `/api/products`             | List all (optional `?search=`)       |
| `GET`    | `/api/products/{id}`        | Get by ID                            |
| `GET`    | `/api/products/low-stock`   | Products at or below reorder level   |
| `POST`   | `/api/products`             | Create product                       |
| `PUT`    | `/api/products/{id}`        | Update product                       |
| `DELETE` | `/api/products/{id}`        | Delete product                       |

### Stock

| Method   | Endpoint                          | Description                     |
|----------|-----------------------------------|---------------------------------|
| `POST`   | `/api/products/{id}/stock`        | Update stock (IN/OUT/ADJUSTMENT)|
| `GET`    | `/api/products/{id}/movements`    | Movements for a product         |
| `GET`    | `/api/movements`                  | All movements (paginated, filterable by `productId` and `type`) |

### Dashboard

| Method   | Endpoint          | Description                                          |
|----------|-------------------|------------------------------------------------------|
| `GET`    | `/api/dashboard`  | Stats: totals, inventory value, low stock, 5 recent movements |

### Error Responses

All errors return a consistent JSON body:

```json
{
  "status": 400,
  "error": "Insufficient Stock",
  "message": "Insufficient stock for Widget: requested 100, available 50",
  "timestamp": "2026-10-10T00:00:00",
  "fieldErrors": null
}
```

| Status | When                          |
|--------|-------------------------------|
| 400    | Validation / Insufficient stock |
| 404    | Resource not found            |
| 409    | Duplicate SKU                 |
| 500    | Internal server error         |
