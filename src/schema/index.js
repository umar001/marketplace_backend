import Query from '../resolvers/Query';

// import{Product,Customer,Order,User}from'../resolvers/index'

import Mutation from '../resolvers/Mutation';
import ISODate from '../scalars/ISODate';



const typeDefs = `
  type Query {
    user(id: ID!): User
    users(query: Pagination!): [User]
    userCount(query: Pagination!): Int
    me: User
  }
  
  type Mutation {
    signup (web3_address: String!, web3_provider: String!, network_id: Int!): signupUser,
    walletSignin (web3_address: String!, txHash: String!): walletSignin,
    walletNonce (web3_address: String!, web3_provider: String!, network_id: Int!): WalletNonce,
    login (email: String!, password: String!): customUser,
    updateUser(id:ID,username: String!, email: String!, password: String,role: String,space:String): String,
  }
  type WalletNonce{
    web3_address:String,
    nonce:String,
    meta: meta
  }
  type walletSignin{
    token:String,
    web3_address:String,
    meta: meta
  }
  type signupUser{
    token:String,
    web3_address:String,
    meta: meta
  }

  type meta {
    created_at:String
    updated_at:String
  }


  type User {
    _id: ID!
    name: String,
    email: String,
    bio: String,
    web3_address: String,
    web3_provider: String,
    network_id: String,
    meta: meta
  }
  type customUser{
    token:String,
    user:User
  },
  input Pagination {
    query:String,
    argument:String
    offset: Int,
    limit: Int,
    sortBy:String,
    descending:Int,
    search:String
    dates:Dates
  }

  input Dates{
    gte:String,
    lt:String,
    bool:Boolean
  }
  
  scalar ISODate
`;

const resolvers = { Query, Mutation, ISODate };

export { typeDefs, resolvers }  