using AnaECommerce.Backend.Models;

namespace AnaECommerce.Backend.Interfaces
{
    /// <summary>
    /// Unit of Work pattern interface. 
    /// Coordinates multiple repositories and ensures they share the same database transaction.
    /// This allows atomic operations across different entities.
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        // Entity-specific repositories
        IRepository<Category> Categories { get; }
        IRepository<SubCategory> SubCategories { get; }
        IRepository<Brand> Brands { get; }
        IRepository<Product> Products { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        
        /// <summary>Persists all changes made in the repositories to the database.</summary>
        Task<int> CommitAsync();

        /// <summary>Starts a new database transaction.</summary>
        Task BeginTransactionAsync();

        /// <summary>Finalizes and commits the current transaction.</summary>
        Task CommitTransactionAsync();

        /// <summary>Rolls back the current transaction if an error occurs.</summary>
        Task RollbackTransactionAsync();
    }
}
