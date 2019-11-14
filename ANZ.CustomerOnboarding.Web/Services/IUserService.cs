using ANZ.CustomerOnboarding.Web.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        void AddUser(User userData);
        bool EditUser(User userData);
        Task<List<User>> GetUsers(string searchCriteria);
        List<User> CheckDuplicatesForUserName(string searchCriteria);
    }
}
