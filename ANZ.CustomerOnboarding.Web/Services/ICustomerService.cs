using ANZ.CustomerOnboarding.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Services
{
    public interface ICustomerService
    {
        Task<List<Customer>> GetCustomers(string searchCriteria);

        Task<List<Customer>> GetCustomersByName(string searchCriteria);

        CustomerAggregate GetCustomerHierarchy(string customerId);

        void AddCustomer(Customer customer);

        void EditCustomer(Customer customer);

        List<Customer> CheckDuplicatesForEdit(string customerId, string customerName);

        List<Customer> CheckDuplicatesForAdd(string customerId);
    }
}
