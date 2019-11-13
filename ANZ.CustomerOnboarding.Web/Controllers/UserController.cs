using ANZ.CustomerOnboarding.Web.Entities;
using ANZ.CustomerOnboarding.Web.Helpers;
using ANZ.CustomerOnboarding.Web.Models;
using ANZ.CustomerOnboarding.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Controllers
{
    [Authorize]
    [Route("api/user")]
    public class UserController : ControllerBase
    {

        private IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]Authenitication model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Invalid Username or Password" });

            return Ok(user);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody]string searchCriteria)
        {
            if (!searchCriteria.Equals(string.Empty))
            {
                var users = await _userService.GetUsers(searchCriteria);
                return Ok(users);
            }
            else
                return null;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("add")]
        public IActionResult Add([FromBody]User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid Customer Data" });

            if (_userService.CheckDuplicatesForUserName(user.Username).Count > 0)
                return BadRequest(new { message = "Duplicate Data found" });

            // Admins will not have access to passwords & cant add one.
            //This is for exercise purpose. In reality the password generation
            //needs to be more robust.
            user.Password = PasswordGenerator.CreatePassword(5);

            _userService.AddUser(user);
            return Ok(user);

        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("edit")]
        public IActionResult Edit([FromBody]User user)
        {
            if (user == null)
                return BadRequest(new { message = "Invalid Customer Data" });

            _userService.EditUser(user);
            return Ok(user);

        }

    }
}
