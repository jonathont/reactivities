using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {

        public class Command : IRequest<Result<Unit>?>
        {
            public Profile Profile { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Profile).SetValidator(new ProfileValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>?>
        {

            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._dataContext = dataContext;
            }

            public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (user == null)
                    return null;

                user.Bio = request.Profile.Bio;
                user.DisplayName = request.Profile.DisplayName;

                _dataContext.Entry(user).Property(u => u.DisplayName).IsModified = true;

                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);
                else
                    return Result<Unit>.Failure("Problem updating profile");
            }
        }

    }

}