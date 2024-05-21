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

            string currentUsername = null;

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                    .ForMember(d => d.HostUsername, 
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                    .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                    .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                    .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(ph => ph.IsMain)!.Url))
                    .ForMember(d => d.FollowersCount, p => p.MapFrom(a => a.AppUser.Followers.Count))
                    .ForMember(d => d.FollowingCount, p => p.MapFrom(a => a.AppUser.Followings.Count))
                    .ForMember(d => d.Following, p => p.MapFrom(a => a.AppUser.Followers.Any(f => f.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
                    .ForMember(p => p.Image, o => o.MapFrom(u => u.Photos.FirstOrDefault(ph => ph.IsMain)!.Url))
                    .ForMember(p => p.FollowersCount, p => p.MapFrom(u => u.Followers.Count))
                    .ForMember(p => p.FollowingCount, p => p.MapFrom(u => u.Followings.Count))
                    .ForMember(p => p.Following, p => p.MapFrom(u => u.Followers.Any(f => f.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                    .ForMember(c => c.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                    .ForMember(c => c.Username, o => o.MapFrom(s => s.Author.UserName))
                    .ForMember(c => c.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(ph => ph.IsMain)!.Url));

            CreateMap<Activity, Profiles.UserActivityDto>()
                    .ForMember(a => a.Id, o => o.MapFrom(s => s.Id))
                    .ForMember(a => a.Title, o => o.MapFrom(s => s.Title))
                    .ForMember(a => a.Category, o => o.MapFrom(s => s.Category))
                    .ForMember(a => a.Date, o => o.MapFrom(s => s.Date))
                    .ForMember(a => a.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(at => at.IsHost).AppUser.UserName));
        }
    }
}