import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { ApolloServer, AuthenticationError, graphiqlExpress, graphqlExpress } from 'apollo-server-express';
const jwt = require('jsonwebtoken')
import { typeDefs, resolvers } from './schema';
import { v4 as uuidv4, parse as uuidParse, validate as uuidValidate } from 'uuid';
import { uuidValidateV4 } from "./resolvers/authorization"


mongoose.connect('mongodb://localhost:27017/local');
require('dotenv').config()


const app = express();
app.use(cors());
app.use(bodyParser.json())
app.set('port', process.env.APP_PORT || 3000);
app.set('host', process.env.APP_HOST || 'localhost')

const Authorization = async req => {
    let token = req.headers.authorization
    console.log("___token", req.headers.authorization)
    if (token || token == 'null') {
        try {
            if (req.body.operationName == "login") return
            return jwt.verify(token, process.env.JWT_SECRET);// 
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
            );
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: `http://${app.get('host')}:${app.get('port')}/graphql`
    },
    context: async ({ req }) => {
        const me = await Authorization(req);
        return {
            me,
            secret: process.env.JWT_SECRET,
        };
    },
});

server.applyMiddleware({ app });

app.listen(app.get('port'), () => console.log(`Application started on port ${app.get('port')} \n\Link: http://${app.get('host')}:${app.get('port')}/graphql`));