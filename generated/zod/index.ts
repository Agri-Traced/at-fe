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

export const ActivityLogScalarFieldEnumSchema = z.enum(['id','batchId','description','timestamp']);

export const BatchScalarFieldEnumSchema = z.enum(['id','blockchainId','plantTxHash','harvestTxHash','shipTxHash','productName','productVariety','category','quantity','unit','status','farmerProcessId','shipperProcessId','retailerProcessId','minTemperature','maxTemperature','minHumidity','maxHumidity','imageUrl','farmerId','harvestDate','expiryDate','createdAt','updatedAt','retailCompanyId','shipperCompanyId']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','type','companyName','location','protectedKey']);

export const ProcessTemplateScalarFieldEnumSchema = z.enum(['id','companyId','name','description','type','createdAt','updatedAt']);

export const StepTemplateScalarFieldEnumSchema = z.enum(['id','processTemplateId','stepOrder','title','description','dayOffset','isRequired']);

export const StepTransitScalarFieldEnumSchema = z.enum(['id','batchId','shipperId','txHash','fromLocation','toLocation','temperature','humidity','vehicleNumber','departureTime']);

export const QualityTestScalarFieldEnumSchema = z.enum(['id','batchId','retailerId','txHash','isPassed','note','testedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['FARMER','SHIPPER','RETAILER','CONSUMER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const BatchStatusSchema = z.enum(['PLANTED','HARVESTED','IN_TRANSIT','TESTING','RETAILING','SOLD','ABORTED']);

export type BatchStatusType = `${z.infer<typeof BatchStatusSchema>}`

export const CategorySchema = z.enum(['VEGETABLE','FRUIT','GRAIN','BEAN','HERB','OTHER']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

export const OrganizationTypeSchema = z.enum(['FARMER','SHIPPER','RETAILER']);

export type OrganizationTypeType = `${z.infer<typeof OrganizationTypeSchema>}`

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
  shipTxHash: z.string().nullable(),
  productName: z.string(),
  productVariety: z.string(),
  quantity: z.number().nullable(),
  unit: z.string(),
  farmerProcessId: z.string().nullable(),
  shipperProcessId: z.string().nullable(),
  retailerProcessId: z.string().nullable(),
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
// PROCESS TEMPLATE SCHEMA
/////////////////////////////////////////

export const ProcessTemplateSchema = z.object({
  type: OrganizationTypeSchema,
  id: z.uuid(),
  companyId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProcessTemplate = z.infer<typeof ProcessTemplateSchema>

/////////////////////////////////////////
// STEP TEMPLATE SCHEMA
/////////////////////////////////////////

export const StepTemplateSchema = z.object({
  id: z.uuid(),
  processTemplateId: z.string(),
  stepOrder: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  dayOffset: z.number().int(),
  isRequired: z.boolean(),
})

export type StepTemplate = z.infer<typeof StepTemplateSchema>

/////////////////////////////////////////
// STEP TRANSIT SCHEMA
/////////////////////////////////////////

export const StepTransitSchema = z.object({
  id: z.uuid(),
  batchId: z.string(),
  shipperId: z.string(),
  txHash: z.string().nullable(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number(),
  humidity: z.number(),
  vehicleNumber: z.string(),
  departureTime: z.coerce.date(),
})

export type StepTransit = z.infer<typeof StepTransitSchema>

/////////////////////////////////////////
// QUALITY TEST SCHEMA
/////////////////////////////////////////

export const QualityTestSchema = z.object({
  id: z.uuid(),
  batchId: z.string(),
  retailerId: z.string(),
  txHash: z.string().nullable(),
  isPassed: z.boolean(),
  note: z.string(),
  testedAt: z.coerce.date(),
})

export type QualityTest = z.infer<typeof QualityTestSchema>
