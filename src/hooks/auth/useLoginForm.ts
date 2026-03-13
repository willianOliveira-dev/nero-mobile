import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, LoginFormData } from '../../schemas/auth/auth.schema';

export const useLoginForm = (defaultValues?: Partial<LoginFormData>) => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            ...defaultValues,
        },
    });

    return form;
};
