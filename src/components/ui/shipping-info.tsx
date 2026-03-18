import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Box } from '@/src/components/gluestack/ui/box';
import { Truck } from 'lucide-react-native';
import React from 'react';

interface ShippingInfoProps {
    freeShipping: boolean;
}

export function ShippingInfo({ freeShipping }: ShippingInfoProps) {
    return (
        <VStack className="gap-3">
            <Text className="text-sm font-fredoka-semibold text-typography-900 uppercase tracking-widest">
                Envio
            </Text>

            {freeShipping ? (
                <HStack className="items-center gap-2 bg-success-light px-4 py-3 rounded-xl">
                    <Truck size={18} color="#16a34a" />
                    <Text className="text-sm font-fredoka-semibold text-success">
                        Frete Grátis
                    </Text>
                </HStack>
            ) : (
                <Box className="bg-gray-50 px-4 py-3 rounded-xl">
                    <Text className="text-sm font-fredoka text-secondary-muted">
                        Frete calculado no checkout
                    </Text>
                </Box>
            )}
        </VStack>
    );
}
