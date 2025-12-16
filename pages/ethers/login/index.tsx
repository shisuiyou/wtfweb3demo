'use client';

import {useEffect, useState} from "react";

import { ethers } from "ethers";

import {
  auth,
  verify
} from './server';

declare const window: any;

const ALCHEMY_GOERLI_URL = 'https://eth.blockrazor.xyz';
const JRprovider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

export default function Web3() {
  useEffect(() => {

    const main = async () => {

    }

    main();

  }, []);

  const handleLogin = async () => {
    // 获得provider
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    // 读取钱包地址
    const accounts = await browserProvider.send("eth_requestAccounts", []);
    const account = accounts[0];
    console.log(`钱包地址: ${account}`);

    //从后台获取需要进行签名的数据
    const nonce = auth(account);
    console.log(`获取后台需要签名的数据: ${nonce}`);
    //签名
    const signer = await browserProvider.getSigner(account);
    const signature = await signer.signMessage(nonce.toString());
    //去后台验证签名，完成登录
    const signStatus = verify(account, signature);
    console.log(`状态：${signStatus}`);
  };

  return (
    <div onClick={handleLogin}>
      登录
    </div>
  )
}

