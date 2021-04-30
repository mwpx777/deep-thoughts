// this is an object with Query nested object that holds a series of methods
// 'helloworld' method needs to be same name as Query in typeDefs

const{User, Thought} = require('../models');

const resolvers = {
  Query: {
    thoughts: async (parent, {username}) => {
      // check if username exists, if so, set it to params, if not, return empty object
      const params = username ? {username} : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, {_id}) => {
      return Thought.findOne({_id});
    },
    users: async () => {
      return User.find()
      .select('-__v -password')
      .populate('friends')
      .populate('thoughts');
    },
    user: async(parent, {username}) => {
      return User.findOne({username})
      .select('-__v -password')
      .populate('friends')
      .populate('thoughts');
    }
  }
};
  
  module.exports = resolvers;