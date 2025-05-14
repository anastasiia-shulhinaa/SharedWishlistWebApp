using AutoMapper;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SharedWishlistWebApp.Server.MappingProfile
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Wishlist mappings
            CreateMap<WishlistCreateDto, Wishlist>();
            CreateMap<Wishlist, WishlistDto>();
            CreateMap<WishlistUpdateDto, Wishlist>();
            CreateMap<Wishlist, WishlistGuestViewDto>()
                .ForMember(dest => dest.GiftItems, opt => opt.MapFrom(src => src.GiftItems));


            // GiftItem mappings
            CreateMap<GiftItemCreateDto, GiftItem>();
            CreateMap<GiftItem, GiftItemDto>();
            CreateMap<GiftItem, GiftItemCreateDto>();
            CreateMap<GiftItem, GiftItemUpdateDto>();
            CreateMap<GiftItem, GiftItemGuestViewDto>()
                .ForMember(dest => dest.IsFullyReserved, opt => opt.MapFrom(src => src.GiftReservations.Sum(r => r.ContributionAmount ?? 0) >= src.Price))
                .ForMember(dest => dest.ReservedAmount, opt => opt.MapFrom(src => src.GiftReservations.Sum(r => r.ContributionAmount ?? 0)));

            // Guest mappings
            CreateMap<GuestCreateDto, Guest>();
            CreateMap<Guest, GuestDto>();

            // GiftReservation mappings
            CreateMap<GiftReservationCreateDto, GiftReservationDto>();
            CreateMap<GiftReservation, GiftReservationDto>();

        }
    }
}
