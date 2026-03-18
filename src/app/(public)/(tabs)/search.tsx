import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { SearchFiltersModal } from '@/src/components/ui/search-filters-modal';
import { ProductCard } from '@/src/components/ui/product-card';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useInfiniteProducts } from '@/src/hooks/products/use-infinite-products';
import { useSearchStore } from '@/src/store/use-search-store';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, SearchX, SlidersHorizontal } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
    const router = useRouter();
    const { filters, setFilters, clearFilters } = useSearchStore();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            return () => {
                clearFilters();
            };
        }, [])
    );
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteProducts(filters);
        
    const products = data?.pages.flatMap((page) => page.items ?? []) ?? [];

    return (
        <SafeAreaView className="flex-1 bg-white pt-4">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <VStack className="px-5 pt-2 pb-4 border-b border-gray-100 space-y-4">
                <HStack className="items-center justify-between">
                    <Pressable onPress={() => router.back()} className="p-2 -mx-2">
                        <ArrowLeft size={24} color="#272727" />
                    </Pressable>
                    <Text className="text-lg font-fredoka-medium text-typography-900">Busca</Text>
                    <Pressable onPress={() => setIsFilterModalVisible(true)} className="p-2 -mx-2">
                        <SlidersHorizontal size={24} color="#272727" />
                    </Pressable>
                </HStack>

                <Box className='mb-8 mt-4'>
                    <SearchBar
                        value={filters.q ?? ''}
                        onChangeText={(text) => setFilters({ q: text })}
                        returnKeyType="search"
                        placeholders={['Procure por camisas, tênis, etc...']}
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
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Box className="w-1/2 p-2">
                            <ProductCard product={item as any} />
                        </Box>
                    )}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
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
            
            <SearchFiltersModal visible={isFilterModalVisible} onClose={() => setIsFilterModalVisible(false)} />
        </SafeAreaView>
    );
}
