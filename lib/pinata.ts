import { PinataSDK } from "pinata-web3";

console.log("JWT Pinata:", process.env.NEXT_PUBLIC_PINATA_JWT);

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!, // Lấy JWT từ trang quản trị Pinata
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY! // Cổng mặc định của Pinata
});

export async function createBatchIPFSHash(batchData: any) {
  try {
    // 1. Upload chuỗi dữ liệu JSON của lô hàng lên IPFS
    const upload = await pinata.upload.json(batchData);
    console.log("IPFS Hash của bạn:", upload.IpfsHash);
    return upload.IpfsHash;
    // Kết quả dạng: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
  } catch (error) {
    console.error("Lỗi upload IPFS:", error);
  }
}