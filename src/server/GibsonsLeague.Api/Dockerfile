FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src
COPY ["GibsonsLeague.Api/GibsonsLeague.Api.csproj", "GibsonsLeague.Api/"]
RUN dotnet restore "GibsonsLeague.Api/GibsonsLeague.Api.csproj"
COPY . .
WORKDIR "/src/GibsonsLeague.Api"
RUN dotnet build "GibsonsLeague.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GibsonsLeague.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GibsonsLeague.Api.dll"]