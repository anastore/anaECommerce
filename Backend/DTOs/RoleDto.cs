namespace AnaECommerce.Backend.DTOs
{
    /// <summary>DTO representing a security role (e.g., Admin, Client).</summary>
    public class RoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        
        /// <summary>Count of users currently assigned to this role.</summary>
        public int UserCount { get; set; }
    }
}
