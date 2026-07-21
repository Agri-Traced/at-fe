'use client';

import { ConnectButton, Connector } from '@ant-design/web3';
const ConnectWalletButton = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Connector>
        <ConnectButton />
      </Connector>
    </div >
  );
};

export default ConnectWalletButton;