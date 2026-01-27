namespace AnaECommerce.Backend.DTOs
{
    /// <summary>Data Transfer Object for displaying product details in the UI.</summary>
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        
        // Brand details (flattened for easy display)
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        
        // Hierarchy details
        public int SubCategoryId { get; set; }
        public string SubCategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>Request DTO for creating a new product.</summary>
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int BrandId { get; set; }
        public string? ImageUrl { get; set; }
    }

    /// <summary>Request DTO for updating an existing product's details.</summary>
    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int BrandId { get; set; }
        public string? ImageUrl { get; set; }
    }
}
