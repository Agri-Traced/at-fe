'use client';

import { useAuth } from "@/contexts/auth";
import { ConnectButton, Connector } from "@ant-design/web3";
import { useEffect, useState } from "react";

function Web3ModalTracker() {
  const { account } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!account) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [account]);

  return (
    <Connector
      modalProps={{
        open: open,
        closable: false,
        maskClosable: false,
        keyboard: false,
      }}
    >
      <ConnectButton style={{ display: 'none' }} />
    </Connector>
  );
}

export default function NeedWalletLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  )
}