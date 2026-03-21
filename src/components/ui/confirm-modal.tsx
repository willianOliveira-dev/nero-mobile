import React from 'react';
import { Modal } from 'react-native';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { AlertTriangle, Check } from 'lucide-react-native';
import { cn } from '@gluestack-ui/utils/nativewind-utils';

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    isLoading?: boolean;
};

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    confirmVariant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {
    const confirmBgClass = confirmVariant === 'danger' ? 'bg-red-500' : 'bg-sky-500';

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                onPress={onClose}
                className="flex-1 bg-black/50 items-center justify-center px-8"
            >
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full overflow-hidden"
                >
                    <VStack className="p-6 items-center gap-4">
                     
                        <Box className={cn("w-14 h-14 rounded-full items-center justify-center", confirmVariant === "danger" ? "bg-red-50" : "bg-sky-50")}>
                            {confirmVariant === "danger" ? (
                                <AlertTriangle size={28} color="#ef4444" />
                            ) : (
                                <Check size={28} color="#0ea5e9" />
                            )}
                        </Box>

                        <VStack className="items-center gap-2">
                            <Text className="text-lg font-fredoka-bold text-secondary text-center">
                                {title}
                            </Text>
                            <Text className="text-sm font-fredoka text-text-muted text-center leading-relaxed">
                                {message}
                            </Text>
                        </VStack>
                        <HStack className="gap-3 w-full mt-2">
                            <Pressable
                                onPress={onClose}
                                disabled={isLoading}
                                className="flex-1 py-3.5 rounded-full bg-surface-muted items-center"
                            >
                                <Text className="text-sm font-fredoka-semibold text-secondary">
                                    {cancelLabel}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 py-3.5 rounded-full items-center ${confirmBgClass}`}
                            >
                                <Text className="text-sm font-fredoka-semibold text-white">
                                    {confirmLabel}
                                </Text>
                            </Pressable>
                        </HStack>
                    </VStack>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
