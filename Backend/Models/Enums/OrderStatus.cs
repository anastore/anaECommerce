namespace AnaECommerce.Backend.Models.Enums
{
    /// <summary>
    /// Represents the various states an order can transition through in its lifecycle.
    /// </summary>
    public enum OrderStatus
    {
        /// <summary>Initial state: Order created but not yet verified or paid.</summary>
        Pending = 0,
        
        /// <summary>Payment verified: Warehouse is preparing the shipment.</summary>
        Processing = 1,
        
        /// <summary>Order handed over to the shipping carrier.</summary>
        Shipped = 2,
        
        /// <summary>Order successfully delivered to the customer.</summary>
        Delivered = 3,
        
        /// <summary>Order cancelled by customer or staff; no longer active.</summary>
        Cancelled = 4
    }
}
