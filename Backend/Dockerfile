# Używamy oficjalnego obrazu .NET SDK do budowy aplikacji
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /src

# Kopiujemy plik csproj i przywracamy zależności
COPY ["ContentManagementSystem/ContentManagementSystem.csproj", "ContentManagementSystem/"]
RUN dotnet restore "ContentManagementSystem/ContentManagementSystem.csproj"

# Kopiujemy resztę aplikacji i budujemy ją
COPY . .
WORKDIR "/src/ContentManagementSystem"
RUN dotnet publish "ContentManagementSystem.csproj" -c Release -o /app/publish

# Używamy oficjalnego obrazu .NET do uruchomienia aplikacji
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

# Kopiujemy aplikację do katalogu roboczego w obrazie
COPY --from=build /app/publish .

# Definiujemy punkt wejścia aplikacji
ENTRYPOINT ["dotnet", "ContentManagementSystem.dll"]
