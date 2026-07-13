'use client';

import { ConnectButton, Connector } from '@ant-design/web3';
import {
  useEthersProvider,
  useEthersSigner,
} from '@ant-design/web3-ethers';
import { useBlockNumber } from '@ant-design/web3-ethers/wagmi';
import { Typography } from 'antd';

const AddressPreviewer = () => {
  const provider = useEthersProvider(); // ethers provider
  const signer = useEthersSigner();
  const blockNumber = useBlockNumber();

  return (
    <Typography.Paragraph>
      address: {signer?.address ?? '-'} (at {Number(blockNumber.data)})
    </Typography.Paragraph>
  );
};

const ConnectWalletButton = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Connector>
        <ConnectButton />
      </Connector>
      <AddressPreviewer />
    </div >
  );
};

export default ConnectWalletButton;