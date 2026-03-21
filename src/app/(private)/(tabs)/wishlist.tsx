import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { ProductCard } from '@/src/components/ui/product-card';
import { useGetWishlist } from '@/src/api/generated/wishlist/wishlist';
import { HeartCrack } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

export default function WishlistScreen() {
    const { data: wishlistData, isLoading, refetch, isRefetching } = useGetWishlist();

    const products = wishlistData?.items ?? [];

    return (
        <SafeAreaView className="flex-1 bg-white pt-4">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <VStack className="px-5 pt-2 pb-4 border-b border-gray-100">
                <HStack className="items-center justify-center">
                    <Text className="text-xl font-fredoka-semibold text-typography-900">
                        Meus Favoritos
                    </Text>
                </HStack>
            </VStack>

            {isLoading ? (
                <Box className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#d70040" />
                </Box>
            ) : (
                <FlatList
                    data={products}
                    numColumns={2}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Box className="w-1/2 p-2">
                            <ProductCard 
                                product={item} 
                                isFavorite={true}
                            />
                        </Box>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={refetch}
                            colors={['#d70040']}
                            tintColor="#d70040"
                        />
                    }
                    ListEmptyComponent={
                        <VStack className="flex-1 items-center justify-center pt-32 space-y-4">
                            <HeartCrack size={64} color="#d4d4d4" />
                            <Text className="text-gray-500 font-fredoka text-base">
                                Nenhum produto na lista de desejos
                            </Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
