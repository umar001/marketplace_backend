import mongoose from 'mongoose';
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

import { Order, User } from '../models/index';
import { promisify } from '../helpers';
import { generateUUID } from '../helpers';
import Web3 from 'web3';
import { signMessageText } from '../helpers';
const ObjectId = mongoose.Types.ObjectId;
const PROVIDER = 'https://data-seed-prebsc-1-s1.binance.org:8545'
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER))

const resolvers = {
  orders: (user, args) => promisify(Order.find({ _id: { $in: user.orders } }))


};

export default resolvers;


export const mutation = {
  signup: (_, { web3_address, web3_provider, network_id }, { me, secret }) => new Promise(async (resolve, reject) => {

    const user = await User.findOne({ $or: [{ web3_address }] })
    if (user) reject('user already exist');
    const nonce = generateUUID()
    const createUser = {
      web3_address,
      web3_provider,
      network_id,
      nonce,
    }
    const newUser = await User.create({ web3_address, web3_provider, network_id, nonce })
    const token = await createToken({ id: newUser.id, nonce: newUser.nonce, web3_address: newUser.web3_address }, secret, '1y')
    resolve({ token, web3_address: newUser.web3_address, nonce: newUser.nonce, meta: newUser.meta });
  }),
  walletNonce: (_, { web3_address, web3_provider, network_id }, { me, secret }) => new Promise(async (resolve, reject) => {

    let user = await User.findOne({ $or: [{ web3_address }] })
    const nonce = generateUUID()
    if (user) {
      const param = {
        web3_provider,
        network_id,
        nonce,
      }
      user = await User.findByIdAndUpdate(user.id, { $set: { ...param } })
      resolve({ web3_address: user.web3_address, nonce, meta: user.meta });
    } else {
      const newUser = await User.create({ web3_address, web3_provider, network_id, nonce })
      resolve({ web3_address: newUser.web3_address, nonce, meta: newUser.meta });
    }
  }),
  walletSignin: (_, { web3_address, txHash }, { me, secret }) => new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ $or: [{ web3_address }] })
      if (user) {
        let message = signMessageText(user.web3_address, user.nonce)
        const recoveredAddr = web3.eth.accounts.recover(message, txHash);
        console.log(recoveredAddr, txHash)
        if (recoveredAddr !== user.web3_address) throw new Error('Incorrect Signature')
        const token = await createToken({ id: user.id, web3_address: user.web3_address }, secret, '24h')
        resolve({ token, web3_address: user.web3_address, meta: user.meta });
      }
    } catch (error) {
      reject(error);
    }
  }),
  login: (_, { email, password }, { me, secret }) => new Promise(async (resolve, reject) => {

    const user = await User.findOne({ email })
    if (!user) throw new Error('No user with that email')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Incorrect password')
    const token = await createToken({ id: user.id, email: user.email, role: user.role, username: user.username }, secret, '1y')
    resolve({ token, user });

  }),
  updateUser: (_, { id, username, email, password, role }, { me, secret }) => new Promise(async (resolve, reject) => {
    try {
      let param = { username, email, role }
      if (password) param.password = await bcrypt.hash(password, 10)
      const user = await User.findByIdAndUpdate(id, { $set: { ...param } })

      createToken({ id: user.id, role: user.role, username: user.username }, secret, '1y')
        .then((result) => {
          resolve(result);
        })

    } catch (error) {
      reject(error);
    }
  })
}
// _________  //

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jsonwebtoken.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};