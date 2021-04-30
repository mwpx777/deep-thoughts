// this is an object with Query nested object that holds a series of methods
// 'helloworld' method needs to be same name as Query in typeDefs

const resolvers = {
    Query: {
      helloWorld: () => {
        return 'Hello world!';
      }
    }
  };
  
  module.exports = resolvers;