import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!, // Lấy JWT từ trang quản trị Pinata
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY! // Cổng mặc định của Pinata
});

export async function createIPFSHash(data: any) {
  try {
    const upload = await pinata.upload.json(data);
    return upload.IpfsHash;
  } catch (error) {
    throw new Error(`Lỗi khi tạo IPFS Hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}