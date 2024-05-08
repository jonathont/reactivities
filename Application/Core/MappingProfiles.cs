using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()        
        {

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                    .ForMember(d => d.HostUsername, 
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                    .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                    .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                    .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(ph => ph.IsMain)!.Url));
            CreateMap<AppUser, Profiles.Profile>()
                    .ForMember(p => p.Image, o => o.MapFrom(u => u.Photos.FirstOrDefault(ph => ph.IsMain)!.Url));
            CreateMap<Comment, CommentDto>()
                    .ForMember(c => c.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                    .ForMember(c => c.Username, o => o.MapFrom(s => s.Author.UserName))
                    .ForMember(c => c.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(ph => ph.IsMain)!.Url));
        }
    }
}