import { useGetHome } from '@/src/api/generated/home/home';
import { Avatar, AvatarImage } from '@/src/components/gluestack/ui/avatar';
import { useRouter } from 'expo-router';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { GenderFilter } from '@/src/components/ui/gender-filter';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { CategoryItem } from '@/src/components/ui/category-item';
import { HomeSkeleton } from '@/src/components/ui/home-skeleton';
import { ProductCard } from '@/src/components/ui/product-card';
import { SectionHeader } from '@/src/components/ui/seaction-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useInfiniteProducts } from '@/src/hooks/products/use-infinite-products';
import { useAuthStore } from '@/src/store/use-auth.store';
import type { GetHome200ItemItemsItem } from '@/src/api/generated/model';
import { useCartStore } from '@/src/store/use-cart-store';
import { ShoppingCart } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StatusBar } from 'react-native';

const AVATAR_URI =
    'https://www.figma.com/api/mcp/asset/0e9d6c12-a83a-4d88-80ad-5360fa62c3a0';

const CATEGORIES = [
    {
        id: '1',
        label: 'Moletons',
        imageUri:
            'https://www.figma.com/api/mcp/asset/c7e60d37-5356-47f6-bebe-fe4b1b9a4973',
    },
    {
        id: '2',
        label: 'Shorts',
        imageUri:
            'https://www.figma.com/api/mcp/asset/85d42c6e-0f27-4d21-bef0-8a0432288063',
    },
    {
        id: '3',
        label: 'Tênis',
        imageUri:
            'https://www.figma.com/api/mcp/asset/aa74d529-17b9-49c1-9bc0-3eb8223d133f',
    },
    {
        id: '4',
        label: 'Mochilas',
        imageUri:
            'https://www.figma.com/api/mcp/asset/55b46a81-2139-4d8d-805c-6cec9897756d',
    },
    {
        id: '5',
        label: 'Acessórios',
        imageUri:
            'https://www.figma.com/api/mcp/asset/37aee49b-f1b8-43f7-9c1a-7a479342bf2e',
    },
];

type GenderFilter = 'unisex' | 'men' | 'women' | 'kids';

const GENDER_OPTIONS: { label: string; value: GenderFilter }[] = [
    { label: 'Todos', value: 'unisex' },
    { label: 'Masculino', value: 'men' },
    { label: 'Feminino', value: 'women' },
    { label: 'Kids', value: 'kids' },
];

export default function HomeScreen() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('1');

    const user = useAuthStore((state) => state.user);
    const itemCount = useCartStore((state) => state.itemCount);
    const defaultGender: GenderFilter = user?.gender ?? 'unisex';
    const [selectedGender, setSelectedGender] =
        useState<GenderFilter>(defaultGender);

    const {
        data: homeResponse,
        isPending: isHomePending,
    } = useGetHome({ gender: selectedGender });

    const sections = homeResponse ?? [];

    const {
        data: productsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending: isProductsPending,
    } = useInfiniteProducts({
        gender: selectedGender,
        limit: 20,
        sort: 'recommended',
    });

    const allProducts = useMemo(
        () => productsData?.pages.flatMap((page) => page.items) ?? [],
        [productsData],
    );

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isHomePending) {
        return (
            <SafeAreaView className="flex-1 bg-white/95">
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                <HomeSkeleton />
            </SafeAreaView>
        );
    }


    const renderProductItem = ({
        item,
    }: {
        item: GetHome200ItemItemsItem;
    }) => (
        <Box className="w-1/2 px-1.5 mb-3">
            <ProductCard product={item} />
        </Box>
    );


    const ListHeader = (
        <VStack>
         
            <HStack className="items-center justify-between mb-4">
                <Avatar size="md" className="rounded-full">
                    <AvatarImage source={{ uri: AVATAR_URI }} />
                </Avatar>

                <GenderFilter
                    options={GENDER_OPTIONS}
                    value={selectedGender}
                    onChange={setSelectedGender}
                />

                <Pressable
                    onPress={() => router.push('/cart')}
                    className="w-10 h-10 rounded-full bg-primary items-center justify-center relative"
                >
                    <ShoppingCart size={16} color="#ffffff" />
                    {itemCount > 0 && (
                        <Box className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center border border-white">
                            <Text className="text-[9px] font-fredoka-bold text-white leading-none">
                                {itemCount > 99 ? '99+' : itemCount}
                            </Text>
                        </Box>
                    )}
                </Pressable>
            </HStack>

    
            <Box className="mb-6">
                <SearchBar />
            </Box>

        
            <VStack className="gap-4 mb-6">
                <SectionHeader title="Categorias" />
                <HStack className="justify-between items-start">
                    {CATEGORIES.map((cat) => (
                        <CategoryItem
                            key={cat.id}
                            label={cat.label}
                            imageUri={cat.imageUri}
                            isActive={activeCategory === cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                        />
                    ))}
                </HStack>
            </VStack>

          
            {sections.map((section) => (
                <VStack key={section.id} className="gap-4 mb-6">
                    <SectionHeader
                        title={section.title}
                        titleClassName={
                            section.slug === 'new-in' ? 'text-primary' : ''
                        }
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -24 }}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            gap: 12,
                        }}
                    >
                        {section.items?.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </ScrollView>
                </VStack>
            ))}

        
            <SectionHeader title="Para você" />
            <Box className="h-4" />
        </VStack>
    );

    return (
        <SafeAreaView className="flex-1 bg-white/95">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <FlatList
                data={allProducts}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: 90,
                }}
                columnWrapperStyle={{ marginHorizontal: -6 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <Box className="py-4 items-center">
                            <ActivityIndicator size="small" color="#272727" />
                        </Box>
                    ) : null
                }
                ListEmptyComponent={
                    isProductsPending ? (
                        <Box className="py-8 items-center">
                            <ActivityIndicator size="small" color="#272727" />
                        </Box>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
