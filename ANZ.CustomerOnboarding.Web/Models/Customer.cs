using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Models
{
    public class Customer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("id")]
        public string CustomerId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("parent")]
        public string Parent { get; set; }

        [BsonElement("address")]
        public string Address { get; set; }

        [BsonElement("rmName")]
        public string RMName { get; set; }

        [BsonElement("rmAddress")]
        public string RMAddress { get; set; }

        [BsonElement("country")]
        public string Country { get; set; }
        
    }
}
