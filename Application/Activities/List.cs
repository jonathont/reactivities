using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        { 
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = this._context.Activities
                                        .Where(a => a.Date >= request.Params.StartDate)
                                        .OrderBy(d => d.Date)
                                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                                            new { currentUsername = _userAccessor.GetUsername()})
                                        .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                    query = query.Where(a => a.Attendees.Any(t => t.Username == _userAccessor.GetUsername()));
                else if (request.Params.IsHost)
                    query = query.Where(a => a.HostUsername == _userAccessor.GetUsername());

                var activities = await PagedList<ActivityDto>.CreateAsync(query, 
                                                                 request.Params.PageNumber, 
                                                                 request.Params.PageSize, 
                                                                 cancellationToken);
                                                                 
                return Result<PagedList<ActivityDto>>.Success(activities);
            }
        }

    }
}