import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { product_name, ipfs, address } = await req.json();

  const result = await prisma.batch.create({
    data: {
      productName: product_name,
      ipfsHash: ipfs,
      owner: address
    }
  });

  return Response.json({ success: true, data: result });
}