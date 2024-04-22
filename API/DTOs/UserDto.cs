
namespace API.DTOs
{
    #pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    public class UserDto
    {
        public string? DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string? Image { get; set; }
    }
    #pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
}