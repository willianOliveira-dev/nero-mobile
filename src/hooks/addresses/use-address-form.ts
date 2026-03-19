import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    AddressFormData,
    addressSchema,
} from '../../schemas/addresses/address.schema';

export const useAddressForm = (defaultValues?: Partial<AddressFormData>) => {
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: '',
            recipientName: '',
            zipCode: '',
            street: '',
            complement: '',
            city: '',
            state: '',
            isDefault: false,
            ...defaultValues,
        },
    });

    const zipCode = form.watch('zipCode');

    useEffect(() => {
        const fetchCep = async () => {
            const cleanCep = zipCode?.replace(/\D/g, '') || '';
            
            if (cleanCep.length === 8) {
                try {
                    let addressData: { street?: string; city?: string; state?: string } | null = null;

                    try {
                        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
                        if (response.ok) {
                            addressData = await response.json();
                        }
                    } catch {
                    }
                    if (!addressData) {
                        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                        if (viaCepResponse.ok) {
                            const viaCepData = await viaCepResponse.json();
                            if (!viaCepData.erro) {
                                addressData = {
                                    street: viaCepData.logradouro,
                                    city: viaCepData.localidade,
                                    state: viaCepData.uf,
                                };
                            }
                        }
                    }
                    if (addressData) {
                        if (addressData.street) form.setValue('street', addressData.street, { shouldValidate: true });
                        if (addressData.city) form.setValue('city', addressData.city, { shouldValidate: true });
                        if (addressData.state) form.setValue('state', addressData.state, { shouldValidate: true });
                    }
                } catch {
                }
            }
        };

        fetchCep();
    }, [zipCode, form]);

    return form;
};
