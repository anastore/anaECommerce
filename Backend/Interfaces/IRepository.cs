using System.Linq.Expressions;

namespace AnaECommerce.Backend.Interfaces
{
    /// <summary>
    /// A generic repository interface providing standard CRUD operations.
    /// Acts as an abstraction layer between the business logic and the database context.
    /// </summary>
    /// <typeparam name="T">The entity type this repository handles.</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>Gets an entity by its primary key.</summary>
        Task<T?> GetByIdAsync(int id);

        /// <summary>Gets all entities of type T.</summary>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>Gets all entities of type T, including specified related data.</summary>
        Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);

        /// <summary>Gets a paginated list of entities.</summary>
        Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize);

        /// <summary>Gets a paginated list of entities, including related data.</summary>
        Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, params Expression<Func<T, object>>[] includes);

        /// <summary>Finds entities that match the specified predicate.</summary>
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        /// <summary>Finds a paginated list of entities matching the predicate.</summary>
        Task<(IEnumerable<T> Items, int TotalCount)> FindPagedAsync(Expression<Func<T, bool>> predicate, int pageNumber, int pageSize);

        /// <summary>Finds a paginated list of entities matching the predicate, including related data.</summary>
        Task<(IEnumerable<T> Items, int TotalCount)> FindPagedAsync(Expression<Func<T, bool>> predicate, int pageNumber, int pageSize, params Expression<Func<T, object>>[] includes);

        /// <summary>Adds a new entity to the data context.</summary>
        Task AddAsync(T entity);

        /// <summary>Marks an entity as modified in the context.</summary>
        void Update(T entity);

        /// <summary>Soft deletes an entity by marking it as deleted in the context (handled via query filters).</summary>
        void Delete(T entity);

        /// <summary>Counts the total number of entities.</summary>
        Task<int> CountAsync();

        /// <summary>Counts the number of entities matching a predicate.</summary>
        Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    }
}
