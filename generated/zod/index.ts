import { z } from 'zod';
import type { Prisma } from '../prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','walletAddress','fullName','email','phone','role','companyId','createdAt','updatedAt']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','type','companyName','location','protectedKey']);

export const ActivityLogScalarFieldEnumSchema = z.enum(['id','batchId','description','timestamp']);

export const BatchScalarFieldEnumSchema = z.enum(['id','blockchainId','plantTxHash','harvestTxHash','productName','productVariety','category','quantity','unit','status','minTemperature','maxTemperature','minHumidity','maxHumidity','imageUrl','farmerId','harvestDate','expiryDate','createdAt','updatedAt','retailCompanyId','shipperCompanyId']);

export const StepTransitScalarFieldEnumSchema = z.enum(['id','batchId','shipperId','txHash','fromLocation','toLocation','temperature','humidity','vehicleNumber','departureTime','arrivalTime']);

export const QualityTestScalarFieldEnumSchema = z.enum(['id','batchId','retailerId','txHash','isPassed','note','testedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['FARMER','SHIPPER','RETAILER','CONSUMER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const OrganizationTypeSchema = z.enum(['FARMER','SHIPPER','RETAILER']);

export type OrganizationTypeType = `${z.infer<typeof OrganizationTypeSchema>}`

export const BatchStatusSchema = z.enum(['PLANTED','HARVESTED','IN_TRANSIT','TESTING','RETAILING','SOLD','ABORTED']);

export type BatchStatusType = `${z.infer<typeof BatchStatusSchema>}`

export const CategorySchema = z.enum(['VEGETABLE','FRUIT','GRAIN','BEAN','HERB','OTHER']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.uuid(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  companyId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const CompanySchema = z.object({
  type: OrganizationTypeSchema,
  id: z.uuid(),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
})

export type Company = z.infer<typeof CompanySchema>

/////////////////////////////////////////
// ACTIVITY LOG SCHEMA
/////////////////////////////////////////

export const ActivityLogSchema = z.object({
  id: z.uuid(),
  batchId: z.string(),
  description: z.string(),
  timestamp: z.coerce.date(),
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>

/////////////////////////////////////////
// BATCH SCHEMA
/////////////////////////////////////////

export const BatchSchema = z.object({
  category: CategorySchema,
  status: BatchStatusSchema,
  id: z.uuid(),
  blockchainId: z.string(),
  plantTxHash: z.string().nullable(),
  harvestTxHash: z.string().nullable(),
  productName: z.string(),
  productVariety: z.string(),
  quantity: z.number().nullable(),
  unit: z.string(),
  minTemperature: z.number(),
  maxTemperature: z.number(),
  minHumidity: z.number(),
  maxHumidity: z.number(),
  imageUrl: z.string(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().nullable(),
  expiryDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  retailCompanyId: z.string().nullable(),
  shipperCompanyId: z.string().nullable(),
})

export type Batch = z.infer<typeof BatchSchema>

/////////////////////////////////////////
// STEP TRANSIT SCHEMA
/////////////////////////////////////////

export const StepTransitSchema = z.object({
  id: z.uuid(),
  batchId: z.string(),
  shipperId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().nullable(),
  humidity: z.number().nullable(),
  vehicleNumber: z.string().nullable(),
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date().nullable(),
})

export type StepTransit = z.infer<typeof StepTransitSchema>

/////////////////////////////////////////
// QUALITY TEST SCHEMA
/////////////////////////////////////////

export const QualityTestSchema = z.object({
  id: z.uuid(),
  batchId: z.string(),
  retailerId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean(),
  note: z.string().nullable(),
  testedAt: z.coerce.date(),
})

export type QualityTest = z.infer<typeof QualityTestSchema>
