import { useListCategories } from '@/src/api/generated/categories/categories';
import type { ListCategories200Item } from '@/src/api/generated/model';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Image } from '@/src/components/gluestack/ui/image';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ArrowLeft, Grid2x2, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagesPath } from '@/src/constants/images';

function CategoryCard({ category }: { category: ListCategories200Item }) {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/products-by-category/[id]',
            params: { id: category.id, name: category.name },
        });
    };

    return (
        <Pressable
            onPress={handlePress}
            className="flex-row items-center p-3 bg-[#f4f4f4] rounded-lg mb-3"
            accessibilityRole="button"
            accessibilityLabel={`Categoria ${category.name}`}
        >
            <Box className="w-10 h-10 rounded-full bg-white items-center justify-center overflow-hidden mr-4">
                <Image
                    source={category.imageUrl ? { uri: category.imageUrl } : imagesPath.neroPlaceholder}
                    alt={category.name}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </Box>

            <Text
                className="text-base font-fredoka text-[#272727] flex-1"
                numberOfLines={1}
            >
                {category.name}
            </Text>
        </Pressable>
    );
}

export default function CategoriesScreen() {
    const router = useRouter();
    const { goBack } = useSafeBack();
    const { data: categories, isPending } = useListCategories();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <VStack className="px-5 pt-2 pb-4 border-b border-gray-100">
                <HStack className="items-center justify-between">
                    <Pressable
                        onPress={() => goBack()}
                        className="p-2 -mx-2"
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                    >
                        <ArrowLeft size={24} color="#272727" />
                    </Pressable>

                    <HStack className="items-center gap-2">
                        <Grid2x2 size={20} color="#272727" />
                        <Text className="text-lg font-fredoka-medium text-typography-900">
                            Categorias
                        </Text>
                    </HStack>

                    <Box className="w-10" />
                </HStack>
            </VStack>

            {isPending ? (
                <Box className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#d70040" />
                </Box>
            ) : (
                <FlatList
                    data={categories}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 40,
                    }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <CategoryCard category={item} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <VStack className="flex-1 items-center justify-center pt-20 space-y-4">
                            <Grid2x2 size={48} color="#d4d4d4" />
                            <Text className="text-gray-500 font-fredoka text-base">
                                Nenhuma categoria encontrada.
                            </Text>
                        </VStack>
                    }
                />
            )}
        </SafeAreaView>
    );
}
