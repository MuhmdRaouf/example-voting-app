FROM mcr.microsoft.com/dotnet/sdk:3.1-bullseye-arm64v8 as builder

WORKDIR /Worker

COPY ["src/Worker.csproj", "."]

RUN dotnet restore

COPY ["src/", "."]

RUN dotnet publish -c Release -o /out Worker.csproj

# App image
FROM mcr.microsoft.com/dotnet/runtime:3.1-alpine-arm64v8

WORKDIR /app
ENTRYPOINT ["dotnet", "Worker.dll"]

COPY --from=builder /out .
