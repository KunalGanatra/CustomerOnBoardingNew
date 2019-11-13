using ANZ.CustomerOnboarding.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Helpers
{
    public static class Extensions
    {
        /// <summary>
        /// This method flattens the customer data based on the Aggregate from MongoDB.
        /// </summary>
        /// <param name="aggregate"></param>
        /// <returns></returns>
        public static List<Customer> ToCustomerHierarchy(this CustomerAggregate aggregate)
        {
            List<Customer> customers = new List<Customer>();
            var parentCustomer = string.Empty;
            var parentCount = 0;
            while (aggregate.Parents.Count > parentCount)
            {
                Customer customer = aggregate.Parents.Where(x => (x.Parent ?? string.Empty).Equals(parentCustomer)).FirstOrDefault();
                if (customer != null)
                {
                    customers.Add(customer);
                    parentCustomer = customer.Name;
                }
                parentCount++;
            }

            customers.Add(new Customer()
            {
                Name = aggregate.Name,
                CustomerId = aggregate.CustomerId,
                Address = aggregate.Address,
                Country = aggregate.Country,
                Id = aggregate.Id,
                Parent = aggregate.Parent,
                RMAddress = aggregate.RMAddress,
                RMName = aggregate.RMName
            });

            return customers;
        }
    }
}
