import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  enum UserType {
    LEARNER
    NATIVE
    REPRESENTATIVE
  }

  enum EventStatus {
    AVAILABLE
    BOOKED
    REQUESTED
  }

  type Session {
    id: ID!
    start: String!
    end: String!
    participant1Id: String
    participant2Id: String
    status: String!
  }

  type User {
    sessions: [Session]
    displayName: String
    email: String
    id: ID!
    name: String
    phoneNumber: String
    type: UserType
  }

  type Socials {
    facebook: String
    instagram: String
    twitter: String
  }

  type Organization {
    id: ID!
    city: String!
    description(locale: String!): String!
    email: String!
    logo: String!
    name: String!
    socials: Socials
    tags: [String]
    website: String!
  }

  type Query {
    availableSlots: [Session]
    user(id: ID!): User
    sessions(participant1Id: ID, participant2Id: ID, status: String): [Session]
    volunteerWith(city: String!): [Organization]
  }

  type Mutation {
    deleteSessions(ids: [ID!]!): Boolean
    updateSession(
      sessionId: ID
      participant1Id: ID
      participant2Id: ID
      status: String!
      start: String
      end: String
    ): Session
    newsletterSignUp(email: String!): String
    signIn(email: String!, password: String!): User
    signOut: Boolean
    signUp(
      email: String!
      password: String!
      displayName: String!
      type: String!
    ): User
  }
`;

export default typeDefs;
