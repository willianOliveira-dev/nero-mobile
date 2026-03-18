import { useRouter } from 'expo-router';
import { Heart, ShoppingBag, Star, Truck } from 'lucide-react-native';
import React from 'react';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import { Image } from '../gluestack/ui/image';
import { Pressable } from '../gluestack/ui/pressable';
import { Text } from '../gluestack/ui/text';
import { VStack } from '../gluestack/ui/vstack';
import type { GetHome200ItemItemsItem } from '@/src/api/generated/model';

interface ProductCardProps {
    product: GetHome200ItemItemsItem;
    showFavorite?: boolean;
    onFavoritePress?: () => void;
}

export function ProductCard({
    product,
    showFavorite = true,
    onFavoritePress,
}: ProductCardProps) {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleFavorite = (e: any) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        onFavoritePress?.();
    };

    const hasPriceVariation = product.pricing?.hasPriceVariation ?? false;

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/product/[slug]',
                    params: { slug: product.slug },
                })
            }
            className="w-40 bg-white rounded-xl overflow-hidden border border-gray-100"
        >
            <Box className="w-full h-56 relative bg-gray-100">
                {product.thumbnailUrl ? (
                    <Image
                        source={{ uri: product.thumbnailUrl }}
                        alt={product.name}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <Box className="w-full h-full items-center justify-center">
                        <ShoppingBag size={32} color="#9CA3AF" />
                    </Box>
                )}

                {product.freeShipping && (
                    <Box className="absolute bottom-2 left-2 bg-green-600 px-2 py-1 rounded-md z-10 flex-row items-center gap-1">
                        <Truck size={12} color="white" />
                        <Text className="text-white font-fredoka-semibold text-xs">
                            FRETE GRÁTIS
                        </Text>
                    </Box>
                )}

                {showFavorite && (
                    <Pressable
                        onPress={handleFavorite}
                        hitSlop={8}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 items-center justify-center"
                    >
                        <Heart
                            size={16}
                            color={isFavorite ? '#E11D48' : '#6B7280'}
                            fill={isFavorite ? '#E11D48' : 'none'}
                        />
                    </Pressable>
                )}
            </Box>

            <VStack className="p-2 gap-1">
                <Text
                    className="text-sm font-fredoka-medium text-gray-900"
                    numberOfLines={2}
                >
                    {product.name}
                </Text>

                {product.rating.average > 0 && (
                    <HStack className="items-center gap-1">
                        <Star size={12} fill="#FBBF24" color="#FBBF24" />
                        <Text className="text-xs font-fredoka text-gray-600">
                            {product.rating.average.toFixed(1)}
                        </Text>
                        <Text className="text-xs font-fredoka text-gray-400">
                            ({product.rating.count})
                        </Text>
                    </HStack>
                )}

                <VStack className="mt-1 gap-0">
                    {hasPriceVariation && product.pricing ? (
                        <Text className="text-xs font-fredoka text-gray-500">
                            a partir de
                        </Text>
                    ) : null}
                    <Text className="text-lg font-fredoka-semibold text-gray-900">
                        {product.pricing?.displayPriceMin.formatted ?? '—'}
                    </Text>
                </VStack>
            </VStack>
        </Pressable>
    );
}
