namespace AnaECommerce.Backend.Models
{
    /// <summary>
    /// Abstract base class for all domain entities.
    /// Provides common properties for tracking, auditing, and soft-delete functionality.
    /// </summary>
    public abstract class BaseEntity
    {
        /// <summary>Unique primary key for the entity.</summary>
        public int Id { get; set; }

        /// <summary>Timestamp of when the entity was first created.</summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>The ID of the user who created the entity.</summary>
        public string? CreatedBy { get; set; }

        /// <summary>Timestamp of the last update to the entity.</summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>The ID of the user who last updated the entity.</summary>
        public string? UpdatedBy { get; set; }

        /// <summary>Soft-delete flag. If true, the entity is considered deleted but remains in the database.</summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>Indicates if the entity is currently active and available.</summary>
        public bool IsActive { get; set; } = true;
    }
}
