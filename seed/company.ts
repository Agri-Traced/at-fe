import { prisma } from '@/lib/prisma';

async function main() {
  await prisma.$executeRaw`
    INSERT INTO "Company" ("id", "type", "companyName", "location", "protectedKey") 
    VALUES 
    ('comp-farm-001', 'FARMER', 'Nông trại Xanh Đà Lạt', 'Lạc Dương, Lâm Đồng', 'SECRET_FARM_123'),
    ('comp-ship-001', 'SHIPPER', 'ColdChain Logistics', 'Quận 7, TP.HCM', 'SECRET_SHIP_456'),
    ('comp-retail-001', 'RETAILER', 'Siêu thị FreshMart', 'Quận 1, TP.HCM', 'SECRET_RETAIL_789')
    ON CONFLICT ("id") DO NOTHING;
  `;
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());