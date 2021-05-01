// this is an object with Query nested object that holds a series of methods
// 'helloworld' method needs to be same name as Query in typeDefs

const { User, Thought } = require('../models');
// Auth error message
const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require('../utils/auth');
const { ContextualizedQueryLatencyStats } = require('apollo-reporting-protobuf');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // this will check for context.user
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends')

        return userData;
      }
      // if no context.user, throw error
      throw new AuthenticationError('Not logged in')
    },
    thoughts: async (parent, { username }) => {
      // check if username exists, if so, set it to params, if not, return empty object
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      // check to see if user is logged in first, otherwise throw Auth error message
      if(context.user){
        const thought= await Thought.create({...args, username: context.user.username});

        await User.findByIdAndUpdate(
          {_id: context.user._id },
          {$push: {thoughts: thought._id}},
          // this returns the new thought with added thought 
          {new:true}
          );
          return thought;
      }
      throw new AuthenticationError('You need to be logged in')
    },

    // the args are {thoughtId, reactionBody}
    addReaction: async (parent, {thoughtId, reactionBody}, context) => {
      if (context.user){
        const updatedThought = await Thought.findOneAndUpdate(
          {_id: thoughtId},
          // reactions are an array in thoughts, so you are creating an object with new reaction to push to the reactions array in thoughts
          {$push: {reactions: {reactionBody, username: context.user.username}}},
          {new: true, runValidators: true}
        );
        return updatedThought;
      }
      throw new AuthenticationError('You need to be logged in')
    },

    addFriend: async (parent, {friendId}, context) =>{
      if (context.user){
        const updatedUser = await User.findOneAndUpdate(
          {_id: context.user._id},
          {$addToSet: {friends: friendId}},
          {new:true}
        ).populate('friends');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in')
    }
  }
};

module.exports = resolvers;