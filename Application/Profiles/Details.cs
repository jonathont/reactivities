using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>?>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._mapper = mapper;
                this._context = context;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Profile>?> Handle(Query request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.Users
                                .ProjectTo<Profile>(_mapper.ConfigurationProvider,
                                    new { currentUsername = _userAccessor.GetUsername() })
                                .SingleOrDefaultAsync(u => u.Username == request.Username);

                if (userProfile == null)
                    return null;

                return Result<Profile>.Success(userProfile);
            }
        }
    }
}