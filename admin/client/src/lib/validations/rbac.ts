import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role name must be 100 characters or less'),
  description: z.string().optional(),
  permission_ids: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Role name must be 100 characters or less')
    .optional(),
  description: z.string().optional(),
  permission_ids: z.array(z.string()).optional(),
});

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
