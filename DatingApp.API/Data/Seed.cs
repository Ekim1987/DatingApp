using System.Collections.Generic;
using System.Linq;
using System.Text;
using DatingApp.API.models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach(var user in users){
                    byte [] passwordhash,passwordSalt;
                    createPasswordHash("password", out passwordhash,out passwordSalt);
                    user.PasswordSalt = passwordSalt;
                    user.PasswordHash =passwordhash;
                    user.Username = user.Username.ToLower();
                    context.Users.Add(user);

                }
                context.SaveChanges();
            }
        }
          private static void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }

        }
    }
}