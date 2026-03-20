import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useUpdateMe } from '@/src/api/generated/users/users';
import { useAuthStore } from '@/src/store/use-auth.store';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type GenderPreference = 'unisex' | 'men' | 'women' | 'kids';

const PREFERENCE_OPTIONS: { label: string; value: GenderPreference }[] = [
    { label: 'Todos', value: 'unisex' },
    { label: 'Masculino', value: 'men' },
    { label: 'Feminino', value: 'women' },
    { label: 'Infantil', value: 'kids' },
];

export default function PreferencesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const setUser = useAuthStore((state) => state.setUser);
    const { mutateAsync: updateMe, isPending: isUpdating } = useUpdateMe();

    const [selectedPreference, setSelectedPreference] = useState<GenderPreference | null>(null);

    async function handleConfirm() {
        if (!selectedPreference) return;
        try {
            await updateMe({
                data: {
                    genderPreference: selectedPreference,
                },
            });

            if (user) {
                setUser({
                    ...user,
                    gender: selectedPreference,
                });
            }
        } catch (error) {
        }
        router.replace('/(private)/(tabs)/home');
    }

    function handleSkip() {
        router.replace('/(private)/(tabs)/home');
    }

    const firstName = user?.name?.split(' ')[0] ?? '';

    return (
        <View className="flex-1">
          
            <LinearGradient
                colors={['#ff1a5e', '#d70040', '#9e002e']}
                style={{ flex: 1 }}
            >
                <ImageBackground
                    source={imagesPath.fashionModel}
                    resizeMode="cover"
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                 
                    <VStack className="bg-white rounded-t-4xl px-6 pt-8 pb-8">
                        <VStack className="gap-4">
                            <VStack className="gap-2">
                                <Text className="text-gray-900 text-2xl font-fredoka-bold text-center">
                                    {firstName ? `Olá, ${firstName}! 👋` : 'Vista-se com Estilo'}
                                </Text>
                                <Text className="text-gray-400 text-sm font-fredoka-medium text-center">
                                    Personalize sua experiência escolhendo suas preferências de moda
                                </Text>
                            </VStack>

                            <HStack className="flex-wrap gap-3 justify-center mt-2">
                                {PREFERENCE_OPTIONS.map((option) => {
                                    const isSelected = selectedPreference === option.value;
                                    return (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => setSelectedPreference(option.value)}
                                            className="active:opacity-80"
                                            style={{ width: (SCREEN_WIDTH - 60) / 2 - 6 }}
                                        >
                                            <VStack
                                                className={`h-14 rounded-xl items-center justify-center border ${
                                                    isSelected
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-gray-50 border-gray-100'
                                                }`}
                                            >
                                                <Text
                                                    className={`text-sm font-fredoka-semibold ${
                                                        isSelected ? 'text-white' : 'text-gray-900'
                                                    }`}
                                                >
                                                    {option.label}
                                                </Text>
                                            </VStack>
                                        </Pressable>
                                    );
                                })}
                            </HStack>
                        </VStack>

                        <VStack className="gap-3 mt-6">
                            <Button
                                onPress={handleConfirm}
                                disabled={!selectedPreference || isUpdating}
                                className={`h-12 rounded-xl active:opacity-90 ${
                                    selectedPreference ? 'bg-primary' : 'bg-gray-200'
                                }`}
                            >
                                {isUpdating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <ButtonText
                                        className={`text-sm font-fredoka-medium ${
                                            selectedPreference ? 'text-white' : 'text-gray-400'
                                        }`}
                                    >
                                        Começar
                                    </ButtonText>
                                )}
                            </Button>

                            <Pressable
                                onPress={handleSkip}
                                className="active:opacity-70 items-center py-2"
                            >
                                <Text className="text-gray-400 text-xs font-fredoka-medium">
                                    Pular
                                </Text>
                            </Pressable>
                        </VStack>
                    </VStack>
                </ImageBackground>
            </LinearGradient>
        </View>
    );
}
