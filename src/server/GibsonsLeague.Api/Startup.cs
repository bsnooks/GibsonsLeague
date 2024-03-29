using System;
using System.Collections.Generic;
using GibsonsLeague.Api.Middleware;
using GibsonsLeague.Api.Models;
using GibsonsLeague.Auth;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GibsonsLeague.YahooSync;
using GibsonsLeague.YahooSync.Hubs;
using GraphQL.Server;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            services.AddControllers();

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
            services.AddScoped<RecordRepository>();
            services.AddScoped<FranchiseTradeRepository>();
            services.AddScoped<SeasonRepository>();
            services.AddScoped<AnalysisRepository>();
            services.AddScoped<PlayoffPoolRepository>();

            services.AddScoped<IYahooSyncService, YahooSyncService>();
            services.AddScoped<IYahooAuthService, YahooAuthService>();

            services.AddScoped<GibsonsLeagueSchema>();

            services.AddSignalR();

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
            app.UseRouting();
            app.UseCors(builder =>
                builder.WithOrigins(
                    "https://localhost:3000",
                    "http://gibsonsleague.com/",
                    "https://gibsonsleague.com/",
                    "https://gibsonsleague-app.azurewebsites.net/")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
            app.UseWebSockets();
            app.UseGraphQLWebSockets<GibsonsLeagueSchema>("/graphql");
            app.UseGraphQL<GibsonsLeagueSchema>();

            app.UseMiddleware<YahooAuthenticationMiddleware>();

            app.UseGraphQLPlayground(new GraphQL.Server.Ui.Playground.GraphQLPlaygroundOptions());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<YahooSyncHub>("/yahoosync");
            });
        }
    }
}
