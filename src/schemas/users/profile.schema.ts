import { z } from 'zod';

export const profileSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório.')
        .min(3, 'Mínimo 3 caracteres.'),
    phone: z
        .string()
        .optional()
        .nullable(),
    genderPreference: z
        .enum(['men', 'women', 'kids', 'unisex']),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
