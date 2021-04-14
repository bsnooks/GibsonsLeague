using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GibsonsLeague.Api.Models;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL.Server;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GibsonsLeague.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        public IConfiguration _config { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddDbContext<GLAContext>(options =>
                options.UseSqlServer(_config.GetConnectionString("GibsonsLeagueDb")));

            var optionsBuilder = new DbContextOptionsBuilder<GLAContext>();
            optionsBuilder.UseSqlServer(_config.GetConnectionString("GibsonsLeagueDb"));

            services.AddSingleton(s => new Func<GLAContext>(() => new GLAContext(optionsBuilder.Options)));

            services.AddScoped<LeagueRepository>();
            services.AddScoped<FranchiseRepository>();
            services.AddScoped<DraftRepository>();
            services.AddScoped<DraftPickRepository>();
            services.AddScoped<PlayerRepository>();
            services.AddScoped<TransactionRepository>();
            services.AddScoped<MatchRepository>();
            services.AddScoped<TeamRepository>();

            services.AddScoped<GibsonsLeagueSchema>();

            services.AddGraphQL()
                .AddSystemTextJson(o => o.PropertyNameCaseInsensitive = true)
                .AddGraphTypes(ServiceLifetime.Scoped)
                .AddUserContextBuilder(httpContext => new Dictionary<string, object> { { "User", httpContext.User } })
                .AddDataLoader()
                .AddWebSockets();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(builder =>
                builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseWebSockets();
            app.UseGraphQLWebSockets<GibsonsLeagueSchema>("/graphql");
            app.UseGraphQL<GibsonsLeagueSchema>();

            if (env.IsDevelopment())
            {
                app.UseGraphQLPlayground(new GraphQL.Server.Ui.Playground.GraphQLPlaygroundOptions());
            }
        }
    }
}
