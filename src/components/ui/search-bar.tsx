import { Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable as RNPressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import AnimatedInputBar from '../reacticx/ui/base/animated-input-bar';

const DEFAULT_PLACEHOLDERS: string[] = [
    'Pesquisar...',
    'O que você procura?',
    'Digite aqui...',
];

import type { TextInputProps } from 'react-native';

interface SearchBarProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    placeholders?: string[];
    animationInterval?: number;
}

export function SearchBar({
    value,
    onChangeText,
    onPress,
    placeholders = DEFAULT_PLACEHOLDERS,
    animationInterval = 2000,
    ...props
}: SearchBarProps)  {
    const [text, setText] = useState(value ?? '');

    useEffect(() => {
        setText(value ?? '');
    }, [value]);

    const handleChangeText = (t: string) => {
        setText(t);
        onChangeText?.(t);
    };

    const inputBar = (
        <GestureHandlerRootView>
            <HStack className="bg-background-100 rounded-full h-10 items-center px-4 gap-2 overflow-hidden">
                <Search size={16} className="text-typography-400 shrink-0" />

                <Box className="w-px h-4 bg-typography-200 shrink-0" />

                <AnimatedInputBar
                    placeholders={placeholders}
                    value={text}
                    animationInterval={animationInterval}
                    onChangeText={handleChangeText}
                    selectionColor="#d70040"
                    placeholderStyle={{
                        fontSize: 12,
                        color: '#8f8f8f',
                    }}
                    style={{
                        flex: 1,
                        fontSize: 12,
                        color: '#272727',
                        paddingVertical: 0,
                        paddingHorizontal: 0,
                    }}
                    {...props}
                />
            </HStack>
        </GestureHandlerRootView>
    );

    if (onPress) {
        return (
            <RNPressable
                onPress={onPress}
                className="w-full"
                accessibilityRole="button"
            >
                <Box className="w-full" pointerEvents="none">
                    {inputBar}
                </Box>
            </RNPressable>
        );
    }

    return inputBar;
};

