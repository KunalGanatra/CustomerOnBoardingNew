using ANZ.CustomerOnboarding.Web.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ANZ.CustomerOnboarding.Web.Services
{
    public class CustomerService : ICustomerService
    {

        private readonly IMongoCollection<Customer> _customers;

        public CustomerService(ICustomerDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _customers = database.GetCollection<Customer>(settings.CustomersCollectionName);
        }


        /// <summary>
        /// Index has been created in MongoDB for ID, Name, Parent, RMName.
        /// This will perform free text search on MONGO DB & return appropriate records.
        /// The records are sorted based on the highest matching score.
        /// Also the Name of the customer has been set to have the highest weightage in
        /// the database followed by Parent,RMName & ID.
        /// The search query is case insensitive with collation set in Database.
        /// </summary>
        /// <param name="searchCriteria"></param>
        public async Task<List<Customer>> GetCustomers(string searchCriteria)
        {
            return await _customers.Aggregate().Match(Builders<Customer>.Filter.Text(searchCriteria))
                 .Sort(Builders<Customer>.Sort.MetaTextScore("textScore"))
                 .ToListAsync();

        }

        /// <summary>
        /// While searching for customer assumption is users will prefer to
        /// have a like query.
        /// </summary>
        /// <param name="searchCriteria"></param>
        /// <returns></returns>
        public async Task<List<Customer>> GetCustomersByName(string searchCriteria)
        {
            var filter = Builders<Customer>.Filter.Regex("name", new BsonRegularExpression(searchCriteria, "i"));
            var result = await _customers.FindAsync(filter);
            return result.ToList();
        }


        /// <summary>
        /// We will get the matched customer parents after aggregating
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public CustomerAggregate GetCustomerHierarchy(string criteria)
        {
            var graphLookupStage = new BsonDocument("$graphLookup",
                         new BsonDocument
                             {
                                    { "from", "customers" },
                                    { "startWith", "$parent" },
                                    { "connectFromField", "parent"},
                                    { "connectToField",  "name" },
                                    { "as", "parents" },
                                    { "maxDepth", 10 }
                                //optional
                         });
            var result = _customers.Aggregate().Match(Builders<Customer>.Filter.Eq(x => x.Name, criteria)).
                AppendStage<BsonDocument>(graphLookupStage);

            return BsonSerializer.Deserialize<CustomerAggregate>(result.FirstOrDefault());

        }

        public void AddCustomer(Customer customer)
        {
            _customers.InsertOne(customer);
        }

        public bool EditCustomer(Customer customer)
        {
            var filter = Builders<Customer>.Filter.Eq("id", customer.CustomerId);
            var updateDefinition = Builders<Customer>.Update
                .Set(m => m.Id, customer.Id)
                .Set(m => m.Name, customer.Name)
                .Set(m => m.Parent, customer.Parent)
                .Set(m => m.RMAddress, customer.RMAddress)
                .Set(m => m.RMName, customer.RMName)
                .Set(m => m.Address, customer.Address)
                .Set(m => m.Country, customer.Country);

            var updateOptions = new UpdateOptions { IsUpsert = false };
            var result = _customers.UpdateOne(filter, updateDefinition);
            return result.IsAcknowledged;

        }

        public List<Customer> CheckDuplicatesForAdd(string customerId)
        {

            var filter = Builders<Customer>.Filter.Eq(x => x.CustomerId, customerId);
            return _customers.Find(filter).ToList();

        }

        public List<Customer> CheckDuplicatesForEdit(string customerId, string customerName)
        {
            var filter = Builders<Customer>.Filter.And(
              Builders<Customer>.Filter.Where(p => p.CustomerId.Equals(customerId)),
                Builders<Customer>.Filter.Where(p => !p.Name.Equals(customerName))
            );
            return _customers.Find(filter).ToList();

        }


    }


}
