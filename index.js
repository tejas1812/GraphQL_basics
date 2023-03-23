import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: Int
    title: String
    author: String
  }

  
  type Query {
    books: [Book]
    hello: String
  }
  type Mutation {
    createBook(title: String, author: String): Book
  }
`;

const books = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
  },
  {
    id: 2,
    title: 'Dune',
    author: 'Frank Herbert',
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    hello: () => "Hello CSCI-5828",
  },
  Mutation: {
    createBook: (parent, args) => {
      const newBook = {
        id: books.length + 1,
        title: args.title,
        author: args.author,
      };

      books.push(newBook);

      return newBook;
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
