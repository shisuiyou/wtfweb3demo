import {ethers} from "ethers";
import {useEffect, useState} from "react";
// const provider = ethers.getDefaultProvider();

const ALCHEMY_MAINNET_URL = 'https://rpc.mevblocker.io';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

export default function Web3(){
  const [balance, setBalance] = useState<bigint>(0);
  useEffect(() => {
    const main = async () => {
      const balance = await provider.getBalance(`vitalik.eth`);
      console.log('balance:', balance);
      setBalance(balance);
    }
    main();

    (async () => {
      const txCount = await provider.getTransactionCount("vitalik.eth");
      console.log('getTransactionCount', txCount);
    })();

    (async () => {
      const network = await provider.getNetwork();
      console.log('getNetwork', network.toJSON());
    })();

  }, []);

  return (
    <div>
      {`ETH Balance of vitalik: ${ethers.formatEther(balance as bigint)} ETH`}
    </div>
  )
}
