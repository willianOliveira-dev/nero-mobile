import React from 'react';
import { HStack } from '../gluestack/ui/hstack';
import { Pressable } from '../gluestack/ui/pressable';
import { Text } from '../gluestack/ui/text';

export interface SectionHeaderProps {
    title: string;

    titleClassName?: string;
    onSeeAll?: () => void;
}

export function SectionHeader({
    title,
    titleClassName = 'text-text',
    onSeeAll,
}: SectionHeaderProps) {
    return (
        <HStack className="items-center justify-between w-full">
            <Text
                className={`text-base font-gabarito-bold font-bold ${titleClassName}`}
            >
                {title}
            </Text>

            <Pressable onPress={onSeeAll} hitSlop={8}>
                <Text className="text-base font-circular text-text">
                    Ver todos
                </Text>
            </Pressable>
        </HStack>
    );
}
