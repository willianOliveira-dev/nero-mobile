import React from 'react';

import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';

import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from '@/components/ui/form-control';

import { AlertCircle } from 'lucide-react-native';

import { useController, UseControllerProps } from 'react-hook-form';

interface FormInputProps extends UseControllerProps {
    label: string;
    placeholder: string;
    type?: 'text' | 'password';
    disabled?: boolean;
    icon?: React.ReactNode;
}

export const FormInput = ({
    label,
    placeholder,
    type = 'text',
    disabled = false,
    icon,
    ...controllerProps
}: FormInputProps) => {
    const { field, fieldState } = useController(controllerProps);
    const isInvalid = !!fieldState.error;

    return (
        <FormControl isInvalid={isInvalid} size="md" className="mb-4">
            <FormControlLabel>
                <FormControlLabelText className="text-sm font-semibold text-gray-700">
                    {label}
                </FormControlLabelText>
            </FormControlLabel>

            <Input
                isInvalid={isInvalid}
                isDisabled={disabled}
                className={`${
                    isInvalid
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
                }`}
            >
                {icon && (
                    <InputSlot className="pl-3">
                        <InputIcon>{icon}</InputIcon>
                    </InputSlot>
                )}

                <InputField
                    ref={field.ref}
                    placeholder={placeholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    type={type}
                    placeholderTextColor="#9CA3AF"
                    className={`flex-1 px-3 py-3 text-base text-gray-900`}
                    editable={!disabled}
                />
            </Input>

            {fieldState.error && (
                <FormControlError className={`mt-2`}>
                    <FormControlErrorIcon
                        as={AlertCircle}
                        size="sm"
                        className={`text-red-500 mr-1`}
                    />
                    <FormControlErrorText className={`text-red-600 text-sm`}>
                        {fieldState.error.message}
                    </FormControlErrorText>
                </FormControlError>
            )}
        </FormControl>
    );
};
