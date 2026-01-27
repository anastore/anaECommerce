using Microsoft.EntityFrameworkCore.Storage;
using AnaECommerce.Backend.Data;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;

namespace AnaECommerce.Backend.Repositories
{
    /// <summary>
    /// Implementation of the Unit of Work pattern.
    /// Ensures that all repositories work with the same DbContext instance to maintain data consistency.
    /// Manages database transactions to ensure Atomic, Consistent, Isolated, and Durable (ACID) operations.
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        // Concrete repository instances
        public IRepository<Category> Categories { get; }
        public IRepository<SubCategory> SubCategories { get; }
        public IRepository<Brand> Brands { get; }
        public IRepository<Product> Products { get; }
        public IRepository<Order> Orders { get; }
        public IRepository<OrderItem> OrderItems { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            
            // Initialize repositories with the shared context
            Categories = new Repository<Category>(context);
            SubCategories = new Repository<SubCategory>(context);
            Brands = new Repository<Brand>(context);
            Products = new Repository<Product>(context);
            Orders = new Repository<Order>(context);
            OrderItems = new Repository<OrderItem>(context);
        }

        /// <summary>Executes SaveChanges on the underlying DbContext to persist all tracked changes.</summary>
        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        /// <summary>Begins a new explicit database transaction.</summary>
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        /// <summary>
        /// Attempts to commit all changes and finalize the current transaction.
        /// Automatically rolls back if an exception occurs during commit.
        /// </summary>
        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                // Ensure the transaction is rolled back on any failure
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                // Resource cleanup
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        /// <summary>Rolls back all changes made within the current transaction scope.</summary>
        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        /// <summary>Releases database context and transaction resources.</summary>
        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
