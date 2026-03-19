import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { CardBrandLogo, CARD_BRAND_CONFIG, type CardBrand } from './card-brand-logo';

type PaymentCardProps = {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    cardholderName?: string | null;
    isDefault?: boolean;
    compact?: boolean;
};

function formatExpiry(month: number, year: number): string {
    const m = String(month).padStart(2, '0');
    const y = String(year).slice(-2);
    return `${m}/${y}`;
}

export function PaymentCard({
    brand,
    last4,
    expMonth,
    expYear,
    cardholderName,
    isDefault = false,
    compact = false,
}: PaymentCardProps) {
    const { width: screenWidth } = useWindowDimensions();
    const config = CARD_BRAND_CONFIG[brand] || CARD_BRAND_CONFIG.unknown;

    const cardWidth = compact ? screenWidth - 80 : screenWidth - 48;
    const cardHeight = cardWidth / 1.586;

    return (
        <View
            style={{
                width: cardWidth,
                height: cardHeight,
                backgroundColor: config.bgColor,
                borderRadius: 16,
                padding: 20,
                justifyContent: 'space-between',
                overflow: 'hidden',
            }}
        >
            <HStack className="items-start justify-between">
                <CardBrandLogo brand={brand} size="lg" />
                {isDefault && (
                    <Box className="bg-warning rounded-full px-3 py-1">
                        <Text className="text-2xs font-fredoka-bold text-white">
                            Padrão
                        </Text>
                    </Box>
                )}
            </HStack>

            <VStack className="gap-1">
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: 18,
                        fontFamily: 'Fredoka-SemiBold',
                        letterSpacing: 3,
                    }}
                >
                    {'****  ****  ****  '}{last4}
                </Text>
            </VStack>

            <HStack className="items-end justify-between">
                <VStack>
                    {cardholderName && (
                        <Text
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: 10,
                                fontFamily: 'Fredoka-Regular',
                            }}
                        >
                            TITULAR
                        </Text>
                    )}
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: 13,
                            fontFamily: 'Fredoka-Medium',
                            textTransform: 'uppercase',
                        }}
                        numberOfLines={1}
                    >
                        {cardholderName || ''}
                    </Text>
                </VStack>

                <VStack className="items-end">
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 10,
                            fontFamily: 'Fredoka-Regular',
                        }}
                    >
                        VALIDADE
                    </Text>
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: 13,
                            fontFamily: 'Fredoka-Medium',
                        }}
                    >
                        {formatExpiry(expMonth, expYear)}
                    </Text>
                </VStack>
            </HStack>
        </View>
    );
}
