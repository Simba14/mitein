import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  enum UserType {
    LEARNER
    NATIVE
    REPRESENTATIVE
  }

  enum ChatType {
    VIDEO
    IN_PERSON
  }

  enum Frequency {
    ONCE
    DAILY
    WEEKLY
    BIWEEKLY
    MONTHLY
    YEARLY
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

  type Event {
    id: ID!
    image: String
    title: String!
    capacity: String
    date: String!
    start: String!
    end: String!
    userId: ID!
    frequency: Frequency
  }

  type Chat {
    id: ID!
    availabilityId: ID
    start: String!
    end: String!
    link: String
    participant1Id: ID
    participant1Name: String
    participant2Id: ID
    participant2Name: String
    status: EventStatus!
    cancellationReason: ID
    lastUpdated: String
    type: ChatType
  }

  type Chats {
    available: [Chat]
    booked: [Chat]
    cancelled: [Chat]
    past: [Chat]
    rejected: [Chat]
    requested: [Chat]
  }

  type Cancellation {
    id: ID!
    chatId: ID!
    date: String!
  }

  type User {
    id: ID!
    chats: Chats
    displayName: String
    displayLanguage: Language
    email: String
    isEmailVerified: Boolean
    interests: [String]
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
    address: String!
    city: String!
    description(locale: String!): String!
    events: [Event]!
    logo: String!
    name: String!
    socials: Socials
    tags: [String]
    website: String!
    needsVolunteers: Boolean
  }

  type Query {
    availability(userId: ID!): [Availability]
    availableChats(userId: ID): [Chat]
    user(id: ID!): User
    chats(
      participant1Id: ID
      participant2Id: ID
      notOneOf: [EventStatus]
      status: EventStatus
      upcoming: Boolean
    ): [Chat]
    organization(id: ID, userId: ID): Organization
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
    createChatsFromAvailability(
      participant1Id: ID
      participant2Id: ID
      status: EventStatus!
      start: String
      end: String
      userType: UserType!
    ): Availability
    deleteChats(ids: [ID!]!): Boolean
    updateChat(
      id: ID
      participant1Id: ID
      participant1Name: String
      participant2Id: ID
      participant2Name: String
      status: EventStatus!
      start: String
      end: String
      cancelledBy: ID
      cancellationReason: UserType
    ): Chat
    newsletterSignUp(email: String!): String
    resetPassword(password: String!, token: String!): Boolean!
    resetPasswordRequest(email: String!): Boolean!
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
