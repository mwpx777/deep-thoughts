// this will store all of the GraphQL query requests

import gql from 'graphql-tag';

export const QUERY_THOUGHTS = gql`
  query thoughts($username: String!){
      thoughts(username: $username){
          _id
          thoughtText
          createdAt
          username
          reactionCount
          reactions{
              _id
              createdAt
              username
              reactionBody
          }
      }
  }
  `;