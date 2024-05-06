using FluentValidation;

namespace Application.Profiles
{
    public class ProfileValidator : AbstractValidator<Profile>
    {
        public ProfileValidator()
        {
            RuleFor(p => p.DisplayName).NotEmpty();
        }
    }
}