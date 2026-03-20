import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../schemas/auth/auth.schema';

export const useForgotPasswordForm = () => {
    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    return form;
};
