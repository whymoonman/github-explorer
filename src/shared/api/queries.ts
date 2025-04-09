import {gql} from "@apollo/client";

export const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          ... on Repository {
            id
            name
            description
            stargazerCount
            url
            owner {
              login
              avatarUrl
              url
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  committedDate
                  message
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      description
      stargazerCount
      url
      createdAt
      updatedAt
      owner {
        login
        avatarUrl
        url
      }
      defaultBranchRef {
        target {
          ... on Commit {
            committedDate
            message
            author {
              name
              email
              date
            }
          }
        }
      }
      languages(first: 10) {
        edges {
          node {
            name
            color
          }
        }
      }
      issues {
        totalCount
      }
      pullRequests {
        totalCount
      }
      watchers {
        totalCount
      }
    }
  }
`;