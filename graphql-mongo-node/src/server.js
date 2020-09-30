import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schemas from './schemas';
import resolvers from './resolvers';

import userModel from './models/User';
import postModel from './models/Post';

const app = express();
app.use(cors());

const getUser = async (req) => {
  const token = req.headers['token'];

  if (token) {
    try {
      return jwt.verify(token, 'riddlemethis');
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      const me = await getUser(req);

      return {
        me,
        models: {
          userModel,
          postModel,
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

app.listen(5000, () => {
  mongoose.connect('mongodb://localhost:27017/graphql', dbOptions);
});