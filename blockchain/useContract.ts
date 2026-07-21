'use client';

import { useWriteContract, useConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { ABI } from './abis/type';
import { ContractFunctionArgs } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

type FunctionName = Extract<(typeof ABI)[number], { type: 'function', stateMutability: 'nonpayable' | 'payable' }>['name'];
type ReadFunctionNames = Extract<(typeof ABI)[number], { type: 'function'; stateMutability: 'view' | 'pure' }>['name'];


export function useContract() {
  const { t } = useTranslation();
  const { notification } = App.useApp();
  const { writeContractAsync, isPending } = useWriteContract();
  const config = useConfig();

  const executeWrite = async (functionName: FunctionName, args: ContractFunctionArgs<typeof ABI, 'nonpayable' | 'payable', FunctionName>) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Smart contract address is not defined in environment variables");
    }
    try {
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName,
        args,
      });
      return txHash;
    } catch (error: any) {
      const isRejected = error?.message?.includes('User rejected') || error?.code === 4001;

      if (isRejected) {
        notification.error({
          message: t('You have rejected the transaction on your wallet.'),
          showProgress: true,
          placement: 'bottomRight'
        });
      } else {
        notification.error({
          message: `${t('An error occurred while interacting with the blockchain. ')} ${error.message}`,
          showProgress: true,
          placement: 'bottomRight'
        });
      }
      throw error;
    }
  };

  const executeRead = async (
    functionName: ReadFunctionNames
  ) => {
    if (!CONTRACT_ADDRESS) {
      throw new Error("Smart contract address is not defined in environment variables");
    }
    try {
      const data = await readContract(config, {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName,
      });
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    executeWrite,
    executeRead,
    loading: isPending
  };
}