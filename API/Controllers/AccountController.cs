using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, 
                                    SignInManager<AppUser> signInManager, 
                                    TokenService tokenService)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                                        .Include(p => p.Photos)
                                        .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null) 
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
                return CreateUserObject(user);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto?>> Register(RegisterDto registerDto)
        {

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email in use");
                return ValidationProblem(ModelState);
            }
            
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username in use");
                return ValidationProblem(ModelState);
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest($"Problem registering user: {string.Join(',', result.Errors.Select(e => e.Description))}");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto?>> GetCurrentUser()
        {
            var user = await _userManager.Users
                                        .Include(p => p.Photos)
                                        .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email)!);            

            return CreateUserObject(user);
        }

        private UserDto? CreateUserObject(AppUser? user)
        {
            if (user == null)
                return null;

            return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = user.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                    Token = _tokenService.CreateToken(user),
                    Username = user.UserName!
                };
        }

    }
}