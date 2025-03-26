using Azure.Core;
using ContentManagementSystem.Data;
using ContentManagementSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ContentManagementSystem.Services
{
    public static class DataGenerator
    {
        private static Random _random = new Random();
        public static async Task GenerateData(DataContext dbContext)
        {
            dbContext.Database.Migrate();  // Wykonanie migracji

            if (dbContext.Users.FirstOrDefault() is null)
            {
                PasswordHasher<string> _passwordHasher = new PasswordHasher<string>();
                dbContext.Users.Add(new User() { Username = "Admin", Password = _passwordHasher.HashPassword("Admin", "1234") });

                dbContext.BusinessBasicData.Add(new("SlimPaczka", "501602703", "slimPaczka@gmail.com"));

                for (int i = 0; i < 5; i++)
                {
                    dbContext.CateringTypes.Add(new Models.CateringType
                    {
                        CateringName = $"Dieta{i + 1}",
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        Prices = new List<CateringPrice>()
                        {
                            new CateringPrice() { Kcal = _random.Next(15, 35) * 100, Price = _random.Next(30, 100)},
                            new CateringPrice() { Kcal = _random.Next(15, 35) * 100, Price = _random.Next(30, 100)},
                            new CateringPrice() { Kcal = _random.Next(15, 35) * 100, Price = _random.Next(30, 100)}
                        }
                    });
                }

                for (int i = 0; i < 3; i++) 
                {
                    dbContext.ClientOpinions.Add(new Models.ClientOpinion() { Name = "Przemek", DietName = "Dieta", Opinion = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." });
                }

                dbContext.Sites.Add(new() { Name = "O firmie", Priority = 0, Text = "Slim Paczka to firma cateringowa, która pomaga osiągnąć Twoje cele zdrowotne i sylwetkowe w wygodny, smaczny i zrównoważony sposób. Specjalizujemy się w dietach pudełkowych, dostosowanych do indywidualnych potrzeb naszych klientów – niezależnie od tego, czy chcesz schudnąć, nabrać masy mięśniowej, czy po prostu zdrowo się odżywiać.\r\n\r\nKażdy posiłek przygotowywany przez Slim Paczka to połączenie świeżych składników, starannie dobranych przypraw i innowacyjnych receptur. Nasz zespół doświadczonych dietetyków i kucharzy dba o to, aby dostarczyć Ci pełnowartościowe jedzenie, które nie tylko wygląda apetycznie, ale także smakuje wyśmienicie.\r\n\r\nSlim Paczka to nie tylko jedzenie, ale także wygoda. Oferujemy dostawy prosto pod drzwi, zapewniając maksymalny komfort. Nasze elastyczne plany żywieniowe pozwalają dopasować dietę do Twojego stylu życia, niezależnie od tego, czy jesteś osobą aktywną, czy prowadzącą bardziej siedzący tryb życia.\r\n\r\nZ Slim Paczką zyskasz czas, energię i zdrowie, a codzienne wybory żywieniowe staną się proste i przyjemne. Przekonaj się, jak łatwo można zmienić swoje nawyki i zadbać o siebie – zaufaj Slim Paczce i zrób pierwszy krok ku lepszemu życiu!" });
                dbContext.Sites.Add(new() { Name = "Kontakt", Priority = 1, Text = "Slim Paczka to firma cateringowa, która pomaga osiągnąć Twoje cele zdrowotne i sylwetkowe w wygodny, smaczny i zrównoważony sposób. Specjalizujemy się w dietach pudełkowych, dostosowanych do indywidualnych potrzeb naszych klientów – niezależnie od tego, czy chcesz schudnąć, nabrać masy mięśniowej, czy po prostu zdrowo się odżywiać.\r\n\r\nKażdy posiłek przygotowywany przez Slim Paczka to połączenie świeżych składników, starannie dobranych przypraw i innowacyjnych receptur. Nasz zespół doświadczonych dietetyków i kucharzy dba o to, aby dostarczyć Ci pełnowartościowe jedzenie, które nie tylko wygląda apetycznie, ale także smakuje wyśmienicie.\r\n\r\nSlim Paczka to nie tylko jedzenie, ale także wygoda. Oferujemy dostawy prosto pod drzwi, zapewniając maksymalny komfort. Nasze elastyczne plany żywieniowe pozwalają dopasować dietę do Twojego stylu życia, niezależnie od tego, czy jesteś osobą aktywną, czy prowadzącą bardziej siedzący tryb życia.\r\n\r\nZ Slim Paczką zyskasz czas, energię i zdrowie, a codzienne wybory żywieniowe staną się proste i przyjemne. Przekonaj się, jak łatwo można zmienić swoje nawyki i zadbać o siebie – zaufaj Slim Paczce i zrób pierwszy krok ku lepszemu życiu!" });
                dbContext.Sites.Add(new() { Name = "Nowości", Priority = 2, Text = "Slim Paczka to firma cateringowa, która pomaga osiągnąć Twoje cele zdrowotne i sylwetkowe w wygodny, smaczny i zrównoważony sposób. Specjalizujemy się w dietach pudełkowych, dostosowanych do indywidualnych potrzeb naszych klientów – niezależnie od tego, czy chcesz schudnąć, nabrać masy mięśniowej, czy po prostu zdrowo się odżywiać.\r\n\r\nKażdy posiłek przygotowywany przez Slim Paczka to połączenie świeżych składników, starannie dobranych przypraw i innowacyjnych receptur. Nasz zespół doświadczonych dietetyków i kucharzy dba o to, aby dostarczyć Ci pełnowartościowe jedzenie, które nie tylko wygląda apetycznie, ale także smakuje wyśmienicie.\r\n\r\nSlim Paczka to nie tylko jedzenie, ale także wygoda. Oferujemy dostawy prosto pod drzwi, zapewniając maksymalny komfort. Nasze elastyczne plany żywieniowe pozwalają dopasować dietę do Twojego stylu życia, niezależnie od tego, czy jesteś osobą aktywną, czy prowadzącą bardziej siedzący tryb życia.\r\n\r\nZ Slim Paczką zyskasz czas, energię i zdrowie, a codzienne wybory żywieniowe staną się proste i przyjemne. Przekonaj się, jak łatwo można zmienić swoje nawyki i zadbać o siebie – zaufaj Slim Paczce i zrób pierwszy krok ku lepszemu życiu!" });
                dbContext.Sites.Add(new() { Name = "Nasze cele", Priority = 3, Text = "Slim Paczka to firma cateringowa, która pomaga osiągnąć Twoje cele zdrowotne i sylwetkowe w wygodny, smaczny i zrównoważony sposób. Specjalizujemy się w dietach pudełkowych, dostosowanych do indywidualnych potrzeb naszych klientów – niezależnie od tego, czy chcesz schudnąć, nabrać masy mięśniowej, czy po prostu zdrowo się odżywiać.\r\n\r\nKażdy posiłek przygotowywany przez Slim Paczka to połączenie świeżych składników, starannie dobranych przypraw i innowacyjnych receptur. Nasz zespół doświadczonych dietetyków i kucharzy dba o to, aby dostarczyć Ci pełnowartościowe jedzenie, które nie tylko wygląda apetycznie, ale także smakuje wyśmienicie.\r\n\r\nSlim Paczka to nie tylko jedzenie, ale także wygoda. Oferujemy dostawy prosto pod drzwi, zapewniając maksymalny komfort. Nasze elastyczne plany żywieniowe pozwalają dopasować dietę do Twojego stylu życia, niezależnie od tego, czy jesteś osobą aktywną, czy prowadzącą bardziej siedzący tryb życia.\r\n\r\nZ Slim Paczką zyskasz czas, energię i zdrowie, a codzienne wybory żywieniowe staną się proste i przyjemne. Przekonaj się, jak łatwo można zmienić swoje nawyki i zadbać o siebie – zaufaj Slim Paczce i zrób pierwszy krok ku lepszemu życiu!" });

                await dbContext.SaveChangesAsync();
            }
        }

    }
}

