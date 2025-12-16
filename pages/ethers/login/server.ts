import { ethers } from "ethers";

interface User {
  address: string;
  nonce: number;
}

export const users: {
  [key: string]: User;
} = {};

export function auth(address: string) {
  let user = users[address]
  if (!user) {
    user = {
      address,
      nonce: Math.floor(Math.random() * 10000000)
    }
    users[address] = user
  } else {
    const nonce = Math.floor(Math.random() * 10000000)
    user.nonce = nonce
    users[address] = user
  }
  return user.nonce
}

export function verify(address: string, signature: string) {
  let signValid = false
  //从数据库中取出nonce
  const nonce = users[address].nonce
  //验证对nonce进行签名的地址
  const decodedAddress = ethers.verifyMessage(nonce.toString(), signature.toString())
  //比较地址和签名的地址是否一致
  if (address.toLowerCase() === decodedAddress.toLowerCase()) {
    signValid = true
    //出于安全原因，更改nonce，防止下次直接使用相同的nonce进行登录
    users[address].nonce = Math.floor(Math.random() * 10000000)
  }
  return signValid
}

