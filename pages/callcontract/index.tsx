import React, { useEffect } from 'react';
import { Address, ConnectButton, Connector, NFTCard, useAccount } from '@ant-design/web3';
import { Mainnet, MetaMask, WagmiWeb3ConfigProvider } from '@ant-design/web3-wagmi';
import { Button, message } from 'antd';
import { parseEther } from 'viem';
import { WagmiProvider, http, createConfig, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const CONTRACT_ADDRESS = '0xEcd0D12E21805803f70de03B72B1C162dB0898d9';

// 1. 创建 React Query 客户端 (Wagmi 必需)
const queryClient = new QueryClient();

const CallTest = () => {
  const { account } = useAccount();
  const result = useReadContract({
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ],
    address: CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: [account?.address as `0x${string}`],
  });
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      message.success('Mint Success');
      result.refetch();
    }
  }, [isConfirmed]);

  return (
    <div>
      {result.data?.toString()}
      <Button
        loading={isConfirming}
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: 'function',
                  name: 'mint',
                  stateMutability: 'payable',
                  inputs: [
                    {
                      internalType: 'uint256',
                      name: 'quantity',
                      type: 'uint256',
                    },
                  ],
                  outputs: [],
                },
              ],
              address: CONTRACT_ADDRESS,
              functionName: 'mint',
              args: [BigInt(1)],
              value: parseEther('0.00001'),
            },
            {
              onError: (err) => {
                message.error(err.message);
              },
            },
          );
        }}
      >
        mint
      </Button>
    </div>
  );
};

const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

export default function Web3() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <WagmiWeb3ConfigProvider wallets={[MetaMask()]}>
          <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
          <NFTCard address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" tokenId={641} />
          <Connector>
            <ConnectButton />
          </Connector>
          <CallTest />
        </WagmiWeb3ConfigProvider>
      </WagmiProvider>
    </QueryClientProvider>


  );
}