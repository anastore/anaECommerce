using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.Models.Enums;
using AnaECommerce.Backend.DTOs;

namespace AnaECommerce.Backend.Controllers
{
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

        [HttpGet]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<PaginatedResult<OrderDto>>> GetOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] OrderStatus? status = null,
            [FromQuery] string? userId = null)
        {
            var allOrders = (await _unitOfWork.Orders.GetAllAsync()).AsQueryable();

            // Apply filters
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

        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderDto createDto)
        {
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

            foreach (var itemDto in createDto.Items)
            {
                var product = await _unitOfWork.Products.GetByIdAsync(itemDto.ProductId);
                if (product == null)
                {
                    return BadRequest(new { message = $"Product {itemDto.ProductId} not found" });
                }

                if (product.Stock < itemDto.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for product {product.Name}" });
                }

                var orderItem = new OrderItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                orderItems.Add(orderItem);
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;

                // Update product stock
                product.Stock -= itemDto.Quantity;
                _unitOfWork.Products.Update(product);
            }

            order.TotalAmount = totalAmount;
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CommitAsync();

            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                await _unitOfWork.OrderItems.AddAsync(item);
            }

            await _unitOfWork.CommitAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id },
                new { message = "Order created successfully", id = order.Id, orderNumber = order.OrderNumber });
        }

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
