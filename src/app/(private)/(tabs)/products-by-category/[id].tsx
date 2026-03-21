import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { ProductCard } from '@/src/components/ui/product-card';
import { SearchBar } from '@/src/components/ui/search-bar';
import { SearchFiltersModal } from '@/src/components/ui/search-filters-modal';
import { useInfiniteProducts } from '@/src/hooks/products/use-infinite-products';
import { useSearchStore } from '@/src/store/use-search-store';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ArrowLeft, SearchX, SlidersHorizontal } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsByCategoryScreen() {
    const { goBack } = useSafeBack();
    const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
    const { filters, setFilters, clearFilters } = useSearchStore();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [localQuery, setLocalQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            setFilters({ categoryId: id });

            return () => {
                clearFilters();
                setLocalQuery('');
            };
        }, [id]),
    );

    const categoryFilters = useMemo(
        () => ({ ...filters, categoryId: id }),
        [filters, id],
    );

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteProducts(categoryFilters);

    const products = data?.pages.flatMap((page) => page.items ?? []) ?? [];

    const handleSearch = () => {
        if (localQuery.trim().length > 0) {
            setFilters({ q: localQuery });
        } else {
            setFilters({ q: undefined });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white pt-4">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <VStack className="px-5 pt-2 pb-4 border-b border-gray-100 space-y-4">
                <HStack className="items-center justify-between">
                    <Pressable
                        onPress={() => goBack()}
                        className="p-2 -mx-2"
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                    >
                        <ArrowLeft size={24} color="#272727" />
                    </Pressable>

                    <Text
                        className="text-lg font-fredoka-medium text-typography-900 flex-1 text-center"
                        numberOfLines={1}
                    >
                        {name ?? 'Produtos'}
                    </Text>

                    <Pressable
                        onPress={() => setIsFilterModalVisible(true)}
                        className="p-2 -mx-2"
                        accessibilityRole="button"
                        accessibilityLabel="Filtros"
                    >
                        <SlidersHorizontal size={24} color="#272727" />
                    </Pressable>
                </HStack>

                <Box className="mb-8 mt-4">
                    <SearchBar
                        value={localQuery}
                        onChangeText={setLocalQuery}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                        placeholders={['Buscar nesta categoria...']}
                    />
                </Box>
            </VStack>

            {isLoading ? (
                <Box className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#d70040" />
                </Box>
            ) : (
                <FlatList
                    data={products}
                    numColumns={2}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingTop: 16,
                        paddingBottom: 40,
                    }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Box className="w-1/2 p-2">
                            <ProductCard product={item} />
                        </Box>
                    )}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <Box className="py-4 items-center">
                                <ActivityIndicator size="small" color="#d70040" />
                            </Box>
                        ) : null
                    }
                    ListEmptyComponent={
                        <VStack className="flex-1 items-center justify-center pt-20 space-y-4">
                            <SearchX size={48} color="#d4d4d4" />
                            <Text className="text-gray-500 font-fredoka text-base">
                                Nenhum produto encontrado.
                            </Text>
                        </VStack>
                    }
                />
            )}

            <SearchFiltersModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
            />
        </SafeAreaView>
    );
}
