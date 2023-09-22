import { createUserMutation, getUserQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";

// Check project mode, is in production mode?
const isProduction = process.env.NODE_ENV === "production";
// Create grafbase api url
const apiUrl = isProduction
  ? process.env.GRAFBASE_APP_URL || ""
  : "http://127.0.0.1:4000/graphql";
// Create grafbase api key
const apiKey = isProduction ? process.env.GRAFBASE_API_KEY || "" : "letmein";
// Create server url
const serverUrl = isProduction
  ? process.env.SERVER_URL || ""
  : "http://localhost:3000";

// Create client
const client = new GraphQLClient(apiUrl);

// Graphql request maker
const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    return client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

// Make getUser action
export const getUser = (email: string) => {
  // Set api-key
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

// Make createUser action
export const createuser = (name: string, email: string, avatarUrl: string) => {
  // Set api-key
  client.setHeader("x-api-key", apiKey);

  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};
