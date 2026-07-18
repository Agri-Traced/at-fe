'use client';

import { useState } from 'react';
import { Button, Modal, Spin, Result } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { Web3 } from 'web3';
import api from '@/lib/axios';
import { ABI } from '@/blockchain/abis/type';

interface VerifyModalProps {
  blockchainId: string;
  web2Data: {
    productName: string;
    ipfsHash: string;
  };
}

export default function VerificationBox({ blockchainId, web2Data }: VerifyModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);

  const runReconciliation = async () => {
    setVerifying(true);
    setStatus('idle');
    setLog([]);
    const steps: string[] = [];

    try {
      // BƯỚC 1: Kết nối RPC Blockchain
      steps.push("🔌 Kết nối cổng mạng blockchain Sepolia...");
      setLog([...steps]);
      const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!));
      const contract = new web3.eth.Contract(ABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

      // BƯỚC 2: Truy vấn dữ liệu On-chain từ Smart Contract
      steps.push(`🔍 Đang truy vấn lô hàng #${blockchainId} trên Smart Contract...`);
      setLog([...steps]);
      const onChainBatch: any = await contract.methods.batches(blockchainId).call();
      const onChainIpfsHash = onChainBatch.ipfsHash;

      steps.push(`🛰️ On-chain IPFS Hash tìm thấy: ${onChainIpfsHash}`);
      setLog([...steps]);

      // BƯỚC 3: Đối chiếu mã hash giữa Web2 Database và Web3 Smart Contract
      steps.push("⚖️ Tiến hành đối chiếu mã băm (Hash Comparison)...");
      setLog([...steps]);
      if (onChainIpfsHash !== web2Data.ipfsHash) {
        throw new Error("Mã băm IPFS trên cơ sở dữ liệu không trùng khớp với dữ liệu gốc trên Smart Contract!");
      }
      steps.push("✅ Xác thực bước 1: Mã băm Web2 và Web3 trùng khớp 100%.");
      setLog([...steps]);

      // BƯỚC 4: Gọi trực tiếp lên Pinata Gateway để tải Metadata gốc về đối soát
      steps.push("📦 Đang tải tệp tin gốc từ mạng phi tập trung IPFS Pinata...");
      setLog([...steps]);

      const pinataResponse = await api.get(`https://gateway.pinata.cloud/ipfs/${onChainIpfsHash}`);
      const ipfsMetadata = pinataResponse.data; // File JSON lưu: { productName: "...", ... }

      steps.push(`📄 Tải tệp thành công! Tên nông sản gốc trên IPFS: "${ipfsMetadata.productName}"`);
      setLog([...steps]);

      // BƯỚC 5: Đối chiếu chéo nội dung Metadata
      steps.push("⚖️ Đối chiếu thông tin nội dung sản phẩm...");
      setLog([...steps]);
      if (ipfsMetadata.productName !== web2Data.productName) {
        throw new Error(`Cảnh báo: Tên sản phẩm trên Web2 là "${web2Data.productName}" nhưng thông tin gốc lưu trên IPFS lại là "${ipfsMetadata.productName}"!`);
      }

      steps.push("🎉 Xác thực bước 2: Toàn bộ thông tin hoàn toàn đồng nhất.");
      setLog([...steps]);
      setStatus('success');
    } catch (error: any) {
      steps.push(`❌ Thất bại: ${error.message || error}`);
      setLog([...steps]);
      setStatus('error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mt-6">
      <Button
        type="primary"
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md"
        onClick={() => { setIsModalOpen(true); runReconciliation(); }}
      >
        <SafetyCertificateOutlined size={18} /> Đối Chiếu Blockchain & IPFS
      </Button>

      <Modal
        title={<span className="font-bold text-lg text-gray-800">Cổng Đối Soát Minh Bạch</span>}
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <div className="py-4">
          {/* Trạng thái Log chạy */}
          <div className="bg-gray-950 text-green-400 font-mono text-xs p-4 rounded-xl max-h-60 overflow-y-auto space-y-2 mb-6">
            {log.map((item, idx) => (
              <p key={idx} className="leading-relaxed">{item}</p>
            ))}
            {verifying && <div className="text-center mt-2"><Spin size="small" /></div>}
          </div>

          {/* Kết quả cuối cùng */}
          {status === 'success' && (
            <Result
              status="success"
              title="Xác Thực Thành Công!"
              subTitle="Thông tin nông sản hiển thị khớp hoàn toàn với dữ liệu mật mã lưu trên Blockchain và IPFS. Đảm bảo 100% tính nguyên bản."
            />
          )}

          {status === 'error' && (
            <Result
              status="error"
              title="Xác Thực Thất Bại"
              subTitle="Phát hiện sự sai lệch dữ liệu giữa máy chủ lưu trữ và mạng Blockchain. Lô hàng này có dấu hiệu bị can thiệp trái phép."
            />
          )}
        </div>
      </Modal>
    </div>
  );
}