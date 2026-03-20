import React, { useState } from 'react';
import { Modal, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react-native';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { Image } from '@/src/components/gluestack/ui/image';
import { useCreateReview } from '@/src/api/generated/reviews/reviews';
import { getGetOrderQueryKey } from '@/src/api/generated/orders/orders';
import { usePresignReviewMedia } from '@/src/api/generated/reviews/reviews';
import { imagesPath } from '@/src/constants/images';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';

import type { GetOrder200ItemsItemReview } from '@/src/api/generated/model';

type ReviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    productImage: string;
    orderId: string;
    skuVariant: string | null;
    initialReview?: GetOrder200ItemsItemReview | null;
};

export function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    productImage,
    orderId,
    skuVariant,
    initialReview,
}: ReviewModalProps) {
    const queryClient = useQueryClient();
    const { mutateAsync: createReview, isPending } = useCreateReview();
    const { mutateAsync: presignMedia } = usePresignReviewMedia();

    const isReadOnly = !!initialReview;

    const [rating, setRating] = useState(initialReview?.rating || 0);
    const [title, setTitle] = useState(initialReview?.title || '');
    const [comment, setComment] = useState(initialReview?.comment || '');
    
    type MediaItem = { url: string; type: 'image' | 'video' };
    const [mediaList, setMediaList] = useState<MediaItem[]>(
        initialReview?.media?.map((m: { url: string; type: 'image' | 'video' }) => ({ url: m.url, type: m.type })) || []
    );
    
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const resetForm = () => {
        if (!isReadOnly) {
            setRating(0);
            setTitle('');
            setComment('');
            setMediaList([]);
        }
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handlePickMedia = async () => {
        if (isReadOnly) return;
        
        const imageCount = mediaList.filter(m => m.type === 'image').length;
        const videoCount = mediaList.filter(m => m.type === 'video').length;

        if (imageCount >= 3 && videoCount >= 1) {
            Alert.alert('Limite atingido', 'Você já enviou 3 imagens e 1 vídeo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const isVideo = asset.type === 'video';

            if (isVideo && videoCount >= 1) {
                Alert.alert('Limite atingido', 'Você só pode enviar 1 vídeo.');
                return;
            }
            if (!isVideo && imageCount >= 3) {
                Alert.alert('Limite atingido', 'Você só pode enviar até 3 imagens.');
                return;
            }
            await handleUploadMedia(asset);
        }
    };

    const handleUploadMedia = async (asset: ImagePicker.ImagePickerAsset) => {
        try {
            setIsUploading(true);
            const presignRes = await presignMedia();
            const presignData = presignRes?.data;
            if (!presignData) throw new Error('Falha ao obter assinatura do Cloudinary');
       
            const isVideo = asset.type === 'video';
            const resourceType = isVideo ? 'video' : 'image';

            const formData = new FormData();
            // @ts-expect-error React Native's FormData
            formData.append('file', {
                uri: asset.uri,
                type: asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
                name: asset.fileName || (isVideo ? 'review_video.mp4' : 'review_img.jpg'),
            });
            formData.append('api_key', presignData.apiKey);
            formData.append('timestamp', String(presignData.timestamp));
            formData.append('signature', presignData.signature);
            if (presignData.folder) formData.append('folder', presignData.folder);
            if (presignData.publicId) formData.append('public_id', presignData.publicId);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${presignData.cloudName}/${resourceType}/upload`;
            const cloudinaryResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });
            const cloudinaryResult = await cloudinaryResponse.json();
            if (!cloudinaryResponse.ok) throw new Error('Falha no upload');

            setMediaList((prev) => [...prev, { url: cloudinaryResult.secure_url, type: resourceType }]);
        } catch (err) {
            setError('Falha ao enviar arquivo. Verifique a conexão.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Selecione pelo menos uma estrela.');
            return;
        }

        setError('');
        try {
            await createReview({
                data: {
                    productId,
                    orderId,
                    rating,
                    title: title.trim() || undefined,
                    comment: comment.trim() || undefined,
                    variantPurchased: skuVariant ?? undefined,
                    media: mediaList.length > 0 ? mediaList : undefined,
                },
            });

            queryClient.invalidateQueries({
                queryKey: getGetOrderQueryKey(orderId),
            });

            Alert.alert('Obrigado!', 'Sua avaliação foi enviada com sucesso.');
            handleClose();
        } catch {
            setError('Erro ao enviar avaliação. Tente novamente.');
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable
                onPress={handleClose}
                className="flex-1 bg-black/40 justify-end"
            >
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    className="bg-white rounded-t-3xl max-h-[85%]"
                >
                    <ScrollView
                        bounces={false}
                        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                    >
                        {/* Handle */}
                        <Box className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />

                        {/* Product Info */}
                        <HStack className="items-center gap-4 mb-6">
                            <Box className="w-14 h-14 rounded-xl overflow-hidden bg-surface-muted">
                                <Image
                                    source={productImage ? { uri: productImage } : imagesPath.neroPlaceholder}
                                    alt={productName}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </Box>
                            <VStack className="flex-1 gap-0.5">
                                <Text className="text-base font-fredoka-semibold text-[#272727]" numberOfLines={2}>
                                    {productName}
                                </Text>
                                {skuVariant && (
                                    <Text className="text-xs font-fredoka text-text-muted">
                                        {skuVariant}
                                    </Text>
                                )}
                            </VStack>
                        </HStack>

                        {/* Stars */}
                        <Text className="text-sm font-fredoka-semibold text-[#272727] mb-2">
                            Sua nota *
                        </Text>
                        <HStack className="gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable
                                    key={star}
                                    onPress={() => !isReadOnly && setRating(star)}
                                    className="p-1"
                                >
                                    <Star
                                        size={32}
                                        color={star <= rating ? '#facc15' : '#d1d5db'}
                                        fill={star <= rating ? '#facc15' : 'transparent'}
                                    />
                                </Pressable>
                            ))}
                        </HStack>

                        {/* Title */}
                        <Text className="text-sm font-fredoka-semibold text-[#272727] mb-2">
                            Título (opcional)
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            editable={!isReadOnly}
                            placeholder="Ex: Adorei o produto!"
                            maxLength={120}
                            className={`border border-border rounded-xl px-4 py-3 text-sm font-fredoka text-[#272727] mb-4 ${isReadOnly ? 'bg-gray-50' : ''}`}
                            placeholderTextColor="#9ca3af"
                        />

                        {/* Comment */}
                        <HStack className="justify-between items-center mb-2">
                            <Text className="text-sm font-fredoka-semibold text-[#272727]">
                                Comentário (opcional)
                            </Text>
                            <Text className="text-xs font-fredoka text-text-muted">
                                {comment.length}/500
                            </Text>
                        </HStack>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            editable={!isReadOnly}
                            placeholder="Conte como foi sua experiência..."
                            maxLength={500}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className={`border border-border rounded-xl px-4 py-3 text-sm font-fredoka text-[#272727] mb-4 min-h-[100px] ${isReadOnly ? 'bg-gray-50' : ''}`}
                            placeholderTextColor="#9ca3af"
                        />

                        {/* Media */}
                        <Text className="text-sm font-fredoka-semibold text-[#272727] mb-2">
                            Fotos e Vídeos
                        </Text>
                        <HStack className="gap-3 flex-wrap mb-6">
                            {mediaList.map((media, index) => (
                                <Box key={index} className="w-20 h-20 rounded-xl overflow-hidden relative bg-black">
                                    <Image source={{ uri: media.url }} alt="Review Media" className="w-full h-full opacity-80" resizeMode="cover" />
                                    {media.type === 'video' && (
                                        <Box className="absolute inset-0 items-center justify-center">
                                            <Box className="bg-black/50 rounded-full px-2 py-0.5">
                                                <Text className="text-[10px] text-white font-fredoka-bold">VIDEO</Text>
                                            </Box>
                                        </Box>
                                    )}
                                    {!isReadOnly && (
                                        <Pressable
                                            onPress={() => setMediaList(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                                        >
                                            <X size={12} color="#fff" />
                                        </Pressable>
                                    )}
                                </Box>
                            ))}

                            {!isReadOnly && (mediaList.filter(m => m.type === 'image').length < 3 || mediaList.filter(m => m.type === 'video').length < 1) && (
                                <Pressable
                                    onPress={handlePickMedia}
                                    disabled={isUploading}
                                    className="w-20 h-20 rounded-xl border border-dashed border-gray-300 items-center justify-center bg-gray-50"
                                >
                                    {isUploading ? <ActivityIndicator size="small" color="#d70040" /> : <Camera size={24} color="#9ca3af" />}
                                </Pressable>
                            )}
                        </HStack>

                        {/* Error */}
                        {!isReadOnly && error !== '' && (
                            <Text className="text-xs font-fredoka text-red-500 mb-3">
                                {error}
                            </Text>
                        )}

                        {/* Actions */}
                        {isReadOnly ? (
                            <Pressable onPress={handleClose} className="rounded-full py-4 items-center mb-3 bg-gray-200">
                                <Text className="text-base font-fredoka-semibold text-[#272727]">Fechar</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Pressable
                                    onPress={handleSubmit}
                                    disabled={isPending || rating === 0 || isUploading}
                                    className={`rounded-full py-4 items-center mb-3 ${
                                        rating === 0 || isUploading ? 'bg-gray-200' : 'bg-primary'
                                    }`}
                                >
                                    {isPending ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text
                                            className={`text-base font-fredoka-semibold ${
                                                rating === 0 || isUploading ? 'text-gray-400' : 'text-white'
                                            }`}
                                        >
                                            Enviar Avaliação
                                        </Text>
                                    )}
                                </Pressable>
                                <Pressable onPress={handleClose} className="py-2 items-center">
                                    <Text className="text-sm font-fredoka text-text-muted">Cancelar</Text>
                                </Pressable>
                            </>
                        )}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
