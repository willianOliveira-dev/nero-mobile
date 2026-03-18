import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';

import { useGetProductBySlug } from '@/src/api/generated/products/products';
import { useListReviews } from '@/src/api/generated/reviews/reviews';

import { AddToCartBar } from '@/src/components/ui/add-to-cart-bar';
import { ProductHeader } from '@/src/components/ui/product-header';
import { ProductImageGallery } from '@/src/components/ui/product-image-gallery';
import { QuantitySelector } from '@/src/components/ui/quantity-selector';
import { ReviewsSection } from '@/src/components/ui/reviews-section';
import { ShippingInfo } from '@/src/components/ui/shipping-info';
import { VariationSelector } from '@/src/components/ui/variation-selector';

import { ProductDetailSkeleton } from '@/src/components/ui/product-detail-skeleton';

import { useProductVariants } from '@/src/hooks/products/use-product-variants';

//  TODO: substituir pelo hook funcional quando estiver pronto 
// import { useWishlist } from '@/src/hooks/useWishlist';
function useWishlistStub(productId: string | undefined) {
    const [isFavorite, setIsFavorite] = useState(false);
    const toggle = () => setIsFavorite((prev) => !prev);
    return { isFavorite, toggle };
}

export default function ProductScreen() {
    const router = useRouter();
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const {
        data: product,
        isLoading,
        error,
    } = useGetProductBySlug(slug as string);

    const { data: reviewsData } = useListReviews(
        { productId: product?.id ?? '', limit: 5 },
        { query: { enabled: !!product?.id } },
    );

    const { isFavorite, toggle: toggleFavorite } = useWishlistStub(product?.id);
    const variants = useProductVariants(
        product ?? ({} as NonNullable<typeof product>),
    );

    const {
        selectedOptions,
        activeSku,
        selectOption,
        isOptionAvailable,
        quantity,
        incrementQuantity,
        decrementQuantity,
        maxStock,
        isOutOfStock,
        displayPrice,
        compareAtPrice,
        discountPercent,
        currentPrice,
    } = variants;


    const galleryImages = useMemo(() => {
        if (!product) return [];

        const baseImages = product.images.map((i) => i.url);

        if (product.hasVariations && product.variationTypes) {
            const imageType = product.variationTypes.find((vt) => vt.hasImage);
            if (imageType) {
                const selectedOptId = selectedOptions[imageType.id];
                const selectedOpt = imageType.options.find(
                    (o) => o.id === selectedOptId,
                );
                if (selectedOpt?.imageUrl) {
                    return [selectedOpt.imageUrl, ...baseImages];
                }
            }
        }

        return baseImages;
    }, [product, selectedOptions]);

    const allVariationsSelected = useMemo(() => {
        if (!product?.hasVariations || !product.variationTypes) return true;
        return product.variationTypes.every((vt) => !!selectedOptions[vt.id]);
    }, [product, selectedOptions]);


    const unitValue = currentPrice?.price?.value ?? 0;

    const reviews = reviewsData?.items ?? [];

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center gap-4">
                <Text className="text-base font-fredoka text-typography-900">
                    Produto não encontrado.
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="px-6 py-3 bg-primary rounded-full"
                >
                    <Text className="text-sm font-fredoka-semibold text-white">
                        Voltar
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

    
            <HStack className="absolute top-12 left-0 right-0 px-5 justify-between z-10">
                <Pressable
                    onPress={() => router.back()}
                    className="w-11 h-11 rounded-full bg-white/90 items-center justify-center shadow-sm"
                >
                    <ArrowLeft size={20} color="#272727" />
                </Pressable>

                <Pressable
                    onPress={toggleFavorite}
                    className="w-11 h-11 rounded-full bg-white/90 items-center justify-center shadow-sm"
                >
                    <Heart
                        size={20}
                        color={isFavorite ? '#d70040' : '#272727'}
                        fill={isFavorite ? '#d70040' : 'transparent'}
                    />
                </Pressable>
            </HStack>

            <FlatList
                data={[]}
                renderItem={null}
                keyExtractor={() => 'content'}
                contentContainerStyle={{ paddingBottom: 120 }}
                ListHeaderComponent={
                    <VStack>
                      
                        <ProductImageGallery images={galleryImages} />

                        <VStack className="px-5 py-7 gap-7">
                          
                            <ProductHeader
                                name={product.name}
                                brand={product.brand}
                                rating={product.rating}
                                displayPrice={displayPrice}
                                compareAtPrice={compareAtPrice}
                                discountPercent={discountPercent}
                                hasPriceVariation={
                                    product.pricing?.hasPriceVariation ?? false
                                }
                                priceRange={product.pricing?.priceRange ?? null}
                                hasSelectedSku={!!activeSku}
                            />

                        
                            {product.hasVariations &&
                                product.variationTypes && (
                                    <VStack className="gap-6">
                                        {product.variationTypes.map((vType) => (
                                            <VariationSelector
                                                key={vType.id}
                                                variationType={vType}
                                                selectedOptionId={
                                                    selectedOptions[vType.id]
                                                }
                                                onSelect={selectOption}
                                                isOptionAvailable={
                                                    isOptionAvailable
                                                }
                                            />
                                        ))}
                                    </VStack>
                                )}

                           
                            <QuantitySelector
                                quantity={quantity}
                                maxStock={maxStock}
                                onIncrement={incrementQuantity}
                                onDecrement={decrementQuantity}
                            />

                        
                            {product.description && (
                                <VStack className="gap-2">
                                    <Text className="text-sm font-fredoka-semibold text-typography-900 uppercase tracking-widest">
                                        Descrição
                                    </Text>
                                    <Text className="text-sm font-fredoka text-secondary-muted leading-relaxed">
                                        {product.description}
                                    </Text>
                                </VStack>
                            )}

                          
                            <ShippingInfo
                                freeShipping={product.features.freeShipping}
                            />

                          
                            <ReviewsSection
                                rating={product.rating}
                                reviews={reviews}
                            />
                        </VStack>
                    </VStack>
                }
            />

  
            <AddToCartBar
                isOutOfStock={isOutOfStock}
                totalValue={unitValue}
                quantity={quantity}
                hasVariations={product.hasVariations}
                allVariationsSelected={allVariationsSelected}
                onAddToCart={() => {
                    // TODO: dispatch para o carrinho com activeSku.id ou simpleProduct
                    const skuId = product.hasVariations
                        ? activeSku?.id
                        : 'simple';
                    console.log('ADD TO CART', { skuId, quantity });
                }}
            />
        </SafeAreaView>
    );
}