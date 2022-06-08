const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');
const { ApolloServer, gql } = require("apollo-server");

superagentJsonapify(superagent);

const BASE_URL = 'http://api.zippopotam.us';

function fetchResponseByURL(relativeURL) {
  // console.log('fetchResponseByURL', relativeURL, superagent)
  return superagent.get(`${BASE_URL}${relativeURL}`).then(res => res);
}

function fetchZipCode(_, {zipCode, countryCode}) {
  return fetchResponseByURL(`/${countryCode}/${zipCode}`).then(res => {
    const places = res.body['places'].map((place) => {
      return {
        name: place['place name'],
        state: place['state'],
        stateAbbreviation: place['state abbreviation'],
        longitude: place['longitude'],
        latitude: place['latitude']
      };
    });
    return ({
      postCode: res.body['post code'],
      country: res.body['country'],
      countryAbbreviation: res.body['country abbreviation'],
      places,
    });
  });
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Place {
    name: String
    state: String
    stateAbbreviation: String
    longitude: String
    latitude: String
  }

  # # This "Book" type defines the queryable fields for every book in our data source.
  type ZipCode {
    postCode: String
    country: String
    countryAbbreviation: String
    places: [Place]
  }

  # type Book {
  #   title: String
  #   author: Author
  # }

  # # The "Query" type is special: it lists all of the available queries that
  # # clients can execute, along with the return type for each. In this
  # # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    fetchZipCode(zipCode: String, countryCode: String): ZipCode
  }

  # type Query {
  #   books: [Book]
  # }

  # type Author {
  #   name: String
  #   books: [Book]
  # }

  # type Mutation {
  #   addBook(title: String, author: String): Book
  # }
`;

// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin",
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster",
//   },
// ];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    fetchZipCode: (zipCode, countryCode) => fetchZipCode(zipCode, countryCode),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
