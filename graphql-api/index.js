const { ApolloServer, gql } = require("apollo-server");

async function main() {
  // get the client
  const mysql = require("mysql2/promise");
  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "graphqltest",
  });
  // query database
  const [rows, fields] = await connection.execute(
    "SELECT * FROM `attractions`"
  );

  const typeDefs = gql`
    type Attraction {
      id: Int
      name: String
      detail: String
      coverimage: String
      latitude: Float
      longtitude: Float
    }
    type Query {
      attractions: [Attraction]
      attraction(id: Int!): [Attraction]
    }
  `;

  const resolvers = {
    Query: {
      attractions: async () => {
        const [rows, fields] = await connection.execute(
          "SELECT * FROM `attractions`"
        );
        return rows;
      },
      attraction: async (parent,{id}) => {
        const [rows, fields] = await connection.execute(
          "SELECT * FROM `attractions` WHERE id=?",
          [id]
        );
        if (rows.length > 0) {
          return rows[0];
        } else {
          return [];
        }
      },
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded0",
  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  });
}

main();
