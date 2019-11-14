using ANZ.CustomerOnboarding.Web.Entities;
using ANZ.CustomerOnboarding.Web.Helpers;
using ANZ.CustomerOnboarding.Web.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Services
{
    public class UserService : IUserService
    {

        private readonly IMongoCollection<User> _users;
        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings, ICustomerDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _appSettings = appSettings.Value;
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }


        public User Authenticate(string username, string password)
        {
            var user = _users.Find(x => x.Username == username && x.Password == password).ToList().FirstOrDefault();


            // null if user is not available
            if (user == null)
                return null;

            // generate jwt token on successful authentication
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            return user;
        }


        public void AddUser(User userData)
        {
            _users.InsertOne(userData);
        }

        //In Ideal scenario the username & password is set by the user
        //hence only role & the details of the person can be changed by the admin.
        public bool EditUser(User userData)
        {
            var filter = Builders<User>.Filter.Eq("userName", userData.Username);
            var updateDefinition = Builders<User>.Update
                .Set(m => m.FirstName, userData.FirstName)
                .Set(m => m.LastName, userData.LastName)
                .Set(m => m.Role, userData.Role);


            var updateOptions = new UpdateOptions { IsUpsert = false };
            var result = _users.UpdateOne(filter, updateDefinition);
            return result.IsAcknowledged;
        }


        public async Task<List<User>> GetUsers(string searchCriteria)
        {
            var filter = Builders<User>.Filter.Regex("userName", new BsonRegularExpression(searchCriteria));
            var result = await _users.FindAsync(filter);
            return result.ToList();

        }

        public List<User> CheckDuplicatesForUserName(string userName)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Username, userName);
            return _users.Find(filter).ToList();

        }

    }
}
