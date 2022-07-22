import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');



export const uuidValidateV4 = (uuid) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}



export const isAdmin = (parent, args, { me }) => {
  if (me && me.role === "admin") {
    return skip
  } else {
    return new ForbiddenError('Not admin user.');
  }
}