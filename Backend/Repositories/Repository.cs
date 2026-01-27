using Microsoft.EntityFrameworkCore;
using AnaECommerce.Backend.Data;
using AnaECommerce.Backend.Interfaces;
using AnaECommerce.Backend.Models;
using System.Linq.Expressions;

namespace AnaECommerce.Backend.Repositories
{
    /// <summary>
    /// Generic repository implementation using Entity Framework Core.
    /// Provides concrete logic for standard CRUD operations on any entity inheriting from BaseEntity.
    /// </summary>
    /// <typeparam name="T">The entity type.</typeparam>
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        /// <summary>Finds an entity by its ID using EF's FindAsync.</summary>
        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        /// <summary>Retrieves all active (non-deleted) entities of type T.</summary>
        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        /// <summary>Retrieves all entities including related data specified by include expressions.</summary>
        public virtual async Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.ToListAsync();
        }

        /// <summary>Returns a paged result set for the entity type.</summary>
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _dbSet.CountAsync();
            var items = await _dbSet
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /// <summary>Returns a paged result set including specified related entities.</summary>
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /// <summary>Finds entities based on a boolean predicate expression.</summary>
        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        /// <summary>Finds and pages entities based on a predicate.</summary>
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> FindPagedAsync(
            Expression<Func<T, bool>> predicate, 
            int pageNumber, 
            int pageSize)
        {
            var query = _dbSet.Where(predicate);
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /// <summary>Finds and pages entities matching a predicate while loading related data.</summary>
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> FindPagedAsync(
            Expression<Func<T, bool>> predicate, 
            int pageNumber, 
            int pageSize,
            params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            query = query.Where(predicate);
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        /// <summary>Initiates the addition of an entity to the context.</summary>
        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        /// <summary>Marks an existing entity as modified.</summary>
        public virtual void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        /// <summary>
        /// Performs a "Soft Delete". 
        /// Instead of removing the record, marks its IsDeleted flag as true.
        /// Global query filters in DbContext ensure these records are omitted from standard queries.
        /// </summary>
        public virtual void Delete(T entity)
        {
            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        /// <summary>Gets the total count of active records.</summary>
        public virtual async Task<int> CountAsync()
        {
            return await _dbSet.CountAsync();
        }

        /// <summary>Gets the count of active records matching a specific condition.</summary>
        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.CountAsync(predicate);
        }
    }
}
