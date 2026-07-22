import { useMemo } from 'react';
import { useTransactionReceipt } from 'wagmi';
import { decodeEventLog, ExtractAbiItemNames } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { ABI } from '@/blockchain/abis/type';

const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs',
  'https://ipfs.io/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
  'https://dweb.link/ipfs',
];

async function fetchIpfsData<T = any>(ipfsHash: string): Promise<T> {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const res = await fetch(`${gateway}/${ipfsHash}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      continue;
    }
  }
  throw new Error('Tất cả IPFS Gateways đều không phản hồi');
}

type AgriTraceEventName = ExtractAbiItemNames<typeof ABI>;

export function useIpfsFromTx<T = any>(txHash: `0x${string}` | undefined, eventName: AgriTraceEventName) {
  const {
    data: receipt,
    isLoading: isTxLoading,
    isError: isTxError
  } = useTransactionReceipt({
    hash: txHash,
  });

  const ipfsHash = useMemo(() => {
    if (!receipt || !receipt.logs.length) return null;

    for (const log of receipt.logs) {
      try {
        const decodedLog = decodeEventLog({
          abi: ABI,
          data: log.data,
          topics: log.topics,
        });
        if(decodedLog.eventName === eventName) {
          const args = decodedLog.args as Record<string, any>;

          // Lấy trường ipfsHash (hoặc ipfs, hash) nếu có trong args
          return args.ipfsHash || args.ipfs || args.ipfsMeta || null;
        }
      } catch {
        continue;
      }
    }
    return null;
  }, [receipt, eventName]);

  const {
    data: ipfsData,
    isLoading: isIpfsLoading,
    isError: isIpfsError,
    error,
  } = useQuery<T>({
    queryKey: ['ipfs-data-from-tx', ipfsHash],
    queryFn: () => fetchIpfsData<T>(ipfsHash!),
    enabled: !!ipfsHash,
    staleTime: Infinity,
  });

  return {
    ipfsHash,
    ipfsData: ipfsData ?? null, // Dữ liệu Object đã sẵn sàng xài
    isLoading: isTxLoading || (!!ipfsHash && isIpfsLoading),
    isError: isTxError || isIpfsError,
    errorMessage: error ? (error as Error).message : null,
  };
}