import { prisma } from '../lib/prisma';

async function main() {
  await prisma.$executeRaw`
    INSERT INTO "Company" ("id", "type", "companyName", "location", "protectedKey") 
    VALUES 
    ('FARM', 'FARMER', 'Nông trại Xanh Đà Lạt', 'Lạc Dương, Lâm Đồng', 'FARM123'),
    ('SHIP', 'SHIPPER', 'ColdChain Logistics', 'Quận 7, TP.HCM', 'SHIP123'),
    ('RETAIL', 'RETAILER', 'Siêu thị FreshMart', 'Quận 1, TP.HCM', 'RETAIL123')
    ON CONFLICT ("id") DO NOTHING;
  `;
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());