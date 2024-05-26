using API.Extensions;
using FluentValidation.AspNetCore;
using FluentValidation;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

namespace API
{
    public class Startup
    {
        //public Startup(IConfiguration configuration)
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            this._config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            services.AddApplicationServices(this._config);
            services.AddIdentityServices(this._config);

            // Fluent validation
            services.AddValidatorsFromAssemblyContaining<Application.Activities.Create>();
            services.AddFluentValidationAutoValidation()
                    .AddFluentValidationClientsideAdapters();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(opt => opt.Deny());
            app.UseCsp(opt => opt
                .BlockAllMixedContent()
                .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com",
                                                          "https://fonts.gstatic.com",
                                                          "data:"))
                .FontSources(s => s.Self().CustomSources("https://fonts.googleapis.com",
                                                         "https://fonts.gstatic.com",
                                                         "data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com",
                                                          "blob:"))
                .ScriptSources(s => s.Self())
            );

            if (env.IsDevelopment())
            {
                Console.WriteLine("Mode: Development");
                //app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }
            else
            {
                Console.WriteLine("Mode: Production");
                // app.UseHsts(opt => 
                // {
                //     opt.IncludeSubdomains();
                //     opt.MaxAge(365);
                // });
                app.Use(async (context, next) => {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
                app.UseHttpsRedirection();
            }


            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
