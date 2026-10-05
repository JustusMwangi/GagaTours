import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role_id: z.string().optional(),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const updateUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  is_active: z.boolean().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    current_password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: 'Password must be at least 8 characters',
      }),
    new_password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: 'Password must be at least 8 characters',
      }),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.new_password && !data.current_password) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required when setting a new password',
      path: ['current_password'],
    }
  )
  .refine(
    (data) => {
      if (data.new_password && data.new_password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }
  );

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
