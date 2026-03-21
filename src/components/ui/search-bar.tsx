import React, { useEffect, useState } from 'react';
import { Pressable as RNPressable } from 'react-native';
import { Search } from 'lucide-react-native';
import { Box } from '../gluestack/ui/box';
import { Input, InputSlot, InputField } from '../gluestack/ui/input';

import type { TextInputProps } from 'react-native';

interface SearchBarProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
}

export function SearchBar({
    value,
    onChangeText,
    onPress,
    placeholder = 'Pesquisar...',
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
        <Input className="bg-background-100 border-0 rounded-full h-10 items-center px-4 overflow-hidden w-full">
            <InputSlot className="pr-2">
                <Search size={16} className="text-typography-400 shrink-0" />
            </InputSlot>

            <Box className="w-px h-4 bg-typography-200 shrink-0" />

            <InputField
                placeholder={placeholder}
                value={text}
                onChangeText={handleChangeText}
                selectionColor="#d70040"
                className="flex-1 text-xs text-typography-900 placeholder:text-typography-500 py-0 px-2"
                {...props}
            />
        </Input>
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
