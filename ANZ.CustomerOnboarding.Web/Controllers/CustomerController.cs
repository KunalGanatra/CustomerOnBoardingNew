using ANZ.CustomerOnboarding.Web.Entities;
using ANZ.CustomerOnboarding.Web.Models;
using ANZ.CustomerOnboarding.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ANZ.CustomerOnboarding.Web.Helpers;

namespace ANZ.CustomerOnboarding.Web.Controllers
{
    [Authorize]
    [Route("api/customer")]
    public class CustomerController : ControllerBase
    {
        private ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }


        /// <summary>
        /// KunalG.
        /// Sometimes the string can be too long for a free text search hence keeping it as POST
        /// to avoid crossing the browser allowable limit.
        /// </summary>
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody]string searchCriteria)
        {
            if (searchCriteria == null)
                return BadRequest(new { message = "Invalid Search Criteria" });

            var customers = await _customerService.GetCustomers(searchCriteria);
            return Ok(customers);

        }


        [HttpPost("searchCustomerByName")]
        public async Task<IActionResult> SearchCustomerByName([FromBody]string searchCriteria)
        {
            if (searchCriteria == null)
                return BadRequest(new { message = "Invalid Search Criteria" });

            var customers = await _customerService.GetCustomersByName(searchCriteria);
            return Ok(customers);

        }

        [Authorize(Roles = Role.Admin + "," + Role.Edit)]
        [HttpPost("add")]
        public IActionResult Add([FromBody]Customer customer)
        {
            if (customer == null)
                return BadRequest(new { message = "Invalid Customer Data" });

            if (_customerService.CheckDuplicatesForAdd(customer.CustomerId).Count > 0)
                return BadRequest(new { message = "Duplicate Data found" });

            _customerService.AddCustomer(customer);
            return Ok(customer);

        }

        [Authorize(Roles = Role.Admin + "," + Role.Edit)]
        [HttpPost("edit")]
        public IActionResult Edit([FromBody]Customer customer)
        {
            if (customer == null)
                return BadRequest(new { message = "Invalid Customer Data" });

            if (_customerService.CheckDuplicatesForEdit(customer.CustomerId, customer.Name).Count > 0)
                return BadRequest(new { message = "Duplicate Data found" });

            _customerService.EditCustomer(customer);

            return Ok(customer);

        }

        [Authorize(Roles = Role.Admin + "," + Role.Edit + "," + Role.ViewOnly)]
        [HttpGet("view")]
        public IActionResult View(string customerId)
        {
            if (customerId == null)
                return BadRequest(new { message = "Invalid Data" });

            var customer = _customerService.GetCustomerHierarchy(customerId).ToCustomerHierarchy();

            return Ok(customer);

        }



    }
}
