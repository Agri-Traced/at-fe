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

export const ActivityLogScalarFieldEnumSchema = z.enum(['id','batchId','description','timestamp','txHash']);

export const BatchScalarFieldEnumSchema = z.enum(['id','blockchainId','txHash','productName','category','quantity','unit','ipfsHash','status','farmerId','harvestDate','expiryDate','createdAt','updatedAt','retailCompanyId','shipperCompanyId']);

export const StepTransitScalarFieldEnumSchema = z.enum(['id','batchId','shipperId','txHash','fromLocation','toLocation','temperature','humidity','vehicleNumber','statusDetails','departureTime','arrivalTime']);

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
  txHash: z.string(),
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
  txHash: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
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
  statusDetails: z.string().nullable(),
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

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  batchesCreated: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  transports: z.union([z.boolean(),z.lazy(() => StepTransitFindManyArgsSchema)]).optional(),
  qualityTests: z.union([z.boolean(),z.lazy(() => QualityTestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  batchesCreated: z.boolean().optional(),
  transports: z.boolean().optional(),
  qualityTests: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  walletAddress: z.boolean().optional(),
  fullName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  role: z.boolean().optional(),
  companyId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  batchesCreated: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  transports: z.union([z.boolean(),z.lazy(() => StepTransitFindManyArgsSchema)]).optional(),
  qualityTests: z.union([z.boolean(),z.lazy(() => QualityTestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COMPANY
//------------------------------------------------------

export const CompanyIncludeSchema: z.ZodType<Prisma.CompanyInclude> = z.object({
  members: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  shippedBatches: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  retailedBatches: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CompanyArgsSchema: z.ZodType<Prisma.CompanyDefaultArgs> = z.object({
  select: z.lazy(() => CompanySelectSchema).optional(),
  include: z.lazy(() => CompanyIncludeSchema).optional(),
}).strict();

export const CompanyCountOutputTypeArgsSchema: z.ZodType<Prisma.CompanyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CompanyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CompanyCountOutputTypeSelectSchema: z.ZodType<Prisma.CompanyCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  shippedBatches: z.boolean().optional(),
  retailedBatches: z.boolean().optional(),
}).strict();

export const CompanySelectSchema: z.ZodType<Prisma.CompanySelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  companyName: z.boolean().optional(),
  location: z.boolean().optional(),
  protectedKey: z.boolean().optional(),
  members: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  shippedBatches: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  retailedBatches: z.union([z.boolean(),z.lazy(() => BatchFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACTIVITY LOG
//------------------------------------------------------

export const ActivityLogIncludeSchema: z.ZodType<Prisma.ActivityLogInclude> = z.object({
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
}).strict();

export const ActivityLogArgsSchema: z.ZodType<Prisma.ActivityLogDefaultArgs> = z.object({
  select: z.lazy(() => ActivityLogSelectSchema).optional(),
  include: z.lazy(() => ActivityLogIncludeSchema).optional(),
}).strict();

export const ActivityLogSelectSchema: z.ZodType<Prisma.ActivityLogSelect> = z.object({
  id: z.boolean().optional(),
  batchId: z.boolean().optional(),
  description: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  txHash: z.boolean().optional(),
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
}).strict()

// BATCH
//------------------------------------------------------

export const BatchIncludeSchema: z.ZodType<Prisma.BatchInclude> = z.object({
  activities: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  farmer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  retailCompany: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  shipperCompany: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  transits: z.union([z.boolean(),z.lazy(() => StepTransitFindManyArgsSchema)]).optional(),
  qualityTest: z.union([z.boolean(),z.lazy(() => QualityTestArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BatchCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const BatchArgsSchema: z.ZodType<Prisma.BatchDefaultArgs> = z.object({
  select: z.lazy(() => BatchSelectSchema).optional(),
  include: z.lazy(() => BatchIncludeSchema).optional(),
}).strict();

export const BatchCountOutputTypeArgsSchema: z.ZodType<Prisma.BatchCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BatchCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BatchCountOutputTypeSelectSchema: z.ZodType<Prisma.BatchCountOutputTypeSelect> = z.object({
  activities: z.boolean().optional(),
  transits: z.boolean().optional(),
}).strict();

export const BatchSelectSchema: z.ZodType<Prisma.BatchSelect> = z.object({
  id: z.boolean().optional(),
  blockchainId: z.boolean().optional(),
  txHash: z.boolean().optional(),
  productName: z.boolean().optional(),
  category: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unit: z.boolean().optional(),
  ipfsHash: z.boolean().optional(),
  status: z.boolean().optional(),
  farmerId: z.boolean().optional(),
  harvestDate: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  retailCompanyId: z.boolean().optional(),
  shipperCompanyId: z.boolean().optional(),
  activities: z.union([z.boolean(),z.lazy(() => ActivityLogFindManyArgsSchema)]).optional(),
  farmer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  retailCompany: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  shipperCompany: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  transits: z.union([z.boolean(),z.lazy(() => StepTransitFindManyArgsSchema)]).optional(),
  qualityTest: z.union([z.boolean(),z.lazy(() => QualityTestArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BatchCountOutputTypeArgsSchema)]).optional(),
}).strict()

// STEP TRANSIT
//------------------------------------------------------

export const StepTransitIncludeSchema: z.ZodType<Prisma.StepTransitInclude> = z.object({
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
  shipper: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const StepTransitArgsSchema: z.ZodType<Prisma.StepTransitDefaultArgs> = z.object({
  select: z.lazy(() => StepTransitSelectSchema).optional(),
  include: z.lazy(() => StepTransitIncludeSchema).optional(),
}).strict();

export const StepTransitSelectSchema: z.ZodType<Prisma.StepTransitSelect> = z.object({
  id: z.boolean().optional(),
  batchId: z.boolean().optional(),
  shipperId: z.boolean().optional(),
  txHash: z.boolean().optional(),
  fromLocation: z.boolean().optional(),
  toLocation: z.boolean().optional(),
  temperature: z.boolean().optional(),
  humidity: z.boolean().optional(),
  vehicleNumber: z.boolean().optional(),
  statusDetails: z.boolean().optional(),
  departureTime: z.boolean().optional(),
  arrivalTime: z.boolean().optional(),
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
  shipper: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// QUALITY TEST
//------------------------------------------------------

export const QualityTestIncludeSchema: z.ZodType<Prisma.QualityTestInclude> = z.object({
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
  retailer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const QualityTestArgsSchema: z.ZodType<Prisma.QualityTestDefaultArgs> = z.object({
  select: z.lazy(() => QualityTestSelectSchema).optional(),
  include: z.lazy(() => QualityTestIncludeSchema).optional(),
}).strict();

export const QualityTestSelectSchema: z.ZodType<Prisma.QualityTestSelect> = z.object({
  id: z.boolean().optional(),
  batchId: z.boolean().optional(),
  retailerId: z.boolean().optional(),
  txHash: z.boolean().optional(),
  isPassed: z.boolean().optional(),
  note: z.boolean().optional(),
  testedAt: z.boolean().optional(),
  batch: z.union([z.boolean(),z.lazy(() => BatchArgsSchema)]).optional(),
  retailer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fullName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  companyId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  company: z.union([ z.lazy(() => CompanyScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchListRelationFilterSchema).optional(),
  transports: z.lazy(() => StepTransitListRelationFilterSchema).optional(),
  qualityTests: z.lazy(() => QualityTestListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  company: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional(),
  batchesCreated: z.lazy(() => BatchOrderByRelationAggregateInputSchema).optional(),
  transports: z.lazy(() => StepTransitOrderByRelationAggregateInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    walletAddress: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
    walletAddress: z.string(),
  }),
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    walletAddress: z.string(),
    email: z.string(),
  }),
  z.object({
    walletAddress: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  fullName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  companyId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  company: z.union([ z.lazy(() => CompanyScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchListRelationFilterSchema).optional(),
  transports: z.lazy(() => StepTransitListRelationFilterSchema).optional(),
  qualityTests: z.lazy(() => QualityTestListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fullName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  companyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const CompanyWhereInputSchema: z.ZodType<Prisma.CompanyWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompanyWhereInputSchema), z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyWhereInputSchema), z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumOrganizationTypeFilterSchema), z.lazy(() => OrganizationTypeSchema) ]).optional(),
  companyName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  protectedKey: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  members: z.lazy(() => UserListRelationFilterSchema).optional(),
  shippedBatches: z.lazy(() => BatchListRelationFilterSchema).optional(),
  retailedBatches: z.lazy(() => BatchListRelationFilterSchema).optional(),
});

export const CompanyOrderByWithRelationInputSchema: z.ZodType<Prisma.CompanyOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  protectedKey: z.lazy(() => SortOrderSchema).optional(),
  members: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchOrderByRelationAggregateInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchOrderByRelationAggregateInputSchema).optional(),
});

export const CompanyWhereUniqueInputSchema: z.ZodType<Prisma.CompanyWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => CompanyWhereInputSchema), z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyWhereInputSchema), z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumOrganizationTypeFilterSchema), z.lazy(() => OrganizationTypeSchema) ]).optional(),
  companyName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  protectedKey: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  members: z.lazy(() => UserListRelationFilterSchema).optional(),
  shippedBatches: z.lazy(() => BatchListRelationFilterSchema).optional(),
  retailedBatches: z.lazy(() => BatchListRelationFilterSchema).optional(),
}));

export const CompanyOrderByWithAggregationInputSchema: z.ZodType<Prisma.CompanyOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  protectedKey: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CompanyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CompanyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CompanyMinOrderByAggregateInputSchema).optional(),
});

export const CompanyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CompanyScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema), z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema), z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumOrganizationTypeWithAggregatesFilterSchema), z.lazy(() => OrganizationTypeSchema) ]).optional(),
  companyName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  protectedKey: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ActivityLogWhereInputSchema: z.ZodType<Prisma.ActivityLogWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActivityLogWhereInputSchema), z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogWhereInputSchema), z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
});

export const ActivityLogOrderByWithRelationInputSchema: z.ZodType<Prisma.ActivityLogOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  batch: z.lazy(() => BatchOrderByWithRelationInputSchema).optional(),
});

export const ActivityLogWhereUniqueInputSchema: z.ZodType<Prisma.ActivityLogWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ActivityLogWhereInputSchema), z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogWhereInputSchema), z.lazy(() => ActivityLogWhereInputSchema).array() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
}));

export const ActivityLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActivityLogOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActivityLogCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActivityLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActivityLogMinOrderByAggregateInputSchema).optional(),
});

export const ActivityLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActivityLogScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema), z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema), z.lazy(() => ActivityLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  txHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const BatchWhereInputSchema: z.ZodType<Prisma.BatchWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BatchWhereInputSchema), z.lazy(() => BatchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BatchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BatchWhereInputSchema), z.lazy(() => BatchWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  blockchainId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  ipfsHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBatchStatusFilterSchema), z.lazy(() => BatchStatusSchema) ]).optional(),
  farmerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  harvestDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  retailCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  shipperCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogListRelationFilterSchema).optional(),
  farmer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  retailCompany: z.union([ z.lazy(() => CompanyNullableScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional().nullable(),
  shipperCompany: z.union([ z.lazy(() => CompanyNullableScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional().nullable(),
  transits: z.lazy(() => StepTransitListRelationFilterSchema).optional(),
  qualityTest: z.union([ z.lazy(() => QualityTestNullableScalarRelationFilterSchema), z.lazy(() => QualityTestWhereInputSchema) ]).optional().nullable(),
});

export const BatchOrderByWithRelationInputSchema: z.ZodType<Prisma.BatchOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockchainId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  ipfsHash: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  farmerId: z.lazy(() => SortOrderSchema).optional(),
  harvestDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  retailCompanyId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  shipperCompanyId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogOrderByRelationAggregateInputSchema).optional(),
  farmer: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional(),
  transits: z.lazy(() => StepTransitOrderByRelationAggregateInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestOrderByWithRelationInputSchema).optional(),
});

export const BatchWhereUniqueInputSchema: z.ZodType<Prisma.BatchWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    blockchainId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    blockchainId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string().optional(),
  AND: z.union([ z.lazy(() => BatchWhereInputSchema), z.lazy(() => BatchWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BatchWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BatchWhereInputSchema), z.lazy(() => BatchWhereInputSchema).array() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  ipfsHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBatchStatusFilterSchema), z.lazy(() => BatchStatusSchema) ]).optional(),
  farmerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  harvestDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  retailCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  shipperCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogListRelationFilterSchema).optional(),
  farmer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  retailCompany: z.union([ z.lazy(() => CompanyNullableScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional().nullable(),
  shipperCompany: z.union([ z.lazy(() => CompanyNullableScalarRelationFilterSchema), z.lazy(() => CompanyWhereInputSchema) ]).optional().nullable(),
  transits: z.lazy(() => StepTransitListRelationFilterSchema).optional(),
  qualityTest: z.union([ z.lazy(() => QualityTestNullableScalarRelationFilterSchema), z.lazy(() => QualityTestWhereInputSchema) ]).optional().nullable(),
}));

export const BatchOrderByWithAggregationInputSchema: z.ZodType<Prisma.BatchOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockchainId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  ipfsHash: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  farmerId: z.lazy(() => SortOrderSchema).optional(),
  harvestDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiryDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  retailCompanyId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  shipperCompanyId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => BatchCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BatchAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BatchMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BatchMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BatchSumOrderByAggregateInputSchema).optional(),
});

export const BatchScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BatchScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BatchScalarWhereWithAggregatesInputSchema), z.lazy(() => BatchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BatchScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BatchScalarWhereWithAggregatesInputSchema), z.lazy(() => BatchScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  blockchainId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  productName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryWithAggregatesFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  ipfsHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBatchStatusWithAggregatesFilterSchema), z.lazy(() => BatchStatusSchema) ]).optional(),
  farmerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  harvestDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  retailCompanyId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  shipperCompanyId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const StepTransitWhereInputSchema: z.ZodType<Prisma.StepTransitWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => StepTransitWhereInputSchema), z.lazy(() => StepTransitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepTransitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepTransitWhereInputSchema), z.lazy(() => StepTransitWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  shipperId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  temperature: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  humidity: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vehicleNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  statusDetails: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  departureTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  arrivalTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
  shipper: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const StepTransitOrderByWithRelationInputSchema: z.ZodType<Prisma.StepTransitOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  shipperId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  humidity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  vehicleNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  statusDetails: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  departureTime: z.lazy(() => SortOrderSchema).optional(),
  arrivalTime: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  batch: z.lazy(() => BatchOrderByWithRelationInputSchema).optional(),
  shipper: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const StepTransitWhereUniqueInputSchema: z.ZodType<Prisma.StepTransitWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => StepTransitWhereInputSchema), z.lazy(() => StepTransitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepTransitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepTransitWhereInputSchema), z.lazy(() => StepTransitWhereInputSchema).array() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  shipperId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  temperature: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  humidity: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vehicleNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  statusDetails: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  departureTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  arrivalTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
  shipper: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const StepTransitOrderByWithAggregationInputSchema: z.ZodType<Prisma.StepTransitOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  shipperId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  humidity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  vehicleNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  statusDetails: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  departureTime: z.lazy(() => SortOrderSchema).optional(),
  arrivalTime: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => StepTransitCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => StepTransitAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => StepTransitMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => StepTransitMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => StepTransitSumOrderByAggregateInputSchema).optional(),
});

export const StepTransitScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.StepTransitScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => StepTransitScalarWhereWithAggregatesInputSchema), z.lazy(() => StepTransitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepTransitScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepTransitScalarWhereWithAggregatesInputSchema), z.lazy(() => StepTransitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  shipperId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  temperature: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  humidity: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  vehicleNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  statusDetails: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  departureTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  arrivalTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const QualityTestWhereInputSchema: z.ZodType<Prisma.QualityTestWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QualityTestWhereInputSchema), z.lazy(() => QualityTestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QualityTestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QualityTestWhereInputSchema), z.lazy(() => QualityTestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  retailerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isPassed: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  testedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
  retailer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const QualityTestOrderByWithRelationInputSchema: z.ZodType<Prisma.QualityTestOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  retailerId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  isPassed: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  testedAt: z.lazy(() => SortOrderSchema).optional(),
  batch: z.lazy(() => BatchOrderByWithRelationInputSchema).optional(),
  retailer: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const QualityTestWhereUniqueInputSchema: z.ZodType<Prisma.QualityTestWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    batchId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    batchId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string().optional(),
  AND: z.union([ z.lazy(() => QualityTestWhereInputSchema), z.lazy(() => QualityTestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QualityTestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QualityTestWhereInputSchema), z.lazy(() => QualityTestWhereInputSchema).array() ]).optional(),
  retailerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isPassed: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  testedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  batch: z.union([ z.lazy(() => BatchScalarRelationFilterSchema), z.lazy(() => BatchWhereInputSchema) ]).optional(),
  retailer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const QualityTestOrderByWithAggregationInputSchema: z.ZodType<Prisma.QualityTestOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  retailerId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  isPassed: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  testedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => QualityTestCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QualityTestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QualityTestMinOrderByAggregateInputSchema).optional(),
});

export const QualityTestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QualityTestScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QualityTestScalarWhereWithAggregatesInputSchema), z.lazy(() => QualityTestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QualityTestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QualityTestScalarWhereWithAggregatesInputSchema), z.lazy(() => QualityTestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  retailerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isPassed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  testedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutMembersInputSchema),
  batchesCreated: z.lazy(() => BatchCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  companyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  batchesCreated: z.lazy(() => BatchUncheckedCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  batchesCreated: z.lazy(() => BatchUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchUncheckedUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  companyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyCreateInputSchema: z.ZodType<Prisma.CompanyCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserCreateNestedManyWithoutCompanyInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyUncheckedCreateInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyUpdateInputSchema: z.ZodType<Prisma.CompanyUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUpdateManyWithoutCompanyNestedInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const CompanyUncheckedUpdateInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const CompanyCreateManyInputSchema: z.ZodType<Prisma.CompanyCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
});

export const CompanyUpdateManyMutationInputSchema: z.ZodType<Prisma.CompanyUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActivityLogCreateInputSchema: z.ZodType<Prisma.ActivityLogCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
  batch: z.lazy(() => BatchCreateNestedOneWithoutActivitiesInputSchema),
});

export const ActivityLogUncheckedCreateInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
});

export const ActivityLogUpdateInputSchema: z.ZodType<Prisma.ActivityLogUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batch: z.lazy(() => BatchUpdateOneRequiredWithoutActivitiesNestedInputSchema).optional(),
});

export const ActivityLogUncheckedUpdateInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActivityLogCreateManyInputSchema: z.ZodType<Prisma.ActivityLogCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
});

export const ActivityLogUpdateManyMutationInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActivityLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BatchCreateInputSchema: z.ZodType<Prisma.BatchCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateInputSchema: z.ZodType<Prisma.BatchUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUpdateInputSchema: z.ZodType<Prisma.BatchUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchCreateManyInputSchema: z.ZodType<Prisma.BatchCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
});

export const BatchUpdateManyMutationInputSchema: z.ZodType<Prisma.BatchUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BatchUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitCreateInputSchema: z.ZodType<Prisma.StepTransitCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
  batch: z.lazy(() => BatchCreateNestedOneWithoutTransitsInputSchema),
  shipper: z.lazy(() => UserCreateNestedOneWithoutTransportsInputSchema),
});

export const StepTransitUncheckedCreateInputSchema: z.ZodType<Prisma.StepTransitUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  shipperId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const StepTransitUpdateInputSchema: z.ZodType<Prisma.StepTransitUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  batch: z.lazy(() => BatchUpdateOneRequiredWithoutTransitsNestedInputSchema).optional(),
  shipper: z.lazy(() => UserUpdateOneRequiredWithoutTransportsNestedInputSchema).optional(),
});

export const StepTransitUncheckedUpdateInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shipperId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitCreateManyInputSchema: z.ZodType<Prisma.StepTransitCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  shipperId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const StepTransitUpdateManyMutationInputSchema: z.ZodType<Prisma.StepTransitUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitUncheckedUpdateManyInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shipperId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QualityTestCreateInputSchema: z.ZodType<Prisma.QualityTestCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
  batch: z.lazy(() => BatchCreateNestedOneWithoutQualityTestInputSchema),
  retailer: z.lazy(() => UserCreateNestedOneWithoutQualityTestsInputSchema),
});

export const QualityTestUncheckedCreateInputSchema: z.ZodType<Prisma.QualityTestUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  retailerId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
});

export const QualityTestUpdateInputSchema: z.ZodType<Prisma.QualityTestUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batch: z.lazy(() => BatchUpdateOneRequiredWithoutQualityTestNestedInputSchema).optional(),
  retailer: z.lazy(() => UserUpdateOneRequiredWithoutQualityTestsNestedInputSchema).optional(),
});

export const QualityTestUncheckedUpdateInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  retailerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QualityTestCreateManyInputSchema: z.ZodType<Prisma.QualityTestCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  retailerId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
});

export const QualityTestUpdateManyMutationInputSchema: z.ZodType<Prisma.QualityTestUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QualityTestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  retailerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const CompanyScalarRelationFilterSchema: z.ZodType<Prisma.CompanyScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CompanyWhereInputSchema).optional(),
  isNot: z.lazy(() => CompanyWhereInputSchema).optional(),
});

export const BatchListRelationFilterSchema: z.ZodType<Prisma.BatchListRelationFilter> = z.strictObject({
  every: z.lazy(() => BatchWhereInputSchema).optional(),
  some: z.lazy(() => BatchWhereInputSchema).optional(),
  none: z.lazy(() => BatchWhereInputSchema).optional(),
});

export const StepTransitListRelationFilterSchema: z.ZodType<Prisma.StepTransitListRelationFilter> = z.strictObject({
  every: z.lazy(() => StepTransitWhereInputSchema).optional(),
  some: z.lazy(() => StepTransitWhereInputSchema).optional(),
  none: z.lazy(() => StepTransitWhereInputSchema).optional(),
});

export const QualityTestListRelationFilterSchema: z.ZodType<Prisma.QualityTestListRelationFilter> = z.strictObject({
  every: z.lazy(() => QualityTestWhereInputSchema).optional(),
  some: z.lazy(() => QualityTestWhereInputSchema).optional(),
  none: z.lazy(() => QualityTestWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const BatchOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BatchOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const StepTransitOrderByRelationAggregateInputSchema: z.ZodType<Prisma.StepTransitOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const QualityTestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QualityTestOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const EnumOrganizationTypeFilterSchema: z.ZodType<Prisma.EnumOrganizationTypeFilter> = z.strictObject({
  equals: z.lazy(() => OrganizationTypeSchema).optional(),
  in: z.lazy(() => OrganizationTypeSchema).array().optional(),
  notIn: z.lazy(() => OrganizationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => NestedEnumOrganizationTypeFilterSchema) ]).optional(),
});

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.strictObject({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyCountOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  protectedKey: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  protectedKey: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyMinOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  protectedKey: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumOrganizationTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrganizationTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => OrganizationTypeSchema).optional(),
  in: z.lazy(() => OrganizationTypeSchema).array().optional(),
  notIn: z.lazy(() => OrganizationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => NestedEnumOrganizationTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationTypeFilterSchema).optional(),
});

export const BatchScalarRelationFilterSchema: z.ZodType<Prisma.BatchScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => BatchWhereInputSchema).optional(),
  isNot: z.lazy(() => BatchWhereInputSchema).optional(),
});

export const ActivityLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
});

export const ActivityLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
});

export const ActivityLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityLogMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumCategoryFilterSchema: z.ZodType<Prisma.EnumCategoryFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryFilterSchema) ]).optional(),
});

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const EnumBatchStatusFilterSchema: z.ZodType<Prisma.EnumBatchStatusFilter> = z.strictObject({
  equals: z.lazy(() => BatchStatusSchema).optional(),
  in: z.lazy(() => BatchStatusSchema).array().optional(),
  notIn: z.lazy(() => BatchStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => NestedEnumBatchStatusFilterSchema) ]).optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const ActivityLogListRelationFilterSchema: z.ZodType<Prisma.ActivityLogListRelationFilter> = z.strictObject({
  every: z.lazy(() => ActivityLogWhereInputSchema).optional(),
  some: z.lazy(() => ActivityLogWhereInputSchema).optional(),
  none: z.lazy(() => ActivityLogWhereInputSchema).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const CompanyNullableScalarRelationFilterSchema: z.ZodType<Prisma.CompanyNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CompanyWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CompanyWhereInputSchema).optional().nullable(),
});

export const QualityTestNullableScalarRelationFilterSchema: z.ZodType<Prisma.QualityTestNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => QualityTestWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => QualityTestWhereInputSchema).optional().nullable(),
});

export const ActivityLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ActivityLogOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const BatchCountOrderByAggregateInputSchema: z.ZodType<Prisma.BatchCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockchainId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  ipfsHash: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  farmerId: z.lazy(() => SortOrderSchema).optional(),
  harvestDate: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  retailCompanyId: z.lazy(() => SortOrderSchema).optional(),
  shipperCompanyId: z.lazy(() => SortOrderSchema).optional(),
});

export const BatchAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BatchAvgOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
});

export const BatchMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BatchMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockchainId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  ipfsHash: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  farmerId: z.lazy(() => SortOrderSchema).optional(),
  harvestDate: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  retailCompanyId: z.lazy(() => SortOrderSchema).optional(),
  shipperCompanyId: z.lazy(() => SortOrderSchema).optional(),
});

export const BatchMinOrderByAggregateInputSchema: z.ZodType<Prisma.BatchMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  blockchainId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  ipfsHash: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  farmerId: z.lazy(() => SortOrderSchema).optional(),
  harvestDate: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  retailCompanyId: z.lazy(() => SortOrderSchema).optional(),
  shipperCompanyId: z.lazy(() => SortOrderSchema).optional(),
});

export const BatchSumOrderByAggregateInputSchema: z.ZodType<Prisma.BatchSumOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
});

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const EnumBatchStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBatchStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => BatchStatusSchema).optional(),
  in: z.lazy(() => BatchStatusSchema).array().optional(),
  notIn: z.lazy(() => BatchStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => NestedEnumBatchStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const StepTransitCountOrderByAggregateInputSchema: z.ZodType<Prisma.StepTransitCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  shipperId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  humidity: z.lazy(() => SortOrderSchema).optional(),
  vehicleNumber: z.lazy(() => SortOrderSchema).optional(),
  statusDetails: z.lazy(() => SortOrderSchema).optional(),
  departureTime: z.lazy(() => SortOrderSchema).optional(),
  arrivalTime: z.lazy(() => SortOrderSchema).optional(),
});

export const StepTransitAvgOrderByAggregateInputSchema: z.ZodType<Prisma.StepTransitAvgOrderByAggregateInput> = z.strictObject({
  temperature: z.lazy(() => SortOrderSchema).optional(),
  humidity: z.lazy(() => SortOrderSchema).optional(),
});

export const StepTransitMaxOrderByAggregateInputSchema: z.ZodType<Prisma.StepTransitMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  shipperId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  humidity: z.lazy(() => SortOrderSchema).optional(),
  vehicleNumber: z.lazy(() => SortOrderSchema).optional(),
  statusDetails: z.lazy(() => SortOrderSchema).optional(),
  departureTime: z.lazy(() => SortOrderSchema).optional(),
  arrivalTime: z.lazy(() => SortOrderSchema).optional(),
});

export const StepTransitMinOrderByAggregateInputSchema: z.ZodType<Prisma.StepTransitMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  shipperId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  fromLocation: z.lazy(() => SortOrderSchema).optional(),
  toLocation: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  humidity: z.lazy(() => SortOrderSchema).optional(),
  vehicleNumber: z.lazy(() => SortOrderSchema).optional(),
  statusDetails: z.lazy(() => SortOrderSchema).optional(),
  departureTime: z.lazy(() => SortOrderSchema).optional(),
  arrivalTime: z.lazy(() => SortOrderSchema).optional(),
});

export const StepTransitSumOrderByAggregateInputSchema: z.ZodType<Prisma.StepTransitSumOrderByAggregateInput> = z.strictObject({
  temperature: z.lazy(() => SortOrderSchema).optional(),
  humidity: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const QualityTestCountOrderByAggregateInputSchema: z.ZodType<Prisma.QualityTestCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  retailerId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  isPassed: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  testedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QualityTestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QualityTestMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  retailerId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  isPassed: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  testedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QualityTestMinOrderByAggregateInputSchema: z.ZodType<Prisma.QualityTestMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  batchId: z.lazy(() => SortOrderSchema).optional(),
  retailerId: z.lazy(() => SortOrderSchema).optional(),
  txHash: z.lazy(() => SortOrderSchema).optional(),
  isPassed: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  testedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const CompanyCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutMembersInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
});

export const BatchCreateNestedManyWithoutFarmerInputSchema: z.ZodType<Prisma.BatchCreateNestedManyWithoutFarmerInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchCreateWithoutFarmerInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema), z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyFarmerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const StepTransitCreateNestedManyWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitCreateNestedManyWithoutShipperInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitCreateWithoutShipperInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyShipperInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
});

export const QualityTestCreateNestedManyWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestCreateNestedManyWithoutRetailerInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateWithoutRetailerInputSchema).array(), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QualityTestCreateManyRetailerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
});

export const BatchUncheckedCreateNestedManyWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUncheckedCreateNestedManyWithoutFarmerInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchCreateWithoutFarmerInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema), z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyFarmerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const StepTransitUncheckedCreateNestedManyWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUncheckedCreateNestedManyWithoutShipperInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitCreateWithoutShipperInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyShipperInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
});

export const QualityTestUncheckedCreateNestedManyWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUncheckedCreateNestedManyWithoutRetailerInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateWithoutRetailerInputSchema).array(), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QualityTestCreateManyRetailerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RoleSchema).optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const CompanyUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneRequiredWithoutMembersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateToOneWithWhereWithoutMembersInputSchema), z.lazy(() => CompanyUpdateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
});

export const BatchUpdateManyWithoutFarmerNestedInputSchema: z.ZodType<Prisma.BatchUpdateManyWithoutFarmerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchCreateWithoutFarmerInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema), z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutFarmerInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutFarmerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyFarmerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutFarmerInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutFarmerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutFarmerInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutFarmerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const StepTransitUpdateManyWithoutShipperNestedInputSchema: z.ZodType<Prisma.StepTransitUpdateManyWithoutShipperNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitCreateWithoutShipperInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutShipperInputSchema), z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutShipperInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyShipperInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutShipperInputSchema), z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutShipperInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepTransitUpdateManyWithWhereWithoutShipperInputSchema), z.lazy(() => StepTransitUpdateManyWithWhereWithoutShipperInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
});

export const QualityTestUpdateManyWithoutRetailerNestedInputSchema: z.ZodType<Prisma.QualityTestUpdateManyWithoutRetailerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateWithoutRetailerInputSchema).array(), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QualityTestUpsertWithWhereUniqueWithoutRetailerInputSchema), z.lazy(() => QualityTestUpsertWithWhereUniqueWithoutRetailerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QualityTestCreateManyRetailerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QualityTestUpdateWithWhereUniqueWithoutRetailerInputSchema), z.lazy(() => QualityTestUpdateWithWhereUniqueWithoutRetailerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QualityTestUpdateManyWithWhereWithoutRetailerInputSchema), z.lazy(() => QualityTestUpdateManyWithWhereWithoutRetailerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QualityTestScalarWhereInputSchema), z.lazy(() => QualityTestScalarWhereInputSchema).array() ]).optional(),
});

export const BatchUncheckedUpdateManyWithoutFarmerNestedInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutFarmerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchCreateWithoutFarmerInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema), z.lazy(() => BatchCreateOrConnectWithoutFarmerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutFarmerInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutFarmerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyFarmerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutFarmerInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutFarmerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutFarmerInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutFarmerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const StepTransitUncheckedUpdateManyWithoutShipperNestedInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateManyWithoutShipperNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitCreateWithoutShipperInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutShipperInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutShipperInputSchema), z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutShipperInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyShipperInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutShipperInputSchema), z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutShipperInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepTransitUpdateManyWithWhereWithoutShipperInputSchema), z.lazy(() => StepTransitUpdateManyWithWhereWithoutShipperInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
});

export const QualityTestUncheckedUpdateManyWithoutRetailerNestedInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateManyWithoutRetailerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateWithoutRetailerInputSchema).array(), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema), z.lazy(() => QualityTestCreateOrConnectWithoutRetailerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QualityTestUpsertWithWhereUniqueWithoutRetailerInputSchema), z.lazy(() => QualityTestUpsertWithWhereUniqueWithoutRetailerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QualityTestCreateManyRetailerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QualityTestWhereUniqueInputSchema), z.lazy(() => QualityTestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QualityTestUpdateWithWhereUniqueWithoutRetailerInputSchema), z.lazy(() => QualityTestUpdateWithWhereUniqueWithoutRetailerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QualityTestUpdateManyWithWhereWithoutRetailerInputSchema), z.lazy(() => QualityTestUpdateManyWithWhereWithoutRetailerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QualityTestScalarWhereInputSchema), z.lazy(() => QualityTestScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserCreateWithoutCompanyInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema), z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const BatchCreateNestedManyWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchCreateNestedManyWithoutShipperCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyShipperCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const BatchCreateNestedManyWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchCreateNestedManyWithoutRetailCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyRetailCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const UserUncheckedCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserCreateWithoutCompanyInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema), z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const BatchUncheckedCreateNestedManyWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedCreateNestedManyWithoutShipperCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyShipperCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const BatchUncheckedCreateNestedManyWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedCreateNestedManyWithoutRetailCompanyInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyRetailCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumOrganizationTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrganizationTypeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => OrganizationTypeSchema).optional(),
});

export const UserUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserCreateWithoutCompanyInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema), z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutCompanyInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutCompanyInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutCompanyInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const BatchUpdateManyWithoutShipperCompanyNestedInputSchema: z.ZodType<Prisma.BatchUpdateManyWithoutShipperCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutShipperCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyShipperCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutShipperCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutShipperCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const BatchUpdateManyWithoutRetailCompanyNestedInputSchema: z.ZodType<Prisma.BatchUpdateManyWithoutRetailCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutRetailCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyRetailCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutRetailCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutRetailCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const UserUncheckedUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserCreateWithoutCompanyInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema), z.lazy(() => UserCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutCompanyInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutCompanyInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutCompanyInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const BatchUncheckedUpdateManyWithoutShipperCompanyNestedInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutShipperCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutShipperCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutShipperCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyShipperCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutShipperCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutShipperCompanyInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutShipperCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const BatchUncheckedUpdateManyWithoutRetailCompanyNestedInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutRetailCompanyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema).array(), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema), z.lazy(() => BatchCreateOrConnectWithoutRetailCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BatchUpsertWithWhereUniqueWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpsertWithWhereUniqueWithoutRetailCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BatchCreateManyRetailCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BatchWhereUniqueInputSchema), z.lazy(() => BatchWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BatchUpdateWithWhereUniqueWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpdateWithWhereUniqueWithoutRetailCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BatchUpdateManyWithWhereWithoutRetailCompanyInputSchema), z.lazy(() => BatchUpdateManyWithWhereWithoutRetailCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
});

export const BatchCreateNestedOneWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchCreateNestedOneWithoutActivitiesInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedCreateWithoutActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutActivitiesInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
});

export const BatchUpdateOneRequiredWithoutActivitiesNestedInputSchema: z.ZodType<Prisma.BatchUpdateOneRequiredWithoutActivitiesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedCreateWithoutActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutActivitiesInputSchema).optional(),
  upsert: z.lazy(() => BatchUpsertWithoutActivitiesInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BatchUpdateToOneWithWhereWithoutActivitiesInputSchema), z.lazy(() => BatchUpdateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutActivitiesInputSchema) ]).optional(),
});

export const ActivityLogCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogCreateNestedManyWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateWithoutBatchInputSchema).array(), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyBatchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBatchesCreatedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedCreateWithoutBatchesCreatedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBatchesCreatedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const CompanyCreateNestedOneWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutRetailedBatchesInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutRetailedBatchesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutRetailedBatchesInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
});

export const CompanyCreateNestedOneWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutShippedBatchesInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutShippedBatchesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutShippedBatchesInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
});

export const StepTransitCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitCreateNestedManyWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitCreateWithoutBatchInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyBatchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
});

export const QualityTestCreateNestedOneWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestCreateNestedOneWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QualityTestCreateOrConnectWithoutBatchInputSchema).optional(),
  connect: z.lazy(() => QualityTestWhereUniqueInputSchema).optional(),
});

export const ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateNestedManyWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateWithoutBatchInputSchema).array(), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyBatchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
});

export const StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUncheckedCreateNestedManyWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitCreateWithoutBatchInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyBatchInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
});

export const QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUncheckedCreateNestedOneWithoutBatchInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QualityTestCreateOrConnectWithoutBatchInputSchema).optional(),
  connect: z.lazy(() => QualityTestWhereUniqueInputSchema).optional(),
});

export const EnumCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCategoryFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => CategorySchema).optional(),
});

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const EnumBatchStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBatchStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => BatchStatusSchema).optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const ActivityLogUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateWithoutBatchInputSchema).array(), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyBatchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutBatchInputSchema), z.lazy(() => ActivityLogUpdateManyWithWhereWithoutBatchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema), z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutBatchesCreatedNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedCreateWithoutBatchesCreatedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBatchesCreatedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutBatchesCreatedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutBatchesCreatedInputSchema), z.lazy(() => UserUpdateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBatchesCreatedInputSchema) ]).optional(),
});

export const CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneWithoutRetailedBatchesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutRetailedBatchesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutRetailedBatchesInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutRetailedBatchesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateToOneWithWhereWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUpdateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutRetailedBatchesInputSchema) ]).optional(),
});

export const CompanyUpdateOneWithoutShippedBatchesNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneWithoutShippedBatchesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyCreateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutShippedBatchesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutShippedBatchesInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutShippedBatchesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateToOneWithWhereWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUpdateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutShippedBatchesInputSchema) ]).optional(),
});

export const StepTransitUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.StepTransitUpdateManyWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitCreateWithoutBatchInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyBatchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepTransitUpdateManyWithWhereWithoutBatchInputSchema), z.lazy(() => StepTransitUpdateManyWithWhereWithoutBatchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
});

export const QualityTestUpdateOneWithoutBatchNestedInputSchema: z.ZodType<Prisma.QualityTestUpdateOneWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QualityTestCreateOrConnectWithoutBatchInputSchema).optional(),
  upsert: z.lazy(() => QualityTestUpsertWithoutBatchInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => QualityTestWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => QualityTestWhereInputSchema) ]).optional(),
  connect: z.lazy(() => QualityTestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QualityTestUpdateToOneWithWhereWithoutBatchInputSchema), z.lazy(() => QualityTestUpdateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutBatchInputSchema) ]).optional(),
});

export const ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateWithoutBatchInputSchema).array(), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema), z.lazy(() => ActivityLogCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => ActivityLogUpsertWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityLogCreateManyBatchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityLogWhereUniqueInputSchema), z.lazy(() => ActivityLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => ActivityLogUpdateWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityLogUpdateManyWithWhereWithoutBatchInputSchema), z.lazy(() => ActivityLogUpdateManyWithWhereWithoutBatchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema), z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
});

export const StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateManyWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitCreateWithoutBatchInputSchema).array(), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema), z.lazy(() => StepTransitCreateOrConnectWithoutBatchInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => StepTransitUpsertWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  createMany: z.lazy(() => StepTransitCreateManyBatchInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => StepTransitWhereUniqueInputSchema), z.lazy(() => StepTransitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutBatchInputSchema), z.lazy(() => StepTransitUpdateWithWhereUniqueWithoutBatchInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => StepTransitUpdateManyWithWhereWithoutBatchInputSchema), z.lazy(() => StepTransitUpdateManyWithWhereWithoutBatchInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
});

export const QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateOneWithoutBatchNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QualityTestCreateOrConnectWithoutBatchInputSchema).optional(),
  upsert: z.lazy(() => QualityTestUpsertWithoutBatchInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => QualityTestWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => QualityTestWhereInputSchema) ]).optional(),
  connect: z.lazy(() => QualityTestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QualityTestUpdateToOneWithWhereWithoutBatchInputSchema), z.lazy(() => QualityTestUpdateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutBatchInputSchema) ]).optional(),
});

export const BatchCreateNestedOneWithoutTransitsInputSchema: z.ZodType<Prisma.BatchCreateNestedOneWithoutTransitsInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedCreateWithoutTransitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutTransitsInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutTransportsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTransportsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedCreateWithoutTransportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransportsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const BatchUpdateOneRequiredWithoutTransitsNestedInputSchema: z.ZodType<Prisma.BatchUpdateOneRequiredWithoutTransitsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedCreateWithoutTransitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutTransitsInputSchema).optional(),
  upsert: z.lazy(() => BatchUpsertWithoutTransitsInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BatchUpdateToOneWithWhereWithoutTransitsInputSchema), z.lazy(() => BatchUpdateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutTransitsInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutTransportsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutTransportsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedCreateWithoutTransportsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransportsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTransportsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTransportsInputSchema), z.lazy(() => UserUpdateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTransportsInputSchema) ]).optional(),
});

export const BatchCreateNestedOneWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchCreateNestedOneWithoutQualityTestInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedCreateWithoutQualityTestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutQualityTestInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutQualityTestsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedCreateWithoutQualityTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutQualityTestsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const BatchUpdateOneRequiredWithoutQualityTestNestedInputSchema: z.ZodType<Prisma.BatchUpdateOneRequiredWithoutQualityTestNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => BatchCreateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedCreateWithoutQualityTestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BatchCreateOrConnectWithoutQualityTestInputSchema).optional(),
  upsert: z.lazy(() => BatchUpsertWithoutQualityTestInputSchema).optional(),
  connect: z.lazy(() => BatchWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BatchUpdateToOneWithWhereWithoutQualityTestInputSchema), z.lazy(() => BatchUpdateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutQualityTestInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutQualityTestsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutQualityTestsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedCreateWithoutQualityTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutQualityTestsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutQualityTestsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutQualityTestsInputSchema), z.lazy(() => UserUpdateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutQualityTestsInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumOrganizationTypeFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationTypeFilter> = z.strictObject({
  equals: z.lazy(() => OrganizationTypeSchema).optional(),
  in: z.lazy(() => OrganizationTypeSchema).array().optional(),
  notIn: z.lazy(() => OrganizationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => NestedEnumOrganizationTypeFilterSchema) ]).optional(),
});

export const NestedEnumOrganizationTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => OrganizationTypeSchema).optional(),
  in: z.lazy(() => OrganizationTypeSchema).array().optional(),
  notIn: z.lazy(() => OrganizationTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => NestedEnumOrganizationTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationTypeFilterSchema).optional(),
});

export const NestedEnumCategoryFilterSchema: z.ZodType<Prisma.NestedEnumCategoryFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryFilterSchema) ]).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedEnumBatchStatusFilterSchema: z.ZodType<Prisma.NestedEnumBatchStatusFilter> = z.strictObject({
  equals: z.lazy(() => BatchStatusSchema).optional(),
  in: z.lazy(() => BatchStatusSchema).array().optional(),
  notIn: z.lazy(() => BatchStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => NestedEnumBatchStatusFilterSchema) ]).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
});

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const NestedEnumBatchStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBatchStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => BatchStatusSchema).optional(),
  in: z.lazy(() => BatchStatusSchema).array().optional(),
  notIn: z.lazy(() => BatchStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => NestedEnumBatchStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBatchStatusFilterSchema).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const CompanyCreateWithoutMembersInputSchema: z.ZodType<Prisma.CompanyCreateWithoutMembersInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  shippedBatches: z.lazy(() => BatchCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutMembersInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  shippedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutMembersInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutMembersInputSchema) ]),
});

export const BatchCreateWithoutFarmerInputSchema: z.ZodType<Prisma.BatchCreateWithoutFarmerInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutFarmerInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutFarmerInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutFarmerInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema) ]),
});

export const BatchCreateManyFarmerInputEnvelopeSchema: z.ZodType<Prisma.BatchCreateManyFarmerInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => BatchCreateManyFarmerInputSchema), z.lazy(() => BatchCreateManyFarmerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const StepTransitCreateWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitCreateWithoutShipperInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
  batch: z.lazy(() => BatchCreateNestedOneWithoutTransitsInputSchema),
});

export const StepTransitUncheckedCreateWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUncheckedCreateWithoutShipperInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const StepTransitCreateOrConnectWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitCreateOrConnectWithoutShipperInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema) ]),
});

export const StepTransitCreateManyShipperInputEnvelopeSchema: z.ZodType<Prisma.StepTransitCreateManyShipperInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => StepTransitCreateManyShipperInputSchema), z.lazy(() => StepTransitCreateManyShipperInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const QualityTestCreateWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestCreateWithoutRetailerInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
  batch: z.lazy(() => BatchCreateNestedOneWithoutQualityTestInputSchema),
});

export const QualityTestUncheckedCreateWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUncheckedCreateWithoutRetailerInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
});

export const QualityTestCreateOrConnectWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestCreateOrConnectWithoutRetailerInput> = z.strictObject({
  where: z.lazy(() => QualityTestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema) ]),
});

export const QualityTestCreateManyRetailerInputEnvelopeSchema: z.ZodType<Prisma.QualityTestCreateManyRetailerInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => QualityTestCreateManyRetailerInputSchema), z.lazy(() => QualityTestCreateManyRetailerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const CompanyUpsertWithoutMembersInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutMembersInput> = z.strictObject({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
});

export const CompanyUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.CompanyUpdateToOneWithWhereWithoutMembersInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CompanyUpdateWithoutMembersInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutMembersInputSchema) ]),
});

export const CompanyUpdateWithoutMembersInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutMembersInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shippedBatches: z.lazy(() => BatchUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const CompanyUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutMembersInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shippedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const BatchUpsertWithWhereUniqueWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUpsertWithWhereUniqueWithoutFarmerInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BatchUpdateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutFarmerInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedCreateWithoutFarmerInputSchema) ]),
});

export const BatchUpdateWithWhereUniqueWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUpdateWithWhereUniqueWithoutFarmerInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateWithoutFarmerInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutFarmerInputSchema) ]),
});

export const BatchUpdateManyWithWhereWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUpdateManyWithWhereWithoutFarmerInput> = z.strictObject({
  where: z.lazy(() => BatchScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateManyMutationInputSchema), z.lazy(() => BatchUncheckedUpdateManyWithoutFarmerInputSchema) ]),
});

export const BatchScalarWhereInputSchema: z.ZodType<Prisma.BatchScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BatchScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BatchScalarWhereInputSchema), z.lazy(() => BatchScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  blockchainId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  ipfsHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBatchStatusFilterSchema), z.lazy(() => BatchStatusSchema) ]).optional(),
  farmerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  harvestDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  retailCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  shipperCompanyId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const StepTransitUpsertWithWhereUniqueWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUpsertWithWhereUniqueWithoutShipperInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StepTransitUpdateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedUpdateWithoutShipperInputSchema) ]),
  create: z.union([ z.lazy(() => StepTransitCreateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutShipperInputSchema) ]),
});

export const StepTransitUpdateWithWhereUniqueWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUpdateWithWhereUniqueWithoutShipperInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StepTransitUpdateWithoutShipperInputSchema), z.lazy(() => StepTransitUncheckedUpdateWithoutShipperInputSchema) ]),
});

export const StepTransitUpdateManyWithWhereWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUpdateManyWithWhereWithoutShipperInput> = z.strictObject({
  where: z.lazy(() => StepTransitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StepTransitUpdateManyMutationInputSchema), z.lazy(() => StepTransitUncheckedUpdateManyWithoutShipperInputSchema) ]),
});

export const StepTransitScalarWhereInputSchema: z.ZodType<Prisma.StepTransitScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => StepTransitScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => StepTransitScalarWhereInputSchema), z.lazy(() => StepTransitScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  shipperId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  toLocation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  temperature: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  humidity: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vehicleNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  statusDetails: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  departureTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  arrivalTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
});

export const QualityTestUpsertWithWhereUniqueWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUpsertWithWhereUniqueWithoutRetailerInput> = z.strictObject({
  where: z.lazy(() => QualityTestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QualityTestUpdateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutRetailerInputSchema) ]),
  create: z.union([ z.lazy(() => QualityTestCreateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutRetailerInputSchema) ]),
});

export const QualityTestUpdateWithWhereUniqueWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUpdateWithWhereUniqueWithoutRetailerInput> = z.strictObject({
  where: z.lazy(() => QualityTestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QualityTestUpdateWithoutRetailerInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutRetailerInputSchema) ]),
});

export const QualityTestUpdateManyWithWhereWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUpdateManyWithWhereWithoutRetailerInput> = z.strictObject({
  where: z.lazy(() => QualityTestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QualityTestUpdateManyMutationInputSchema), z.lazy(() => QualityTestUncheckedUpdateManyWithoutRetailerInputSchema) ]),
});

export const QualityTestScalarWhereInputSchema: z.ZodType<Prisma.QualityTestScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QualityTestScalarWhereInputSchema), z.lazy(() => QualityTestScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QualityTestScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QualityTestScalarWhereInputSchema), z.lazy(() => QualityTestScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  retailerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isPassed: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  testedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateWithoutCompanyInputSchema: z.ZodType<Prisma.UserCreateWithoutCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  batchesCreated: z.lazy(() => BatchCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserUncheckedCreateWithoutCompanyInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  batchesCreated: z.lazy(() => BatchUncheckedCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserCreateOrConnectWithoutCompanyInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCompanyInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema) ]),
});

export const UserCreateManyCompanyInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyCompanyInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => UserCreateManyCompanyInputSchema), z.lazy(() => UserCreateManyCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const BatchCreateWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchCreateWithoutShipperCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutShipperCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutShipperCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema) ]),
});

export const BatchCreateManyShipperCompanyInputEnvelopeSchema: z.ZodType<Prisma.BatchCreateManyShipperCompanyInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => BatchCreateManyShipperCompanyInputSchema), z.lazy(() => BatchCreateManyShipperCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const BatchCreateWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchCreateWithoutRetailCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutRetailCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shipperCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutRetailCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema) ]),
});

export const BatchCreateManyRetailCompanyInputEnvelopeSchema: z.ZodType<Prisma.BatchCreateManyRetailCompanyInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => BatchCreateManyRetailCompanyInputSchema), z.lazy(() => BatchCreateManyRetailCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutCompanyInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedCreateWithoutCompanyInputSchema) ]),
});

export const UserUpdateWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutCompanyInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutCompanyInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCompanyInputSchema) ]),
});

export const UserUpdateManyWithWhereWithoutCompanyInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutCompanyInput> = z.strictObject({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema), z.lazy(() => UserUncheckedUpdateManyWithoutCompanyInputSchema) ]),
});

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fullName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  companyId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const BatchUpsertWithWhereUniqueWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUpsertWithWhereUniqueWithoutShipperCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BatchUpdateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutShipperCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutShipperCompanyInputSchema) ]),
});

export const BatchUpdateWithWhereUniqueWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUpdateWithWhereUniqueWithoutShipperCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateWithoutShipperCompanyInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutShipperCompanyInputSchema) ]),
});

export const BatchUpdateManyWithWhereWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUpdateManyWithWhereWithoutShipperCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateManyMutationInputSchema), z.lazy(() => BatchUncheckedUpdateManyWithoutShipperCompanyInputSchema) ]),
});

export const BatchUpsertWithWhereUniqueWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUpsertWithWhereUniqueWithoutRetailCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BatchUpdateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutRetailCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedCreateWithoutRetailCompanyInputSchema) ]),
});

export const BatchUpdateWithWhereUniqueWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUpdateWithWhereUniqueWithoutRetailCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateWithoutRetailCompanyInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutRetailCompanyInputSchema) ]),
});

export const BatchUpdateManyWithWhereWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUpdateManyWithWhereWithoutRetailCompanyInput> = z.strictObject({
  where: z.lazy(() => BatchScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BatchUpdateManyMutationInputSchema), z.lazy(() => BatchUncheckedUpdateManyWithoutRetailCompanyInputSchema) ]),
});

export const BatchCreateWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchCreateWithoutActivitiesInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutActivitiesInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutActivitiesInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedCreateWithoutActivitiesInputSchema) ]),
});

export const BatchUpsertWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchUpsertWithoutActivitiesInput> = z.strictObject({
  update: z.union([ z.lazy(() => BatchUpdateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutActivitiesInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedCreateWithoutActivitiesInputSchema) ]),
  where: z.lazy(() => BatchWhereInputSchema).optional(),
});

export const BatchUpdateToOneWithWhereWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchUpdateToOneWithWhereWithoutActivitiesInput> = z.strictObject({
  where: z.lazy(() => BatchWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BatchUpdateWithoutActivitiesInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutActivitiesInputSchema) ]),
});

export const BatchUpdateWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchUpdateWithoutActivitiesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutActivitiesInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutActivitiesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const ActivityLogCreateWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
});

export const ActivityLogUncheckedCreateWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUncheckedCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
});

export const ActivityLogCreateOrConnectWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogCreateOrConnectWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema) ]),
});

export const ActivityLogCreateManyBatchInputEnvelopeSchema: z.ZodType<Prisma.ActivityLogCreateManyBatchInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ActivityLogCreateManyBatchInputSchema), z.lazy(() => ActivityLogCreateManyBatchInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserCreateWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserCreateWithoutBatchesCreatedInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutMembersInputSchema),
  transports: z.lazy(() => StepTransitCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserUncheckedCreateWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBatchesCreatedInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  companyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  transports: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutShipperInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserCreateOrConnectWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBatchesCreatedInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedCreateWithoutBatchesCreatedInputSchema) ]),
});

export const CompanyCreateWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateWithoutRetailedBatchesInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserCreateNestedManyWithoutCompanyInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
});

export const CompanyUncheckedCreateWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutRetailedBatchesInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutShipperCompanyInputSchema).optional(),
});

export const CompanyCreateOrConnectWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutRetailedBatchesInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutRetailedBatchesInputSchema) ]),
});

export const CompanyCreateWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateWithoutShippedBatchesInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserCreateNestedManyWithoutCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyUncheckedCreateWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutShippedBatchesInput> = z.strictObject({
  id: z.uuid().optional(),
  type: z.lazy(() => OrganizationTypeSchema),
  companyName: z.string(),
  location: z.string(),
  protectedKey: z.string(),
  members: z.lazy(() => UserUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedCreateNestedManyWithoutRetailCompanyInputSchema).optional(),
});

export const CompanyCreateOrConnectWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutShippedBatchesInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutShippedBatchesInputSchema) ]),
});

export const StepTransitCreateWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
  shipper: z.lazy(() => UserCreateNestedOneWithoutTransportsInputSchema),
});

export const StepTransitUncheckedCreateWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUncheckedCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  shipperId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const StepTransitCreateOrConnectWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitCreateOrConnectWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema) ]),
});

export const StepTransitCreateManyBatchInputEnvelopeSchema: z.ZodType<Prisma.StepTransitCreateManyBatchInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => StepTransitCreateManyBatchInputSchema), z.lazy(() => StepTransitCreateManyBatchInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const QualityTestCreateWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
  retailer: z.lazy(() => UserCreateNestedOneWithoutQualityTestsInputSchema),
});

export const QualityTestUncheckedCreateWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUncheckedCreateWithoutBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  retailerId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
});

export const QualityTestCreateOrConnectWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestCreateOrConnectWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => QualityTestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]),
});

export const ActivityLogUpsertWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUpsertWithWhereUniqueWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActivityLogUpdateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedUpdateWithoutBatchInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityLogCreateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedCreateWithoutBatchInputSchema) ]),
});

export const ActivityLogUpdateWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithWhereUniqueWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => ActivityLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateWithoutBatchInputSchema), z.lazy(() => ActivityLogUncheckedUpdateWithoutBatchInputSchema) ]),
});

export const ActivityLogUpdateManyWithWhereWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUpdateManyWithWhereWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => ActivityLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActivityLogUpdateManyMutationInputSchema), z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchInputSchema) ]),
});

export const ActivityLogScalarWhereInputSchema: z.ZodType<Prisma.ActivityLogScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema), z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityLogScalarWhereInputSchema), z.lazy(() => ActivityLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  batchId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  txHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const UserUpsertWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserUpsertWithoutBatchesCreatedInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBatchesCreatedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedCreateWithoutBatchesCreatedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBatchesCreatedInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutBatchesCreatedInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBatchesCreatedInputSchema) ]),
});

export const UserUpdateWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserUpdateWithoutBatchesCreatedInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutBatchesCreatedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBatchesCreatedInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transports: z.lazy(() => StepTransitUncheckedUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const CompanyUpsertWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutRetailedBatchesInput> = z.strictObject({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutRetailedBatchesInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutRetailedBatchesInputSchema) ]),
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
});

export const CompanyUpdateToOneWithWhereWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyUpdateToOneWithWhereWithoutRetailedBatchesInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CompanyUpdateWithoutRetailedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutRetailedBatchesInputSchema) ]),
});

export const CompanyUpdateWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutRetailedBatchesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUpdateManyWithoutCompanyNestedInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
});

export const CompanyUncheckedUpdateWithoutRetailedBatchesInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutRetailedBatchesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  shippedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutShipperCompanyNestedInputSchema).optional(),
});

export const CompanyUpsertWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutShippedBatchesInput> = z.strictObject({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutShippedBatchesInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedCreateWithoutShippedBatchesInputSchema) ]),
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
});

export const CompanyUpdateToOneWithWhereWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyUpdateToOneWithWhereWithoutShippedBatchesInput> = z.strictObject({
  where: z.lazy(() => CompanyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CompanyUpdateWithoutShippedBatchesInputSchema), z.lazy(() => CompanyUncheckedUpdateWithoutShippedBatchesInputSchema) ]),
});

export const CompanyUpdateWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutShippedBatchesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUpdateManyWithoutCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const CompanyUncheckedUpdateWithoutShippedBatchesInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutShippedBatchesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrganizationTypeSchema), z.lazy(() => EnumOrganizationTypeFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  protectedKey: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => UserUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  retailedBatches: z.lazy(() => BatchUncheckedUpdateManyWithoutRetailCompanyNestedInputSchema).optional(),
});

export const StepTransitUpsertWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUpsertWithWhereUniqueWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => StepTransitUpdateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedUpdateWithoutBatchInputSchema) ]),
  create: z.union([ z.lazy(() => StepTransitCreateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedCreateWithoutBatchInputSchema) ]),
});

export const StepTransitUpdateWithWhereUniqueWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUpdateWithWhereUniqueWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => StepTransitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => StepTransitUpdateWithoutBatchInputSchema), z.lazy(() => StepTransitUncheckedUpdateWithoutBatchInputSchema) ]),
});

export const StepTransitUpdateManyWithWhereWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUpdateManyWithWhereWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => StepTransitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => StepTransitUpdateManyMutationInputSchema), z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchInputSchema) ]),
});

export const QualityTestUpsertWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUpsertWithoutBatchInput> = z.strictObject({
  update: z.union([ z.lazy(() => QualityTestUpdateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutBatchInputSchema) ]),
  create: z.union([ z.lazy(() => QualityTestCreateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedCreateWithoutBatchInputSchema) ]),
  where: z.lazy(() => QualityTestWhereInputSchema).optional(),
});

export const QualityTestUpdateToOneWithWhereWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUpdateToOneWithWhereWithoutBatchInput> = z.strictObject({
  where: z.lazy(() => QualityTestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QualityTestUpdateWithoutBatchInputSchema), z.lazy(() => QualityTestUncheckedUpdateWithoutBatchInputSchema) ]),
});

export const QualityTestUpdateWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailer: z.lazy(() => UserUpdateOneRequiredWithoutQualityTestsNestedInputSchema).optional(),
});

export const QualityTestUncheckedUpdateWithoutBatchInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  retailerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BatchCreateWithoutTransitsInputSchema: z.ZodType<Prisma.BatchCreateWithoutTransitsInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutTransitsInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutTransitsInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedCreateNestedOneWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutTransitsInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutTransitsInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedCreateWithoutTransitsInputSchema) ]),
});

export const UserCreateWithoutTransportsInputSchema: z.ZodType<Prisma.UserCreateWithoutTransportsInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutMembersInputSchema),
  batchesCreated: z.lazy(() => BatchCreateNestedManyWithoutFarmerInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserUncheckedCreateWithoutTransportsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTransportsInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  companyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  batchesCreated: z.lazy(() => BatchUncheckedCreateNestedManyWithoutFarmerInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedCreateNestedManyWithoutRetailerInputSchema).optional(),
});

export const UserCreateOrConnectWithoutTransportsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTransportsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedCreateWithoutTransportsInputSchema) ]),
});

export const BatchUpsertWithoutTransitsInputSchema: z.ZodType<Prisma.BatchUpsertWithoutTransitsInput> = z.strictObject({
  update: z.union([ z.lazy(() => BatchUpdateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutTransitsInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedCreateWithoutTransitsInputSchema) ]),
  where: z.lazy(() => BatchWhereInputSchema).optional(),
});

export const BatchUpdateToOneWithWhereWithoutTransitsInputSchema: z.ZodType<Prisma.BatchUpdateToOneWithWhereWithoutTransitsInput> = z.strictObject({
  where: z.lazy(() => BatchWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BatchUpdateWithoutTransitsInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutTransitsInputSchema) ]),
});

export const BatchUpdateWithoutTransitsInputSchema: z.ZodType<Prisma.BatchUpdateWithoutTransitsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutTransitsInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutTransitsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const UserUpsertWithoutTransportsInputSchema: z.ZodType<Prisma.UserUpsertWithoutTransportsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTransportsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedCreateWithoutTransportsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutTransportsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTransportsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTransportsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTransportsInputSchema) ]),
});

export const UserUpdateWithoutTransportsInputSchema: z.ZodType<Prisma.UserUpdateWithoutTransportsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  batchesCreated: z.lazy(() => BatchUpdateManyWithoutFarmerNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutTransportsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTransportsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchUncheckedUpdateManyWithoutFarmerNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const BatchCreateWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchCreateWithoutQualityTestInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityLogCreateNestedManyWithoutBatchInputSchema).optional(),
  farmer: z.lazy(() => UserCreateNestedOneWithoutBatchesCreatedInputSchema),
  retailCompany: z.lazy(() => CompanyCreateNestedOneWithoutRetailedBatchesInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyCreateNestedOneWithoutShippedBatchesInputSchema).optional(),
  transits: z.lazy(() => StepTransitCreateNestedManyWithoutBatchInputSchema).optional(),
});

export const BatchUncheckedCreateWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchUncheckedCreateWithoutQualityTestInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutBatchInputSchema).optional(),
});

export const BatchCreateOrConnectWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchCreateOrConnectWithoutQualityTestInput> = z.strictObject({
  where: z.lazy(() => BatchWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BatchCreateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedCreateWithoutQualityTestInputSchema) ]),
});

export const UserCreateWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserCreateWithoutQualityTestsInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutMembersInputSchema),
  batchesCreated: z.lazy(() => BatchCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitCreateNestedManyWithoutShipperInputSchema).optional(),
});

export const UserUncheckedCreateWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutQualityTestsInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  companyId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  batchesCreated: z.lazy(() => BatchUncheckedCreateNestedManyWithoutFarmerInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedCreateNestedManyWithoutShipperInputSchema).optional(),
});

export const UserCreateOrConnectWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutQualityTestsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedCreateWithoutQualityTestsInputSchema) ]),
});

export const BatchUpsertWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchUpsertWithoutQualityTestInput> = z.strictObject({
  update: z.union([ z.lazy(() => BatchUpdateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutQualityTestInputSchema) ]),
  create: z.union([ z.lazy(() => BatchCreateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedCreateWithoutQualityTestInputSchema) ]),
  where: z.lazy(() => BatchWhereInputSchema).optional(),
});

export const BatchUpdateToOneWithWhereWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchUpdateToOneWithWhereWithoutQualityTestInput> = z.strictObject({
  where: z.lazy(() => BatchWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BatchUpdateWithoutQualityTestInputSchema), z.lazy(() => BatchUncheckedUpdateWithoutQualityTestInputSchema) ]),
});

export const BatchUpdateWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchUpdateWithoutQualityTestInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutQualityTestInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutQualityTestInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
});

export const UserUpsertWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserUpsertWithoutQualityTestsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutQualityTestsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedCreateWithoutQualityTestsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutQualityTestsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutQualityTestsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutQualityTestsInputSchema) ]),
});

export const UserUpdateWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserUpdateWithoutQualityTestsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutMembersNestedInputSchema).optional(),
  batchesCreated: z.lazy(() => BatchUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUpdateManyWithoutShipperNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutQualityTestsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutQualityTestsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchUncheckedUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedUpdateManyWithoutShipperNestedInputSchema).optional(),
});

export const BatchCreateManyFarmerInputSchema: z.ZodType<Prisma.BatchCreateManyFarmerInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
  shipperCompanyId: z.string().optional().nullable(),
});

export const StepTransitCreateManyShipperInputSchema: z.ZodType<Prisma.StepTransitCreateManyShipperInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const QualityTestCreateManyRetailerInputSchema: z.ZodType<Prisma.QualityTestCreateManyRetailerInput> = z.strictObject({
  id: z.uuid().optional(),
  batchId: z.string(),
  txHash: z.string(),
  isPassed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  testedAt: z.coerce.date().optional(),
});

export const BatchUpdateWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUpdateWithoutFarmerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutFarmerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateManyWithoutFarmerInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutFarmerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitUpdateWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUpdateWithoutShipperInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  batch: z.lazy(() => BatchUpdateOneRequiredWithoutTransitsNestedInputSchema).optional(),
});

export const StepTransitUncheckedUpdateWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateWithoutShipperInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitUncheckedUpdateManyWithoutShipperInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateManyWithoutShipperInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QualityTestUpdateWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUpdateWithoutRetailerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batch: z.lazy(() => BatchUpdateOneRequiredWithoutQualityTestNestedInputSchema).optional(),
});

export const QualityTestUncheckedUpdateWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateWithoutRetailerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QualityTestUncheckedUpdateManyWithoutRetailerInputSchema: z.ZodType<Prisma.QualityTestUncheckedUpdateManyWithoutRetailerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  batchId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isPassed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  testedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateManyCompanyInputSchema: z.ZodType<Prisma.UserCreateManyCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  walletAddress: z.string(),
  fullName: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BatchCreateManyShipperCompanyInputSchema: z.ZodType<Prisma.BatchCreateManyShipperCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  retailCompanyId: z.string().optional().nullable(),
});

export const BatchCreateManyRetailCompanyInputSchema: z.ZodType<Prisma.BatchCreateManyRetailCompanyInput> = z.strictObject({
  id: z.uuid().optional(),
  blockchainId: z.string(),
  txHash: z.string(),
  productName: z.string(),
  category: z.lazy(() => CategorySchema).optional(),
  quantity: z.number(),
  unit: z.string(),
  ipfsHash: z.string(),
  status: z.lazy(() => BatchStatusSchema).optional(),
  farmerId: z.string(),
  harvestDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shipperCompanyId: z.string().optional().nullable(),
});

export const UserUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.UserUpdateWithoutCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  batchesCreated: z.lazy(() => BatchUncheckedUpdateManyWithoutFarmerNestedInputSchema).optional(),
  transports: z.lazy(() => StepTransitUncheckedUpdateManyWithoutShipperNestedInputSchema).optional(),
  qualityTests: z.lazy(() => QualityTestUncheckedUpdateManyWithoutRetailerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateManyWithoutCompanyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const BatchUpdateWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUpdateWithoutShipperCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  retailCompany: z.lazy(() => CompanyUpdateOneWithoutRetailedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutShipperCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateManyWithoutShipperCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutShipperCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  retailCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const BatchUpdateWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUpdateWithoutRetailCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityLogUpdateManyWithoutBatchNestedInputSchema).optional(),
  farmer: z.lazy(() => UserUpdateOneRequiredWithoutBatchesCreatedNestedInputSchema).optional(),
  shipperCompany: z.lazy(() => CompanyUpdateOneWithoutShippedBatchesNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateWithoutRetailCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activities: z.lazy(() => ActivityLogUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  transits: z.lazy(() => StepTransitUncheckedUpdateManyWithoutBatchNestedInputSchema).optional(),
  qualityTest: z.lazy(() => QualityTestUncheckedUpdateOneWithoutBatchNestedInputSchema).optional(),
});

export const BatchUncheckedUpdateManyWithoutRetailCompanyInputSchema: z.ZodType<Prisma.BatchUncheckedUpdateManyWithoutRetailCompanyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  blockchainId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ipfsHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BatchStatusSchema), z.lazy(() => EnumBatchStatusFieldUpdateOperationsInputSchema) ]).optional(),
  farmerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  harvestDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shipperCompanyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ActivityLogCreateManyBatchInputSchema: z.ZodType<Prisma.ActivityLogCreateManyBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  description: z.string(),
  timestamp: z.coerce.date().optional(),
  txHash: z.string(),
});

export const StepTransitCreateManyBatchInputSchema: z.ZodType<Prisma.StepTransitCreateManyBatchInput> = z.strictObject({
  id: z.uuid().optional(),
  shipperId: z.string(),
  txHash: z.string(),
  fromLocation: z.string(),
  toLocation: z.string(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  statusDetails: z.string().optional().nullable(),
  departureTime: z.coerce.date().optional(),
  arrivalTime: z.coerce.date().optional().nullable(),
});

export const ActivityLogUpdateWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActivityLogUncheckedUpdateWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ActivityLogUncheckedUpdateManyWithoutBatchInputSchema: z.ZodType<Prisma.ActivityLogUncheckedUpdateManyWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StepTransitUpdateWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shipper: z.lazy(() => UserUpdateOneRequiredWithoutTransportsNestedInputSchema).optional(),
});

export const StepTransitUncheckedUpdateWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shipperId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StepTransitUncheckedUpdateManyWithoutBatchInputSchema: z.ZodType<Prisma.StepTransitUncheckedUpdateManyWithoutBatchInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shipperId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  txHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  toLocation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  temperature: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  humidity: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vehicleNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  statusDetails: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  departureTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  arrivalTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const CompanyFindFirstArgsSchema: z.ZodType<Prisma.CompanyFindFirstArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(), CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyScalarFieldEnumSchema, CompanyScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CompanyFindFirstOrThrowArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(), CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyScalarFieldEnumSchema, CompanyScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyFindManyArgsSchema: z.ZodType<Prisma.CompanyFindManyArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(), CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyScalarFieldEnumSchema, CompanyScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyAggregateArgsSchema: z.ZodType<Prisma.CompanyAggregateArgs> = z.object({
  where: CompanyWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(), CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompanyGroupByArgsSchema: z.ZodType<Prisma.CompanyGroupByArgs> = z.object({
  where: CompanyWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyOrderByWithAggregationInputSchema.array(), CompanyOrderByWithAggregationInputSchema ]).optional(),
  by: CompanyScalarFieldEnumSchema.array(), 
  having: CompanyScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompanyFindUniqueArgsSchema: z.ZodType<Prisma.CompanyFindUniqueArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema, 
}).strict();

export const CompanyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CompanyFindUniqueOrThrowArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema, 
}).strict();

export const ActivityLogFindFirstArgsSchema: z.ZodType<Prisma.ActivityLogFindFirstArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(), 
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(), ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema, ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActivityLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActivityLogFindFirstOrThrowArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(), 
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(), ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema, ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActivityLogFindManyArgsSchema: z.ZodType<Prisma.ActivityLogFindManyArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereInputSchema.optional(), 
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(), ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityLogScalarFieldEnumSchema, ActivityLogScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ActivityLogAggregateArgsSchema: z.ZodType<Prisma.ActivityLogAggregateArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(), 
  orderBy: z.union([ ActivityLogOrderByWithRelationInputSchema.array(), ActivityLogOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityLogWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ActivityLogGroupByArgsSchema: z.ZodType<Prisma.ActivityLogGroupByArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(), 
  orderBy: z.union([ ActivityLogOrderByWithAggregationInputSchema.array(), ActivityLogOrderByWithAggregationInputSchema ]).optional(),
  by: ActivityLogScalarFieldEnumSchema.array(), 
  having: ActivityLogScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ActivityLogFindUniqueArgsSchema: z.ZodType<Prisma.ActivityLogFindUniqueArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema, 
}).strict();

export const ActivityLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActivityLogFindUniqueOrThrowArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema, 
}).strict();

export const BatchFindFirstArgsSchema: z.ZodType<Prisma.BatchFindFirstArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereInputSchema.optional(), 
  orderBy: z.union([ BatchOrderByWithRelationInputSchema.array(), BatchOrderByWithRelationInputSchema ]).optional(),
  cursor: BatchWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BatchFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BatchFindFirstOrThrowArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereInputSchema.optional(), 
  orderBy: z.union([ BatchOrderByWithRelationInputSchema.array(), BatchOrderByWithRelationInputSchema ]).optional(),
  cursor: BatchWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BatchFindManyArgsSchema: z.ZodType<Prisma.BatchFindManyArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereInputSchema.optional(), 
  orderBy: z.union([ BatchOrderByWithRelationInputSchema.array(), BatchOrderByWithRelationInputSchema ]).optional(),
  cursor: BatchWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BatchScalarFieldEnumSchema, BatchScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BatchAggregateArgsSchema: z.ZodType<Prisma.BatchAggregateArgs> = z.object({
  where: BatchWhereInputSchema.optional(), 
  orderBy: z.union([ BatchOrderByWithRelationInputSchema.array(), BatchOrderByWithRelationInputSchema ]).optional(),
  cursor: BatchWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BatchGroupByArgsSchema: z.ZodType<Prisma.BatchGroupByArgs> = z.object({
  where: BatchWhereInputSchema.optional(), 
  orderBy: z.union([ BatchOrderByWithAggregationInputSchema.array(), BatchOrderByWithAggregationInputSchema ]).optional(),
  by: BatchScalarFieldEnumSchema.array(), 
  having: BatchScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BatchFindUniqueArgsSchema: z.ZodType<Prisma.BatchFindUniqueArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereUniqueInputSchema, 
}).strict();

export const BatchFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BatchFindUniqueOrThrowArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereUniqueInputSchema, 
}).strict();

export const StepTransitFindFirstArgsSchema: z.ZodType<Prisma.StepTransitFindFirstArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereInputSchema.optional(), 
  orderBy: z.union([ StepTransitOrderByWithRelationInputSchema.array(), StepTransitOrderByWithRelationInputSchema ]).optional(),
  cursor: StepTransitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepTransitScalarFieldEnumSchema, StepTransitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StepTransitFindFirstOrThrowArgsSchema: z.ZodType<Prisma.StepTransitFindFirstOrThrowArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereInputSchema.optional(), 
  orderBy: z.union([ StepTransitOrderByWithRelationInputSchema.array(), StepTransitOrderByWithRelationInputSchema ]).optional(),
  cursor: StepTransitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepTransitScalarFieldEnumSchema, StepTransitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StepTransitFindManyArgsSchema: z.ZodType<Prisma.StepTransitFindManyArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereInputSchema.optional(), 
  orderBy: z.union([ StepTransitOrderByWithRelationInputSchema.array(), StepTransitOrderByWithRelationInputSchema ]).optional(),
  cursor: StepTransitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ StepTransitScalarFieldEnumSchema, StepTransitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const StepTransitAggregateArgsSchema: z.ZodType<Prisma.StepTransitAggregateArgs> = z.object({
  where: StepTransitWhereInputSchema.optional(), 
  orderBy: z.union([ StepTransitOrderByWithRelationInputSchema.array(), StepTransitOrderByWithRelationInputSchema ]).optional(),
  cursor: StepTransitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const StepTransitGroupByArgsSchema: z.ZodType<Prisma.StepTransitGroupByArgs> = z.object({
  where: StepTransitWhereInputSchema.optional(), 
  orderBy: z.union([ StepTransitOrderByWithAggregationInputSchema.array(), StepTransitOrderByWithAggregationInputSchema ]).optional(),
  by: StepTransitScalarFieldEnumSchema.array(), 
  having: StepTransitScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const StepTransitFindUniqueArgsSchema: z.ZodType<Prisma.StepTransitFindUniqueArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereUniqueInputSchema, 
}).strict();

export const StepTransitFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.StepTransitFindUniqueOrThrowArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereUniqueInputSchema, 
}).strict();

export const QualityTestFindFirstArgsSchema: z.ZodType<Prisma.QualityTestFindFirstArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereInputSchema.optional(), 
  orderBy: z.union([ QualityTestOrderByWithRelationInputSchema.array(), QualityTestOrderByWithRelationInputSchema ]).optional(),
  cursor: QualityTestWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QualityTestScalarFieldEnumSchema, QualityTestScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QualityTestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QualityTestFindFirstOrThrowArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereInputSchema.optional(), 
  orderBy: z.union([ QualityTestOrderByWithRelationInputSchema.array(), QualityTestOrderByWithRelationInputSchema ]).optional(),
  cursor: QualityTestWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QualityTestScalarFieldEnumSchema, QualityTestScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QualityTestFindManyArgsSchema: z.ZodType<Prisma.QualityTestFindManyArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereInputSchema.optional(), 
  orderBy: z.union([ QualityTestOrderByWithRelationInputSchema.array(), QualityTestOrderByWithRelationInputSchema ]).optional(),
  cursor: QualityTestWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QualityTestScalarFieldEnumSchema, QualityTestScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QualityTestAggregateArgsSchema: z.ZodType<Prisma.QualityTestAggregateArgs> = z.object({
  where: QualityTestWhereInputSchema.optional(), 
  orderBy: z.union([ QualityTestOrderByWithRelationInputSchema.array(), QualityTestOrderByWithRelationInputSchema ]).optional(),
  cursor: QualityTestWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QualityTestGroupByArgsSchema: z.ZodType<Prisma.QualityTestGroupByArgs> = z.object({
  where: QualityTestWhereInputSchema.optional(), 
  orderBy: z.union([ QualityTestOrderByWithAggregationInputSchema.array(), QualityTestOrderByWithAggregationInputSchema ]).optional(),
  by: QualityTestScalarFieldEnumSchema.array(), 
  having: QualityTestScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QualityTestFindUniqueArgsSchema: z.ZodType<Prisma.QualityTestFindUniqueArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereUniqueInputSchema, 
}).strict();

export const QualityTestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QualityTestFindUniqueOrThrowArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyCreateArgsSchema: z.ZodType<Prisma.CompanyCreateArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  data: z.union([ CompanyCreateInputSchema, CompanyUncheckedCreateInputSchema ]),
}).strict();

export const CompanyUpsertArgsSchema: z.ZodType<Prisma.CompanyUpsertArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema, 
  create: z.union([ CompanyCreateInputSchema, CompanyUncheckedCreateInputSchema ]),
  update: z.union([ CompanyUpdateInputSchema, CompanyUncheckedUpdateInputSchema ]),
}).strict();

export const CompanyCreateManyArgsSchema: z.ZodType<Prisma.CompanyCreateManyArgs> = z.object({
  data: z.union([ CompanyCreateManyInputSchema, CompanyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CompanyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CompanyCreateManyAndReturnArgs> = z.object({
  data: z.union([ CompanyCreateManyInputSchema, CompanyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CompanyDeleteArgsSchema: z.ZodType<Prisma.CompanyDeleteArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema, 
}).strict();

export const CompanyUpdateArgsSchema: z.ZodType<Prisma.CompanyUpdateArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  data: z.union([ CompanyUpdateInputSchema, CompanyUncheckedUpdateInputSchema ]),
  where: CompanyWhereUniqueInputSchema, 
}).strict();

export const CompanyUpdateManyArgsSchema: z.ZodType<Prisma.CompanyUpdateManyArgs> = z.object({
  data: z.union([ CompanyUpdateManyMutationInputSchema, CompanyUncheckedUpdateManyInputSchema ]),
  where: CompanyWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CompanyUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CompanyUpdateManyMutationInputSchema, CompanyUncheckedUpdateManyInputSchema ]),
  where: CompanyWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyDeleteManyArgsSchema: z.ZodType<Prisma.CompanyDeleteManyArgs> = z.object({
  where: CompanyWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActivityLogCreateArgsSchema: z.ZodType<Prisma.ActivityLogCreateArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  data: z.union([ ActivityLogCreateInputSchema, ActivityLogUncheckedCreateInputSchema ]),
}).strict();

export const ActivityLogUpsertArgsSchema: z.ZodType<Prisma.ActivityLogUpsertArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema, 
  create: z.union([ ActivityLogCreateInputSchema, ActivityLogUncheckedCreateInputSchema ]),
  update: z.union([ ActivityLogUpdateInputSchema, ActivityLogUncheckedUpdateInputSchema ]),
}).strict();

export const ActivityLogCreateManyArgsSchema: z.ZodType<Prisma.ActivityLogCreateManyArgs> = z.object({
  data: z.union([ ActivityLogCreateManyInputSchema, ActivityLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ActivityLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityLogCreateManyInputSchema, ActivityLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ActivityLogDeleteArgsSchema: z.ZodType<Prisma.ActivityLogDeleteArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  where: ActivityLogWhereUniqueInputSchema, 
}).strict();

export const ActivityLogUpdateArgsSchema: z.ZodType<Prisma.ActivityLogUpdateArgs> = z.object({
  select: ActivityLogSelectSchema.optional(),
  include: ActivityLogIncludeSchema.optional(),
  data: z.union([ ActivityLogUpdateInputSchema, ActivityLogUncheckedUpdateInputSchema ]),
  where: ActivityLogWhereUniqueInputSchema, 
}).strict();

export const ActivityLogUpdateManyArgsSchema: z.ZodType<Prisma.ActivityLogUpdateManyArgs> = z.object({
  data: z.union([ ActivityLogUpdateManyMutationInputSchema, ActivityLogUncheckedUpdateManyInputSchema ]),
  where: ActivityLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActivityLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityLogUpdateManyMutationInputSchema, ActivityLogUncheckedUpdateManyInputSchema ]),
  where: ActivityLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ActivityLogDeleteManyArgsSchema: z.ZodType<Prisma.ActivityLogDeleteManyArgs> = z.object({
  where: ActivityLogWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BatchCreateArgsSchema: z.ZodType<Prisma.BatchCreateArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  data: z.union([ BatchCreateInputSchema, BatchUncheckedCreateInputSchema ]),
}).strict();

export const BatchUpsertArgsSchema: z.ZodType<Prisma.BatchUpsertArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereUniqueInputSchema, 
  create: z.union([ BatchCreateInputSchema, BatchUncheckedCreateInputSchema ]),
  update: z.union([ BatchUpdateInputSchema, BatchUncheckedUpdateInputSchema ]),
}).strict();

export const BatchCreateManyArgsSchema: z.ZodType<Prisma.BatchCreateManyArgs> = z.object({
  data: z.union([ BatchCreateManyInputSchema, BatchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BatchCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BatchCreateManyAndReturnArgs> = z.object({
  data: z.union([ BatchCreateManyInputSchema, BatchCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BatchDeleteArgsSchema: z.ZodType<Prisma.BatchDeleteArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  where: BatchWhereUniqueInputSchema, 
}).strict();

export const BatchUpdateArgsSchema: z.ZodType<Prisma.BatchUpdateArgs> = z.object({
  select: BatchSelectSchema.optional(),
  include: BatchIncludeSchema.optional(),
  data: z.union([ BatchUpdateInputSchema, BatchUncheckedUpdateInputSchema ]),
  where: BatchWhereUniqueInputSchema, 
}).strict();

export const BatchUpdateManyArgsSchema: z.ZodType<Prisma.BatchUpdateManyArgs> = z.object({
  data: z.union([ BatchUpdateManyMutationInputSchema, BatchUncheckedUpdateManyInputSchema ]),
  where: BatchWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BatchUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BatchUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BatchUpdateManyMutationInputSchema, BatchUncheckedUpdateManyInputSchema ]),
  where: BatchWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BatchDeleteManyArgsSchema: z.ZodType<Prisma.BatchDeleteManyArgs> = z.object({
  where: BatchWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const StepTransitCreateArgsSchema: z.ZodType<Prisma.StepTransitCreateArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  data: z.union([ StepTransitCreateInputSchema, StepTransitUncheckedCreateInputSchema ]),
}).strict();

export const StepTransitUpsertArgsSchema: z.ZodType<Prisma.StepTransitUpsertArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereUniqueInputSchema, 
  create: z.union([ StepTransitCreateInputSchema, StepTransitUncheckedCreateInputSchema ]),
  update: z.union([ StepTransitUpdateInputSchema, StepTransitUncheckedUpdateInputSchema ]),
}).strict();

export const StepTransitCreateManyArgsSchema: z.ZodType<Prisma.StepTransitCreateManyArgs> = z.object({
  data: z.union([ StepTransitCreateManyInputSchema, StepTransitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const StepTransitCreateManyAndReturnArgsSchema: z.ZodType<Prisma.StepTransitCreateManyAndReturnArgs> = z.object({
  data: z.union([ StepTransitCreateManyInputSchema, StepTransitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const StepTransitDeleteArgsSchema: z.ZodType<Prisma.StepTransitDeleteArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  where: StepTransitWhereUniqueInputSchema, 
}).strict();

export const StepTransitUpdateArgsSchema: z.ZodType<Prisma.StepTransitUpdateArgs> = z.object({
  select: StepTransitSelectSchema.optional(),
  include: StepTransitIncludeSchema.optional(),
  data: z.union([ StepTransitUpdateInputSchema, StepTransitUncheckedUpdateInputSchema ]),
  where: StepTransitWhereUniqueInputSchema, 
}).strict();

export const StepTransitUpdateManyArgsSchema: z.ZodType<Prisma.StepTransitUpdateManyArgs> = z.object({
  data: z.union([ StepTransitUpdateManyMutationInputSchema, StepTransitUncheckedUpdateManyInputSchema ]),
  where: StepTransitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const StepTransitUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.StepTransitUpdateManyAndReturnArgs> = z.object({
  data: z.union([ StepTransitUpdateManyMutationInputSchema, StepTransitUncheckedUpdateManyInputSchema ]),
  where: StepTransitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const StepTransitDeleteManyArgsSchema: z.ZodType<Prisma.StepTransitDeleteManyArgs> = z.object({
  where: StepTransitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QualityTestCreateArgsSchema: z.ZodType<Prisma.QualityTestCreateArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  data: z.union([ QualityTestCreateInputSchema, QualityTestUncheckedCreateInputSchema ]),
}).strict();

export const QualityTestUpsertArgsSchema: z.ZodType<Prisma.QualityTestUpsertArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereUniqueInputSchema, 
  create: z.union([ QualityTestCreateInputSchema, QualityTestUncheckedCreateInputSchema ]),
  update: z.union([ QualityTestUpdateInputSchema, QualityTestUncheckedUpdateInputSchema ]),
}).strict();

export const QualityTestCreateManyArgsSchema: z.ZodType<Prisma.QualityTestCreateManyArgs> = z.object({
  data: z.union([ QualityTestCreateManyInputSchema, QualityTestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const QualityTestCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QualityTestCreateManyAndReturnArgs> = z.object({
  data: z.union([ QualityTestCreateManyInputSchema, QualityTestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const QualityTestDeleteArgsSchema: z.ZodType<Prisma.QualityTestDeleteArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  where: QualityTestWhereUniqueInputSchema, 
}).strict();

export const QualityTestUpdateArgsSchema: z.ZodType<Prisma.QualityTestUpdateArgs> = z.object({
  select: QualityTestSelectSchema.optional(),
  include: QualityTestIncludeSchema.optional(),
  data: z.union([ QualityTestUpdateInputSchema, QualityTestUncheckedUpdateInputSchema ]),
  where: QualityTestWhereUniqueInputSchema, 
}).strict();

export const QualityTestUpdateManyArgsSchema: z.ZodType<Prisma.QualityTestUpdateManyArgs> = z.object({
  data: z.union([ QualityTestUpdateManyMutationInputSchema, QualityTestUncheckedUpdateManyInputSchema ]),
  where: QualityTestWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QualityTestUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QualityTestUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QualityTestUpdateManyMutationInputSchema, QualityTestUncheckedUpdateManyInputSchema ]),
  where: QualityTestWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QualityTestDeleteManyArgsSchema: z.ZodType<Prisma.QualityTestDeleteManyArgs> = z.object({
  where: QualityTestWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();