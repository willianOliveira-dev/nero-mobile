import { useListBrands } from '@/src/api/generated/brands/brands';
import { useSearchStore } from '@/src/store/use-search-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const filterSchema = z.object({
    gender: z.enum(['men', 'women', 'kids', 'unisex']).optional(),
    sort: z.enum(['recommended', 'newest', 'price_asc', 'price_desc']).optional(),
    deals: z.enum(['on_sale', 'free_shipping']).optional(),
    brandId: z.string().uuid().optional(),
    priceMin: z.coerce.number().positive().optional(),
    priceMax: z.coerce.number().positive().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface Props {
    visible: boolean;
    onClose: () => void;
}

const SORT_OPTIONS = [
    { label: 'Recomendados', value: 'recommended' },
    { label: 'Lançamentos', value: 'newest' },
    { label: 'Menor Preço', value: 'price_asc' },
    { label: 'Maior Preço', value: 'price_desc' },
];

const GENDER_OPTIONS = [
    { label: 'Todos', value: 'unisex' },
    { label: 'Masculino', value: 'men' },
    { label: 'Feminino', value: 'women' },
    { label: 'Infantil', value: 'kids' },
];

const DEALS_OPTIONS = [
    { label: 'Em Promoção', value: 'on_sale' },
    { label: 'Frete Grátis', value: 'free_shipping' }
];

export function SearchFiltersModal({ visible, onClose }: Props) {
    const { filters, setFilters, clearFilters } = useSearchStore();
    const { data: brandsData, isPending: isBrandsLoading } = useListBrands();
    const brands = brandsData?.data ?? [];

    const { control, handleSubmit, reset } = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema) as any,
        defaultValues: {
            sort: filters.sort,
            gender: filters.gender,
            deals: filters.deals,
            brandId: filters.brandId,
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
        },
    });

    useEffect(() => {
        if (visible) {
            reset({
                sort: filters.sort,
                gender: filters.gender,
                deals: filters.deals,
                brandId: filters.brandId,
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
            });
        }
    }, [visible, filters, reset]);

    const onSubmit = (data: FilterFormValues) => {
        setFilters(data);
        onClose();
    };

    const handleClear = () => {
        clearFilters();
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl min-h-[80%] max-h-[90%] p-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-fredoka-medium text-typography-900">
                            Filtros e Ordenação
                        </Text>
                        <Pressable onPress={onClose} className="p-2 -mr-2">
                            <X size={24} color="#272727" />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                   
                        <View className="mb-6">
                            <Text className="text-sm font-fredoka-medium text-gray-500 mb-3 uppercase">Ordenar Por</Text>
                            <Controller
                                control={control}
                                name="sort"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row flex-wrap gap-2">
                                        {SORT_OPTIONS.map((opt) => (
                                            <Pressable
                                                key={opt.value}
                                                onPress={() => onChange(value === opt.value ? undefined : opt.value)}
                                                className={`px-4 py-2 border rounded-full ${
                                                    value === opt.value
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <Text
                                                    className={`text-sm font-fredoka-medium ${
                                                        value === opt.value ? 'text-white' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>

                   
                        <View className="mb-6">
                            <Text className="text-sm font-fredoka-medium text-gray-500 mb-3 uppercase">Gênero</Text>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row flex-wrap gap-2">
                                        {GENDER_OPTIONS.map((opt) => (
                                            <Pressable
                                                key={opt.value}
                                                onPress={() => onChange(value === opt.value ? undefined : opt.value)}
                                                className={`px-4 py-2 border rounded-full ${
                                                    value === opt.value
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <Text
                                                    className={`text-sm font-fredoka-medium ${
                                                        value === opt.value ? 'text-white' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>

                  
                        <View className="mb-6">
                            <Text className="text-sm font-fredoka-medium text-gray-500 mb-3 uppercase">Marca</Text>
                            <Controller
                                control={control}
                                name="brandId"
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        {isBrandsLoading ? (
                                            <ActivityIndicator size="small" color="#d70040" />
                                        ) : (
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{ gap: 8 }}
                                            >
                                                {brands.map((brand) => (
                                                    <Pressable
                                                        key={brand.id}
                                                        onPress={() => onChange(value === brand.id ? undefined : brand.id)}
                                                        className={`px-4 py-2 border rounded-full ${
                                                            value === brand.id
                                                                ? 'bg-primary border-primary'
                                                                : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <Text
                                                            className={`text-sm font-fredoka-medium ${
                                                                value === brand.id ? 'text-white' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {brand.name}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                )}
                            />
                        </View>

                   
                        <View className="mb-6">
                            <Text className="text-sm font-fredoka-medium text-gray-500 mb-3 uppercase">Ofertas Especiais</Text>
                            <Controller
                                control={control}
                                name="deals"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row flex-wrap gap-2">
                                        {DEALS_OPTIONS.map((opt) => (
                                            <Pressable
                                                key={opt.value}
                                                onPress={() => onChange(value === opt.value ? undefined : opt.value)}
                                                className={`px-4 py-2 border rounded-full ${
                                                    value === opt.value
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-white border-gray-200'
                                                }`}
                                            >
                                                <Text
                                                    className={`text-sm font-fredoka-medium ${
                                                        value === opt.value ? 'text-white' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            />
                        </View>

                    
                        <View className="mb-6">
                            <Text className="text-sm font-fredoka-medium text-gray-500 mb-3 uppercase">Faixa de Preço (R$)</Text>
                            <View className="flex-row items-center gap-4">
                                <Controller
                                    control={control}
                                    name="priceMin"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-fredoka text-typography-900"
                                            placeholder="Mínimo"
                                            keyboardType="numeric"
                                            value={value?.toString() ?? ''}
                                            onChangeText={(v) => onChange(v ? Number(v) : undefined)}
                                        />
                                    )}
                                />
                                <Text className="font-fredoka text-gray-400">-</Text>
                                <Controller
                                    control={control}
                                    name="priceMax"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-fredoka text-typography-900"
                                            placeholder="Máximo"
                                            keyboardType="numeric"
                                            value={value?.toString() ?? ''}
                                            onChangeText={(v) => onChange(v ? Number(v) : undefined)}
                                        />
                                    )}
                                />
                            </View>
                        </View>

                    </ScrollView>

                    <View className="flex-row items-center gap-4 pt-4 border-t border-gray-100">
                        <Pressable onPress={handleClear} className="flex-1 py-4 items-center justify-center border border-gray-200 rounded-2xl">
                            <Text className="font-fredoka-medium text-gray-700 text-base">Limpar</Text>
                        </Pressable>
                        <Pressable onPress={handleSubmit(onSubmit)} className="flex-1 py-4 bg-primary items-center justify-center rounded-2xl">
                            <Text className="font-fredoka-medium text-white text-base">Aplicar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
