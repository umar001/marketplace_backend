
import { promisify } from '../helpers';
import { User } from '../models/index.js';
import ISODate from '../scalars/ISODate';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const paramHandler = (qry) => {
  let param = {}
  if (qry.argument && qry.query) param = { [qry.argument]: { '$regex': qry.query } }
  if (qry.dates) {
    const gte = qry.dates.gte ? new Date(qry.dates.gte) : null
    let lt = qry.dates.lt ? new Date(qry.dates.lt) : null
    param.updatedAt = {}
    if (gte) param.meta.updatedAt.$gte = gte
    if (lt) {
      param.meta.updatedAt.$lte = lt.setDate(lt.getDate() + 1)
    }
  }
  return param
};

const resolvers = {

  /************ */
  //    
  //    Users
  // 
  /************ */
  user: (_, args) => promisify(User.findById(args.id)),
  users: async (_, args, { me }) => new Promise(async (resolve, reject) => {
    const param = paramHandler(args.query)
    User.find(param, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).skip(args.query.offset).limit(args.query.limit)
  }),

  userCount: () => promisify(User.count()),
  me: async (_, args, { me }) => {
    if (!me) throw new Error('You are not authenticated!')// make sure user is logged in
    return await User.findById(me.id) // user is authenticated
  },

};

export default resolvers;