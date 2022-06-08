const superagent = require('superagent');
const superagentJsonapify = require('superagent-jsonapify');
const { ApolloServer, gql } = require("apollo-server");

superagentJsonapify(superagent);

const BASE_URL = 'http://api.zippopotam.us';

function fetchResponseByURL(relativeURL) {
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

const typeDefs = gql`
  type Place {
    name: String
    state: String
    stateAbbreviation: String
    longitude: String
    latitude: String
  }

  type ZipCode {
    postCode: String
    country: String
    countryAbbreviation: String
    places: [Place]
  }

  type Query {
    fetchZipCode(zipCode: String, countryCode: String): ZipCode
  }
`;

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
