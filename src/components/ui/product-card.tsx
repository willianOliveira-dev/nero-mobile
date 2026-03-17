import { Heart, ShoppingBag, Star, Truck } from 'lucide-react-native';
import React from 'react';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import { Image } from '../gluestack/ui/image';
import { Pressable } from '../gluestack/ui/pressable';
import { Text } from '../gluestack/ui/text';
import { VStack } from '../gluestack/ui/vstack';

interface Price {
    cents: number;
    value: number;
    formatted: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: {
        current: Price;
        original: Price | null;
        discountPercent: number | null;
    };
    freeShipping: boolean;
    ratingAvg: number | null;
    ratingCount: number;
    soldCount: number;
    imageUrl: string | null;
}

interface ProductCardProps {
    product: Product;
    showFavorite?: boolean;
    onPress?: () => void;
    onFavoritePress?: () => void;
}

export function ProductCard({
    product,
    showFavorite = true,
    onPress,
    onFavoritePress,
}: ProductCardProps) {
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleFavorite = (e: any) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        onFavoritePress?.();
    };

    const discountPercent = product.price.discountPercent;
    const hasDiscount = discountPercent && discountPercent > 0;

    return (
        <Pressable
            onPress={onPress}
            className="w-40 bg-white rounded-xl overflow-hidden border border-gray-100"
        >
            <Box className="w-full h-56 relative bg-gray-100">
                {product.imageUrl ? (
                    <Image
                        source={{ uri: product.imageUrl }}
                        alt={product.name}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <Box className="w-full h-full items-center justify-center">
                        <ShoppingBag size={32} color="#9CA3AF" />
                    </Box>
                )}

                {hasDiscount && (
                    <Box className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded-md z-10">
                        <Text className="text-white font-fredoka-semibold text-xs">
                            -{discountPercent}%
                        </Text>
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

                {product.ratingAvg && (
                    <HStack className="items-center gap-1">
                        <Star size={12} fill="#FBBF24" color="#FBBF24" />
                        <Text className="text-xs font-fredoka text-gray-600">
                            {product.ratingAvg.toFixed(1)}
                        </Text>
                        <Text className="text-xs font-fredoka text-gray-400">
                            ({product.ratingCount})
                        </Text>
                    </HStack>
                )}

                <VStack className="mt-1 gap-0">
                    {hasDiscount && (
                        <Text className="text-xs font-fredoka text-gray-400 line-through">
                            {product.price.original?.formatted}
                        </Text>
                    )}
                    <Text className="text-lg font-fredoka-semibold text-gray-900">
                        {product.price.current.formatted}
                    </Text>
                </VStack>
            </VStack>
        </Pressable>
    );
}
