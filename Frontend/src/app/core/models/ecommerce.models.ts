export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    subCategoryCount: number;
    createdAt: Date;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    brandId: number;
    brandName: string;
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    categoryName: string;
    createdAt: Date;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    brandId: number;
    imageUrl?: string;
}

export enum OrderStatus {
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    userId: string;
    userName: string;
    totalAmount: number;
    status: OrderStatus;
    orderDate: Date;
    items: OrderItem[];
}

export interface CreateOrderDto {
    userId: string;
    items: { productId: number; quantity: number }[];
}
