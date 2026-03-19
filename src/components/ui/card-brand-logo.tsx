import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/components/gluestack/ui/text';

export type CardBrand =
    | 'visa'
    | 'mastercard'
    | 'amex'
    | 'elo'
    | 'hipercard'
    | 'unknown';

export const CARD_BRAND_CONFIG: Record<
    CardBrand,
    { label: string; bgColor: string; textColor: string }
> = {
    visa: { label: 'VISA', bgColor: '#1A1F71', textColor: '#FFFFFF' },
    mastercard: { label: 'MC', bgColor: '#EB001B', textColor: '#FFFFFF' },
    amex: { label: 'AMEX', bgColor: '#2E77BC', textColor: '#FFFFFF' },
    elo: { label: 'ELO', bgColor: '#FFD700', textColor: '#000000' },
    hipercard: { label: 'HIPER', bgColor: '#B20000', textColor: '#FFFFFF' },
    unknown: { label: 'CARD', bgColor: '#2A2A2A', textColor: '#FFFFFF' },
};

type CardBrandLogoProps = {
    brand: CardBrand;
    size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
    sm: { width: 36, height: 24, fontSize: 8 },
    md: { width: 48, height: 30, fontSize: 10 },
    lg: { width: 60, height: 38, fontSize: 12 },
};

function MastercardLogo({ dimensions }: { dimensions: typeof SIZE_MAP.sm }) {
    const circleSize = dimensions.height * 0.6;

    return (
        <View
            style={{
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: '#2A2A2A',
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    backgroundColor: '#EB001B',
                    marginRight: -(circleSize * 0.25),
                    zIndex: 1,
                }}
            />
            <View
                style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: circleSize / 2,
                    backgroundColor: '#F79E1B',
                }}
            />
        </View>
    );
}

export function CardBrandLogo({ brand, size = 'md' }: CardBrandLogoProps) {
    const dimensions = SIZE_MAP[size];
    const config = CARD_BRAND_CONFIG[brand] || CARD_BRAND_CONFIG.unknown;

    if (brand === 'mastercard') {
        return <MastercardLogo dimensions={dimensions} />;
    }

    return (
        <View
            style={{
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: config.bgColor,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text
                style={{
                    color: config.textColor,
                    fontSize: dimensions.fontSize,
                    fontFamily: 'Fredoka-Bold',
                    letterSpacing: 1,
                }}
            >
                {config.label}
            </Text>
        </View>
    );
}
