import { useListCategories } from '@/src/api/generated/categories/categories';
import { useGetMe } from '@/src/api/generated/users/users';
import { useGetHome } from '@/src/api/generated/home/home';
import type { GetHome200ItemItemsItem } from '@/src/api/generated/model';
import { Avatar, AvatarImage } from '@/src/components/gluestack/ui/avatar';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { CategoryItem } from '@/src/components/ui/category-item';
import { GenderFilter } from '@/src/components/ui/gender-filter';
import { HomeSkeleton } from '@/src/components/ui/home-skeleton';
import { ProductCard } from '@/src/components/ui/product-card';
import { SectionHeader } from '@/src/components/ui/seaction-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import { useInfiniteProducts } from '@/src/hooks/products/use-infinite-products';
import { useAuthStore } from '@/src/store/use-auth.store';
import { useCartStore } from '@/src/store/use-cart-store';
import { useSearchStore } from '@/src/store/use-search-store';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import {  ShoppingCart } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StatusBar } from 'react-native';
import { imagesPath } from '@/src/constants/images';

type GenderFilter = 'unisex' | 'men' | 'women' | 'kids';

const GENDER_OPTIONS: { label: string; value: GenderFilter }[] = [
    { label: 'Todos', value: 'unisex' },
    { label: 'Masculino', value: 'men' },
    { label: 'Feminino', value: 'women' },
    { label: 'Kids', value: 'kids' },
];

const MAX_VISIBLE_CATEGORIES = 5;

export default function HomeScreen() {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const { data: me } = useGetMe();
    const itemCount = useCartStore((state) => state.itemCount);
    const setFilters = useSearchStore((state) => state.setFilters);
    const defaultGender: GenderFilter = user?.gender ?? 'unisex';
    const [selectedGender, setSelectedGender] =
        useState<GenderFilter>(defaultGender);

    const {
        data: homeResponse,
        isPending: isHomePending,
    } = useGetHome({ gender: selectedGender });

    const sections = homeResponse ?? [];

    const { data: categoriesData } = useListCategories();
    const visibleCategories = useMemo(
        () => (categoriesData ?? []).slice(0, MAX_VISIBLE_CATEGORIES),
        [categoriesData],
    );

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
            <Pressable onPress={() => Linking.openURL('https://github.com/willianOliveira-dev')}>
                <Text className="text-center items-center text-[8px] font-fredoka text-typography-500 mb-4">Feito com dedicação por <Text className="text-primary text-[8px] font-fredoka-semibold">Willian Oliveira</Text></Text>
            </Pressable>
            <HStack className="items-center justify-between mb-4">
                <Pressable onPress={() => router.push('/profile')}>
                    <Avatar size="md" className="rounded-full">
                        <AvatarImage source={me?.avatarUrl ? { uri: me?.avatarUrl } : imagesPath.avatarPlaceholder} />
                    </Avatar>
                </Pressable>

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
                <SearchBar
                    returnKeyType="search"
                    onSubmitEditing={(e) => {
                        const query = e.nativeEvent.text;
                        if (query.trim().length > 0) {
                            setFilters({ q: query });
                            router.push('/search');
                        }
                    }}
                />
            </Box>

        
            <VStack className="gap-4 mb-6">
                <SectionHeader
                    title="Categorias"
                    onSeeAll={() => router.push('/categories')}
                />
                <HStack className="justify-between items-start">
                    {visibleCategories.map((cat) => (
                        <CategoryItem
                            key={cat.id}
                            label={cat.name}
                            imageUri={cat.imageUrl ?? ''}
                            isActive={activeCategory === cat.id}
                            onPress={() => {
                                setActiveCategory(cat.id);
                                router.push({
                                    pathname: '/products-by-category/[id]',
                                    params: { id: cat.id, name: cat.name },
                                });
                            }}
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
                        onSeeAll={() => router.push('/search')}
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

        
            <SectionHeader
                title="Para você"
                onSeeAll={() => router.push('/search')}
            />
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
                onEndReachedThreshold={0.8}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <Box className="py-4 items-center">
                            <ActivityIndicator size="small" color="#d70040" />
                        </Box>
                    ) : null
                }
                ListEmptyComponent={
                    isProductsPending ? (
                        <Box className="py-8 items-center">
                            <ActivityIndicator size="small" color="#d70040" />
                        </Box>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
