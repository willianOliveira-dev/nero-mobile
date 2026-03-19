import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    profileSchema,
    ProfileFormData,
} from '../../schemas/users/profile.schema';

export const useProfileForm = (defaultValues?: Partial<ProfileFormData>) => {
    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            phone: '',
            genderPreference: 'unisex',
            ...defaultValues,
        },
    });

    return form;
};
