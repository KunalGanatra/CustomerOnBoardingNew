using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Models
{
    public class CustomerAggregate: Customer
    {
        [BsonElement("parents")]
        public List<Customer> Parents{ get; set; }
    }
}
