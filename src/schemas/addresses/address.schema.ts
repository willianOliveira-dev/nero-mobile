import { z } from 'zod';

export const addressSchema = z.object({
    label: z.string().optional().nullable(),
    recipientName: z
        .string()
        .min(2, 'Nome do destinatário deve ter no mínimo 2 caracteres.')
        .max(150, 'Máximo de 150 caracteres.')
        .nonempty('Nome do destinatário é obrigatório.'),
    zipCode: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000 ou 00000000.')
        .nonempty('CEP é obrigatório.'),
    street: z
        .string()
        .min(3, 'Endereço deve ter no mínimo 3 caracteres.')
        .max(255, 'Máximo de 255 caracteres.')
        .nonempty('O endereço é obrigatório.'),
    complement: z.string().optional().nullable(),
    city: z
        .string()
        .min(2, 'A cidade deve ter no mínimo 2 caracteres.')
        .max(120, 'Máximo de 120 caracteres.')
        .nonempty('A cidade é obrigatória.'),
    state: z
        .string()
        .min(2, 'A sigla do estado deve ter 2 caracteres.')
        .max(2, 'A sigla do estado deve ter 2 caracteres.')
        .nonempty('O estado é obrigatório.'),
    isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
