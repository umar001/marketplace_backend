
import { mergeResolvers } from "merge-graphql-schemas";

import * as User  from './User';


const resolvers = [User.mutation ];
export default mergeResolvers(resolvers);