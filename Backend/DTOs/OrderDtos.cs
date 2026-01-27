using AnaECommerce.Backend.Models.Enums;

namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Response DTO providing a comprehensive view of an order and its items.</summary>
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
        
        /// <summary>The list of products included in the order.</summary>
        public List<OrderItemDto> Items { get; set; } = new();
    }

    /// <summary>DTO representing a single line item within an order response.</summary>
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        
        /// <summary>Calculated subtotal for this item (Quantity * UnitPrice).</summary>
        public decimal Subtotal => Quantity * UnitPrice;
    }

    /// <summary>Request DTO for submitting a new order.</summary>
    public class CreateOrderDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    /// <summary>Simplified item DTO used only for order creation requests.</summary>
    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    /// <summary>Request DTO for administrators to update an order's fulfillment status.</summary>
    public class UpdateOrderStatusDto
    {
        public OrderStatus Status { get; set; }
    }
}
