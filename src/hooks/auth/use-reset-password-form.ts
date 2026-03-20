import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas/auth/auth.schema';

export const useResetPasswordForm = () => {
    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    return form;
};
