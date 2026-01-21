using Microsoft.EntityFrameworkCore.Storage;
using AnaECommerce.Backend.Data;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;

namespace AnaECommerce.Backend.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public IRepository<Category> Categories { get; }
        public IRepository<SubCategory> SubCategories { get; }
        public IRepository<Brand> Brands { get; }
        public IRepository<Product> Products { get; }
        public IRepository<Order> Orders { get; }
        public IRepository<OrderItem> OrderItems { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Categories = new Repository<Category>(context);
            SubCategories = new Repository<SubCategory>(context);
            Brands = new Repository<Brand>(context);
            Products = new Repository<Product>(context);
            Orders = new Repository<Order>(context);
            OrderItems = new Repository<OrderItem>(context);
        }

        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

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
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
