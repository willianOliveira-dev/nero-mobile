import React, { useState } from 'react';
import { Star } from 'lucide-react-native';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { Image } from '@/src/components/gluestack/ui/image';
import { imagesPath } from '@/src/constants/images';
import { ReviewModal } from './review-modal';
import type { GetOrder200ItemsItemReview } from '@/src/api/generated/model';

type OrderProductItemProps = {
    productId: string;
    productName: string;
    productImage: string;
    variant: string | null;
    price: string;
    review: GetOrder200ItemsItemReview | null | undefined;
    orderId: string;
};

export function OrderProductItem({
    productId,
    productName,
    productImage,
    variant,
    price,
    review,
    orderId,
}: OrderProductItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isReviewed = !!review;

    return (
        <>
            <HStack className="bg-white border border-border rounded-xl p-3 gap-3">
            
                <Box className="w-16 h-16 rounded-lg overflow-hidden bg-surface-muted">
                    <Image
                        source={productImage ? { uri: productImage } : imagesPath.neroPlaceholder}
                        alt={productName}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </Box>

      
                <VStack className="flex-1 justify-center gap-1">
                    <Text className="text-sm font-fredoka-semibold text-[#272727]" numberOfLines={1}>
                        {productName}
                    </Text>
                    {variant && (
                        <Text className="text-xs font-fredoka text-text-muted">
                            {variant}
                        </Text>
                    )}
                    <HStack className="justify-between items-center mt-1">
                        <Text className="text-xs font-fredoka-semibold text-primary">
                            {price}
                        </Text>

                     
                        {isReviewed ? (
                            <Pressable 
                                onPress={() => setIsModalOpen(true)}
                                className="bg-green-100 px-3 py-1 rounded-full flex-row items-center gap-1"
                            >
                                <Star size={12} color="#15803d" fill="#15803d" />
                                <Text className="text-[11px] font-fredoka-semibold text-green-700">
                                    Avaliado
                                </Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => setIsModalOpen(true)}
                                className="bg-primary px-3 py-1 rounded-full flex-row items-center gap-1"
                            >
                                <Star size={12} color="#fff" />
                                <Text className="text-[11px] font-fredoka-semibold text-white">
                                    Avaliar
                                </Text>
                            </Pressable>
                        )}
                    </HStack>
                </VStack>
            </HStack>

         
            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={productId}
                productName={productName}
                productImage={productImage}
                orderId={orderId}
                skuVariant={variant}
                initialReview={review}
            />
        </>
    );
}
