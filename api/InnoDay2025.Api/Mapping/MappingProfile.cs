using AutoMapper;
using InnoDay2025.Api.Models;
using InnoDay2025.Api.DTOs;

namespace InnoDay2025.Api.Mapping;

/// <summary>
/// AutoMapper mapping profile for converting between models and DTOs
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

        CreateMap<User, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedProducts, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedProducts, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        // Product mappings
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedByUser));

        CreateMap<CreateProductDto, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedByUser, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<UpdateProductDto, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedByUser, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}