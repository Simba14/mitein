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
    CANCELLED
    REJECTED
    REQUESTED
  }

  enum Language {
    de
    en
  }

  type Availability {
    id: ID!
    dayIndex: Int
    start: String!
    end: String!
    userId: ID!
  }

  type Session {
    id: ID!
    availabilityId: ID
    start: String!
    end: String!
    link: String
    participant1Id: ID
    participant2Id: ID
    status: EventStatus!
    cancellationReason: ID
  }

  type Cancellation {
    id: ID!
    sessionId: ID!
    date: String!
  }

  type User {
    sessions: [Session]
    displayName: String
    displayLanguage: Language
    email: String
    isEmailVerified: Boolean
    id: ID!
    interests: [String]
    name: String
    phoneNumber: String
    suspendedUntil: String
    cancellations: [Cancellation]
    type: UserType
  }

  input UpdateUserInput {
    displayName: String
    interests: [String]
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
    availability(userId: ID!): [Availability]
    availableSlots: [Session]
    user(id: ID!): User
    sessions(
      participant1Id: ID
      participant2Id: ID
      status: EventStatus
      notOneOf: [EventStatus]
    ): [Session]
    volunteerWith(city: String!): [Organization]
  }

  type Mutation {
    addAvailability(
      start: String!
      end: String!
      userId: ID!
      userType: UserType!
    ): Availability
    deleteAvailability(ids: [ID!]!): Boolean
    createSessionsFromAvailability(
      participant1Id: ID
      participant2Id: ID
      status: EventStatus!
      start: String
      end: String
      userType: UserType!
    ): Availability
    deleteSessions(ids: [ID!]!): Boolean
    updateSession(
      id: ID
      participant1Id: ID
      participant2Id: ID
      status: EventStatus!
      start: String
      end: String
      cancelledBy: ID
      cancellationReason: UserType
    ): Session
    newsletterSignUp(email: String!): String
    signIn(email: String!, password: String!): User
    signOut: Boolean
    signUp(
      email: String!
      password: String!
      displayName: String!
      type: UserType!
    ): User
    updateUser(id: ID!, fields: UpdateUserInput!): User!
    verifyEmail(token: String!): Boolean!
  }
`;

export default typeDefs;
