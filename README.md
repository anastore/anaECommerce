# 🛍️ AnaECommerce - Premium E-Commerce Platform

AnaECommerce is a state-of-the-art, full-stack e-commerce solution built with a focus on premium user experience, robust architecture, and seamless performance.

---

## 🚀 Key Features

### 🔐 Advanced Authentication & Onboarding
*   **Multi-Step Registration**: A professional wizard-based onboarding flow that guides users through account creation.
*   **Delayed Asset Upload**: Optimized registration flow where profile pictures are only uploaded upon final form submission to save bandwidth and storage.
*   **Secure JWT Authentication**: Role-based access control with secure token management.

### 👤 Premium Profile Management
*   **Unified Profile Dashboard**: A clean, modern interface for managing personal data, addresses, and payments.
*   **Smart Edit Mode**: Toggle between a high-fidelity read-only view and an interactive edit form with a single click.
*   **Multi-Address System**: Dynamic management of multiple delivery addresses (Home, Office, etc.).
*   **Payment Metadata**: Ready-to-go Stripe integration metadata for payment method management.

### 🌍 Localization & RTL Support
*   **Full RTL Optimization**: Tailored layouts for Arabic and other RTL languages.
*   **Multi-Language Support**: Complete localization using `ngx-translate`.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [Angular 17+](https://angular.io/)
*   **UI Components**: [Angular Material](https://material.angular.io/)
*   **State Management**: Reactive Patterns with RxJS
*   **Styling**: Vanilla CSS with modern Flexbox/Grid systems and Tailwind support.

### Backend
*   **Framework**: [.NET 8 Web API](https://dotnet.microsoft.com/en-us/apps/aspnet/apis)
*   **Database**: [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) with SQL Server
*   **Identity**: [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)
*   **Mapping**: [AutoMapper](https://automapper.org/) for DTO-Entity synchronization.

---

## 🏗️ Architecture Highlights

### Repository Pattern & Unit of Work
The backend follows the Repository pattern to decouple the data access layer from the business logic, ensuring testability and maintainability.

### Clean DTO Strategy
All API communications use dedicated Data Transfer Objects (DTOs) to protect the internal database schema and provide exactly what the frontend needs.

### Centralized Asset Management
A robust `UploadController` handles all media assets, providing programmatic control over storage paths and public URLs.

---

## 📦 Getting Started

### Prerequisites
*   [.NET SDK 8.0](https://dotnet.microsoft.com/download)
*   [Node.js (LTS)](https://nodejs.org/)
*   [Angular CLI](https://angular.io/cli)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/anastore/anaECommerce.git
    cd anaECommerce
    ```

2.  **Setup Backend**
    ```bash
    cd Backend
    dotnet restore
    dotnet run
    ```

3.  **Setup Frontend**
    ```bash
    cd ../Frontend
    npm install
    npm start
    ```

---

## 🤝 Git Workflow
The project follows a standardized Git flow:
*   **Branching**: `master` for production-ready code.
*   **Naming**: Structured branch names (e.g., `fix/`, `feature/`).
*   **Integrity**: Squashed merges and PR-based reviews for all production changes.

---

## 📜 License
*This project is private and owned by AnaStore.*
