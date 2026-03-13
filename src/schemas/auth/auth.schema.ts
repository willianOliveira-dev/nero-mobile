import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .email({ message: 'E-mail inválido.' })
        .nonempty('E-mail é obrigatório.'),
    password: z.string().nonempty('Senha é obrigatória.'),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Nome é obrigatório.')
            .min(3, 'Mínimo 3 caracteres.'),
        email: z
            .email({ message: 'E-mail inválido.' })
            .nonempty({ message: 'E-mail é obrigatório.' }),
        password: z
            .string()
            .min(8, 'Mínimo 8 caracteres.')
            .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula.')
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                'Deve conter pelo menos um caractere especial.',
            )
            .nonempty('Senha é obrigatória.'),
        confirmPassword: z.string().nonempty('Confirme sua senha.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não conferem.',
        path: ['confirmPassword'],
    });


export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
