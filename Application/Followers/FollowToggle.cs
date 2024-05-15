using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle 
    {
        public class Command : IRequest<Result<Unit>?>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>?>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (observer == null)
                    return null;

                var target = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                if (target == null)
                    return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                // If not 'following' relation found, add one
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.UserFollowings.Add(following);
                }
                else // If a relation is found, remove it
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);
                else
                    return Result<Unit>.Failure("Problem updating following status");
            }
        }
    }
}