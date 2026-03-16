import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    registerSchema,
    RegisterFormData,
} from '../../schemas/auth/auth.schema';

export const useRegisterForm = (defaultValues?: Partial<RegisterFormData>) => {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            ...defaultValues,
        },
    });

    return form;
};
