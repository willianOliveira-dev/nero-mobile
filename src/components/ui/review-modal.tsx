import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TextInput, ActivityIndicator } from 'react-native';
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
import { Camera, X, Play } from 'lucide-react-native';

import { MediaViewerModal } from './media-viewer-modal';

import type { GetOrder200ItemsItemReview } from '@/src/api/generated/model';

const MAX_IMAGES = 3;
const MAX_VIDEOS = 1;
const MAX_VIDEO_DURATION_SECONDS = 90; 

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

    type MediaItem = { url: string; type: 'image' | 'video' };

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    useEffect(() => {
        if (isOpen && initialReview) {
            setRating(initialReview.rating);
            setTitle(initialReview.title || '');
            setComment(initialReview.comment || '');
            setMediaList(
                initialReview.media?.map((m) => ({ url: m.url, type: m.type })) || []
            );
        } else if (isOpen && !initialReview) {
            setRating(0);
            setTitle('');
            setComment('');
            setMediaList([]);
        }
        setError('');
    }, [isOpen, initialReview]);

    const handleClose = () => {
        onClose();
    };

    const handlePickMedia = async () => {
        if (isReadOnly) return;

        const imageCount = mediaList.filter(m => m.type === 'image').length;
        const videoCount = mediaList.filter(m => m.type === 'video').length;

        if (imageCount >= MAX_IMAGES && videoCount >= MAX_VIDEOS) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            videoMaxDuration: MAX_VIDEO_DURATION_SECONDS,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const isVideo = asset.type === 'video';

            if (isVideo && videoCount >= MAX_VIDEOS) {
                return;
            }
            if (!isVideo && imageCount >= MAX_IMAGES) {
                return;
            }

            if (isVideo && asset.duration) {
                const durationInSeconds = asset.duration / 1000;
                if (durationInSeconds > MAX_VIDEO_DURATION_SECONDS) {
                    return;
                }
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
        } catch {
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


            handleClose();
        } catch {
            setError('Erro ao enviar avaliação. Tente novamente.');
        }
    };

    const openViewer = (index: number) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };

    return (
        <>
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
               
                            <Box className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />

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
                                    <Text className="text-base font-fredoka-semibold text-secondary" numberOfLines={2}>
                                        {productName}
                                    </Text>
                                    {skuVariant && (
                                        <Text className="text-xs font-fredoka text-text-muted">
                                            {skuVariant}
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>

                            <Text className="text-sm font-fredoka-semibold text-secondary mb-2">
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

                            <Text className="text-sm font-fredoka-semibold text-secondary mb-2">
                                Título (opcional)
                            </Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                editable={!isReadOnly}
                                placeholder="Ex: Adorei o produto!"
                                maxLength={120}
                                className={`border border-border rounded-xl px-4 py-3 text-sm font-fredoka text-secondary mb-4 ${isReadOnly ? 'bg-gray-50' : ''}`}
                                placeholderTextColor="#9ca3af"
                            />

                            <HStack className="justify-between items-center mb-2">
                                <Text className="text-sm font-fredoka-semibold text-secondary">
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
                                className={`border border-border rounded-xl px-4 py-3 text-sm font-fredoka text-secondary mb-4 min-h-[100px] ${isReadOnly ? 'bg-gray-50' : ''}`}
                                placeholderTextColor="#9ca3af"
                            />

                            <Text className="text-sm font-fredoka-semibold text-secondary mb-2">
                                Fotos e Vídeos
                            </Text>
                            <HStack className="gap-3 flex-wrap mb-6">
                                {mediaList.map((media, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => openViewer(index)}
                                        className="w-20 h-20 rounded-xl overflow-hidden relative bg-gray-200"
                                    >
                                        <Image source={{ uri: media.url }} alt="Review Media" className="w-full h-full opacity-80" resizeMode="cover" />
                                        {media.type === 'video' && (
                                            <Box className="absolute inset-0 items-center justify-center">
                                                <Box className="w-8 h-8 rounded-full bg-black/50 items-center justify-center">
                                                    <Play size={14} color="#fff" fill="#fff" />
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
                                    </Pressable>
                                ))}

                                {!isReadOnly && (mediaList.filter(m => m.type === 'image').length < MAX_IMAGES || mediaList.filter(m => m.type === 'video').length < MAX_VIDEOS) && (
                                    <Pressable
                                        onPress={handlePickMedia}
                                        disabled={isUploading}
                                        className="w-20 h-20 rounded-xl border border-dashed border-gray-300 items-center justify-center bg-gray-50"
                                    >
                                        {isUploading ? <ActivityIndicator size="small" color="#d70040" /> : <Camera size={24} color="#9ca3af" />}
                                    </Pressable>
                                )}
                            </HStack>

                            {!isReadOnly && error !== '' && (
                                <Text className="text-xs font-fredoka text-red-500 mb-3">
                                    {error}
                                </Text>
                            )}

                            {isReadOnly ? (
                                <Pressable onPress={handleClose} className="rounded-full py-4 items-center mb-3 bg-gray-200">
                                    <Text className="text-base font-fredoka-semibold text-secondary">Fechar</Text>
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

            <MediaViewerModal
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                media={mediaList}
                initialIndex={viewerIndex}
            />
        </>
    );
}
