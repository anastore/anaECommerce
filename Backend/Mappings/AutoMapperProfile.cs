using AutoMapper;
using AnaECommerce.Backend.Models;
using AnaECommerce.Backend.DTOs;

namespace AnaECommerce.Backend.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Category mappings
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.SubCategoryCount, opt => opt.MapFrom(src => src.SubCategories.Count));
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // SubCategory mappings
            CreateMap<SubCategory, SubCategoryDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                .ForMember(dest => dest.BrandCount, opt => opt.MapFrom(src => src.Brands.Count));
            CreateMap<CreateSubCategoryDto, SubCategory>();
            CreateMap<UpdateSubCategoryDto, SubCategory>();

            // Brand mappings
            CreateMap<Brand, BrandDto>()
                .ForMember(dest => dest.SubCategoryName, opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.Name : string.Empty))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.CategoryId : 0))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.SubCategory != null && src.SubCategory.Category != null ? src.SubCategory.Category.Name : string.Empty))
                .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));
            CreateMap<CreateBrandDto, Brand>();
            CreateMap<UpdateBrandDto, Brand>();

            // Product mappings
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.Name : string.Empty))
                .ForMember(dest => dest.SubCategoryId, opt => opt.MapFrom(src => src.Brand != null ? src.Brand.SubCategoryId : 0))
                .ForMember(dest => dest.SubCategoryName, opt => opt.MapFrom(src => src.Brand != null && src.Brand.SubCategory != null ? src.Brand.SubCategory.Name : string.Empty))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Brand != null && src.Brand.SubCategory != null ? src.Brand.SubCategory.CategoryId : 0))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Brand != null && src.Brand.SubCategory != null && src.Brand.SubCategory.Category != null ? src.Brand.SubCategory.Category.Name : string.Empty));
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();

            // Order mappings
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.FullName : string.Empty))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems));

            // OrderItem mappings
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty));
            CreateMap<CreateOrderItemDto, OrderItem>();

            // User Profile mappings
            CreateMap<ApplicationUser, UserProfileDto>();
            CreateMap<UpdateUserProfileDto, ApplicationUser>();
            CreateMap<Address, AddressDto>();
            CreateMap<CreateAddressDto, Address>();
            CreateMap<UserPaymentMethod, UserPaymentMethodDto>();
        }
    }
}
