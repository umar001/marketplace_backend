import { v4 as uuidv4 } from 'uuid';

const promisify = query => new Promise((resolve, reject) => {
  query.exec((err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const returnOnError = (operation, alternative) => {
  try {
    return operation();
  } catch (e) {
    return alternative;
  }
};
const v4options = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: 5678,
};
const generateUUID = () => {
  return uuidv4(v4options)
}
const signMessageText = (account, nonce) => {
  const message = `Welcome to DemoNFT!\n\nClick to sign in and accept the DemoNFT Terms of Service: https://demonft.io/tos\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${account}\n\nNonce: ${nonce}`
  return message
}
export { promisify, returnOnError, v4options, generateUUID, signMessageText };