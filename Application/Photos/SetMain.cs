using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Photos)
                                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null)
                    return Result<Unit>.Failure("Unable to find user");

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null)
                    return Result<Unit>.Failure("Unable to find requested photo");

                var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
                if (currentMain != null)
                    currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);
                
                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}