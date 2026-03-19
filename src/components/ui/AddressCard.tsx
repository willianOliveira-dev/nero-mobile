import type { ListAddresses200Item } from '@/src/api/generated/model';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { cn } from '@gluestack-ui/utils/nativewind-utils';
import { MapPin, CheckCircle2, Circle } from 'lucide-react-native';
import React from 'react';

type AddressCardProps = {
    address: ListAddresses200Item;
    onEdit: () => void;
    onSetDefault: () => void;
};

export function AddressCard({ address, onEdit, onSetDefault }: AddressCardProps) {
    return (
        <Pressable
            onPress={onEdit}
            className={`w-full bg-gray-100 rounded-lg p-5 mb-4 border ${
                address.isDefault ? 'border-sky-300 bg-sky-200/20' : 'border-transparent'
            }`}
        >
            <HStack className="justify-between items-start mb-2">
                <HStack className="items-center gap-2">
                    <MapPin size={20} color="#272727" />
                    <Text className="text-base font-fredoka-bold text-[#272727]">
                        {address.label || 'Endereço'}
                    </Text>
                </HStack>
                <Pressable onPress={(e) => {
                    e.stopPropagation();
                    if (!address.isDefault) onSetDefault();
                }}>
                    {address.isDefault ? (
                        <CheckCircle2 size={24} color="#38bdf8" />
                    ) : (
                        <Circle size={24} color="#d4d4d4" />
                    )}
                </Pressable>
            </HStack>

            <VStack className="mt-2 gap-1">
                <Text className="text-sm font-fredoka text-[#272727]">
                    {address.recipientName}
                </Text>
                <Text className="text-sm font-fredoka text-gray-500">
                    {address.street} {address.complement ? `- ${address.complement}` : ''}
                </Text>
                <Text className="text-sm font-fredoka text-gray-500">
                    {address.city}, {address.state} - {address.zipCode}
                </Text>
            </VStack>

            <HStack className={cn("mt-4 justify-end", address.isDefault ? "justify-between" : "justify-end")}>
                {address.isDefault && <Text className="text-sm font-fredoka-bold text-sky-400">Endereço Padrão</Text>}
                <Text className="text-sm font-fredoka-bold text-gray-500">
                    Editar
                </Text>
            </HStack>
        </Pressable>
    );
}
