const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { events, users, participants, locations } = require('./data')


const typeDefs = gql`

type User {
    username:String!,
    id:ID!,
    email:String!,
    events: [Event!]!,

}

type Event {
        id: ID!,
        title: String!,
        desc: String!,
        date: String!,
        from: String!,
        to: String!,
        location_id: ID!,
        user_id: ID!,
        user:User!
        location:Location!
        participant:[Participant!]!

},

type Location {
    id:ID!,
    name:String!
    desc:String!
    lat:Float!
    lng:Float!

}


type Participant {
  id:ID!
  user_id:ID!
  event_id:ID!
}


type Query{
users:[User!]!,
user(id:ID!): User!

events:[Event!]!
event(id: ID!): Event!

locations:[Location!]!
location(id: ID!):Location!


participants:[Participant!]!
participant(id: ID!):Participant!
}
`

const resolvers = {

    Query: {
        users: () => users,
        user: (parent, args) => users.find(user => user.id === args.id),
       
        events: () => events,
        event: (parent, args) => events.find((event) => event.id === args.id),

        locations: () => locations,
        location: (parent, args) => locations.find((location) => location.id === args.id),

        participants: () => participants,
        participant: (parent, args) => participants.find((participant) => participant.id === args.id),
    },
  User: {
    events: (parent, args) => events.filter((event) => event.user_id === parent.id)
  },
  Event : {
 user: (parent,args) => users.find((user) => user.id === parent.id),
 location:(parent, args) => locations.find((location) => location.id === parent.id),
 participant:(parent, args) => participants.filter((participant) => participant.user_id === parent.id)
  }

};


const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})] });
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});