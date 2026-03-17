import { useGetHome } from '@/src/api/generated/home/home';
import { Avatar, AvatarImage } from '@/src/components/gluestack/ui/avatar';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { CategoryItem } from '@/src/components/ui/category-item';
import { ProductCard } from '@/src/components/ui/product-card';
import { SectionHeader } from '@/src/components/ui/seaction-header';
import { SearchBar } from '@/src/components/ui/search-bar';
import { ChevronDownIcon, ShoppingCart } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar } from 'react-native';

const AVATAR_URI =
    'https://www.figma.com/api/mcp/asset/0e9d6c12-a83a-4d88-80ad-5360fa62c3a0';

// Mantendo categorias estáticas conforme solicitado
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

export default function HomeScreen() {
    const [activeCategory, setActiveCategory] = useState('1');
    
    const { data: homeResponse, isPending, error } = useGetHome();

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-background-0 items-center justify-center">
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    const sections = homeResponse || [];

    return (
        <SafeAreaView className="flex-1 bg-background-0">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: 75,
                }}
                showsVerticalScrollIndicator={false}
            >
                <HStack className="items-center justify-between mb-4">
                    <Avatar size="md" className="rounded-full">
                        <AvatarImage source={{ uri: AVATAR_URI }} />
                    </Avatar>

                    <Pressable className="flex-row items-center bg-background-100 rounded-full px-3.5 py-3 gap-1">
                        <Text className="text-xs font-gabarito-bold font-bold text-typography-900">
                            Homens
                        </Text>
                        <ChevronDownIcon
                            size={16}
                            className="text-typography-900"
                        />
                    </Pressable>

                    <Pressable className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                        <ShoppingCart size={16} color="#ffffff" />
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
            </ScrollView>
        </SafeAreaView>
    );
}
