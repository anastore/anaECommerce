using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.Models.Enums;
using AnaECommerce.Backend.DTOs;

namespace AnaECommerce.Backend.Controllers
{
    /// <summary>
    /// API Controller for handling customer orders.
    /// Manages checkout processing, order history, and status tracking.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrdersController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>Lists orders with filtering options. Admin/Manager restricted.</summary>
        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PaginatedResult<OrderDto>>> GetOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] OrderStatus? status = null,
            [FromQuery] string? userId = null)
        {
            var allOrders = (await _unitOfWork.Orders.GetAllAsync()).AsQueryable();

            // Apply filters for efficient administrator management
            if (status.HasValue)
            {
                allOrders = allOrders.Where(o => o.Status == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(userId))
            {
                allOrders = allOrders.Where(o => o.UserId == userId);
            }

            var totalCount = allOrders.Count();
            var orders = allOrders
                .OrderByDescending(o => o.OrderDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var orderDtos = orders.Select(o => _mapper.Map<OrderDto>(o)).ToList();

            var result = new PaginatedResult<OrderDto>
            {
                Items = orderDtos,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            };

            return Ok(result);
        }

        /// <summary>Gets details for a specific order.</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(_mapper.Map<OrderDto>(order));
        }

        /// <summary>
        /// Processes a new order submission.
        /// Business Logic:
        /// 1. Generates unique order number.
        /// 2. Validates product existence and stock availability.
        /// 3. Calculates total amount based on CURRENT product prices.
        /// 4. Deducts quantity from product stock.
        /// 5. Persists Order and OrderItems in the database.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderDto createDto)
        {
            // Initialize the order header
            var order = new Order
            {
                OrderNumber = $"ORD-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                UserId = createDto.UserId,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                TotalAmount = 0
            };

            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            // Process each requested item
            foreach (var itemDto in createDto.Items)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(itemDto.ProductId);
                if (product == null)
                {
                    return BadRequest(new { message = $"Product {itemDto.ProductId} not found" });
                }

                // Inventory Check
                if (product.Stock < itemDto.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for product {product.Name}" });
                }

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price // Snapshot price at time of order
                };

                orderItems.Add(orderItem);
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;

                // Deduct stock immediately to prevent overselling
                product.Stock -= itemDto.Quantity;
                _unitOfWork.Products.Update(product);
            }

            order.TotalAmount = totalAmount;
            
            // Save order first to generate Id
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CommitAsync();

            // Link items and save them
            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                await _unitOfWork.OrderItems.AddAsync(item);
            }

            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id },
                new { message = "Order created successfully", id = order.Id, orderNumber = order.OrderNumber });
        }

        /// <summary>Updates an order's status (e.g., marks it as Shipped). Admin/Manager only.</summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto updateDto)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            order.Status = updateDto.Status;
            _unitOfWork.Orders.Update(order);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Order status updated successfully" });
        }

        /// <summary>Hard/Soft deletes an order record. Admin only.</summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            _unitOfWork.Orders.Delete(order);
            await _unitOfWork.CommitAsync();

            return Ok(new { message = "Order deleted successfully" });
        }
    }
}
