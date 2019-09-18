using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(i => i.IsMain).Url));
        }
    }
}