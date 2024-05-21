using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Activities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string? Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>?>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<Result<List<UserActivityDto>>?> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username);

                if (user == null)
                    return null;

                var query = _context.Activities.Where(a => a.Attendees.Any(at => at.AppUserId == user.Id));

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.UtcNow),
                    "future" => query.Where(a => a.Date >= DateTime.UtcNow),
                    "hosting" => query.Where(a => a.Attendees.Any(at => at.AppUserId == user.Id && at.IsHost)),
                    _ => query
                };

                var activities = await query.ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                                            .ToListAsync();

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}