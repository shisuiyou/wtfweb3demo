'use client';

import {ethers} from "ethers";
import {useEffect} from 'react';

declare const window: any;



export default function () {
  useEffect(() => {

    // 获得provider
    const provider = new ethers.BrowserProvider(window.ethereum);

    (async function init() {

      // 读取钱包地址
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0]
      console.log(`钱包地址: ${account}`);

      // 读取chainid
      const { chainId } = await provider.getNetwork()
      console.log(`chainid: ${chainId}`)

      // 读取ETH余额
      const signer = await provider.getSigner()
      const balance = await provider.getBalance(signer.getAddress());
      console.log(`以太坊余额： ${ethers.formatUnits(balance)}`, balance);

    })()
  });
}
