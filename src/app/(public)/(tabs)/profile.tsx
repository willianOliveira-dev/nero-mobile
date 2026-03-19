import {
    useConfirmAvatar,
    useGetMe,
    usePresignAvatar,
} from '@/src/api/generated/users/users';
import { Avatar, AvatarImage } from '@/src/components/gluestack/ui/avatar';
import { Box } from '@/src/components/gluestack/ui/box';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { useAuth } from '@/src/hooks/auth/use-auth';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, type Href } from 'expo-router';
import { ChevronRight,  ImageUpIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';

const AVATAR_PLACEHOLDER =
    'https://www.figma.com/api/mcp/asset/0e9d6c12-a83a-4d88-80ad-5360fa62c3a0';

export default function ProfileScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { data: me, isPending: isMePending, refetch } = useGetMe();

    const { mutateAsync: presignAvatar } = usePresignAvatar();
    const { mutateAsync: confirmAvatar } = useConfirmAvatar();

    const [isUploading, setIsUploading] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.replace('/login');
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            await handleUploadImage(result.assets[0]);
        }
    };

    const handleUploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
        try {
            setIsUploading(true);

            const presignData = await presignAvatar();

            if (!presignData) throw new Error('Falha ao obter assinatura do Cloudinary');
       
            const formData = new FormData();
            
            // @ts-expect-error React Native's FormData accepts an object with uri, type, and name
            formData.append('file', {
                uri: asset.uri,
                type: asset.mimeType || 'image/jpeg',
                name: asset.fileName || 'avatar.jpg',
            });
            formData.append('api_key', presignData.apiKey);
            formData.append('timestamp', String(presignData.timestamp));
            formData.append('signature', presignData.signature);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${presignData.cloudName}/image/upload`;

            const cloudinaryResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const cloudinaryResult = await cloudinaryResponse.json();

            if (!cloudinaryResponse.ok) {
                console.error('Erro Cloudinary:', cloudinaryResult);
                throw new Error('Falha ao fazer upload da imagem no Cloudinary');
            }


            await confirmAvatar({
                data: {
                    avatarUrl: cloudinaryResult.secure_url,
                },
            });

            await refetch();
            Alert.alert('Sucesso', 'Avatar atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro upload avatar:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o avatar. Verifique as credenciais e conexão.');
        } finally {
            setIsUploading(false);
        }
    };

    const menuItems: { label: string; route?: Href }[] = [
        { label: 'Meus Pedidos', route: '/orders' as Href },
        { label: 'Endereços', route: '/address' },
        { label: 'Lista de desejos', route: '/wishlist' },
        { label: 'Formas de pagamento', route: '/checkout/payment' as Href },
        { label: 'Help' },
        { label: 'Support' },
    ];

    if (isMePending) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d70040" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <VStack className="items-center mt-8 px-6">
                    <Box className="relative">
                        <Pressable onPress={handlePickImage} accessibilityRole="button">
                            <Box className="relative rounded-full overflow-hidden">
                                <Avatar size="2xl" className="rounded-full bg-gray-100 overflow-hidden">
                                    <AvatarImage
                                        source={{ uri: me?.avatarUrl || AVATAR_PLACEHOLDER }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </Avatar>
                                {!isUploading && (
                                    <Box className="absolute inset-0 bg-black/20 items-center justify-center">
                                        <ImageUpIcon size={28} color="#ffffff" opacity={0.8} />
                                    </Box>
                                )}
                            </Box>
                        </Pressable>
                        {isUploading && (
                            <Box className="absolute inset-0 bg-black/40 rounded-full items-center justify-center">
                                <ActivityIndicator color="#ffffff" />
                            </Box>
                        )}
                    </Box>

              
                    <Box className="w-full bg-white rounded-lg p-4 mt-8 flex-row items-center justify-between">
                        <VStack className="gap-1 flex-1 pr-4">
                            <Text className="text-base font-fredoka-bold text-[#272727]">
                                {me?.name || 'Seu Nome'}
                            </Text>
                            <Text className="text-sm font-fredoka text-[#272727]/50">
                                {me?.email || 'seuemail@exemplo.com'}
                            </Text>
                            {me?.phone && (
                                <Text className="text-sm font-fredoka text-[#272727]/50">
                                    {me.phone}
                                </Text>
                            )}
                        </VStack>
                        <Pressable onPress={() => router.push('/profile/edit')} className="p-2">
                            <Text className="text-primary font-fredoka-bold text-sm">
                                Edit
                            </Text>
                        </Pressable>
                    </Box>

               
                    <VStack className="w-full mt-6 gap-2">
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    if (item.route) router.push(item.route);
                                }}
                                className="w-full bg-white h-14 rounded-lg px-4 flex-row items-center justify-between"
                            >
                                <Text className="text-base font-fredoka text-[#272727]">
                                    {item.label}
                                </Text>
                                <ChevronRight size={20} color="#272727" />
                            </Pressable>
                        ))}
                    </VStack>

        
                    <Pressable
                        onPress={() => handleSignOut()}
                        className="w-full mt-10 mb-8 items-center justify-center py-4"
                    >
                        <Text className="text-[#fa3636] font-fredoka-bold text-base">
                            Sair
                        </Text>
                    </Pressable>
                </VStack>
            </ScrollView> 
        </SafeAreaView>
    );
}
