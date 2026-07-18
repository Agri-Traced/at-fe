import { PinataSDK } from "pinata-web3";

console.log("JWT Pinata:", process.env.NEXT_PUBLIC_PINATA_JWT);

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!, // Lấy JWT từ trang quản trị Pinata
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY! // Cổng mặc định của Pinata
});

export async function createIPFSHash(data: any) {
  try {
    const upload = await pinata.upload.json(data);
    console.log("IPFS Hash của bạn:", upload.IpfsHash);
    return upload.IpfsHash;
  } catch (error) {
    console.error("Lỗi upload IPFS:", error);
  }
}