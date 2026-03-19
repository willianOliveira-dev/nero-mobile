import { useAuth } from '@/src/hooks/auth/use-auth';
import { Tabs } from 'expo-router';
import { Home, Search, ShoppingCart, User } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CustomTabBar, TabConfig } from '@/src/components/ui/custom-tab-bar';

const MY_TABS: TabConfig[] = [
    { name: 'home', Icon: Home },
    { name: 'search', Icon: Search },
    { name: 'cart', Icon: ShoppingCart },
    { name: 'profile', Icon: User },
];

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Tabs
                tabBar={(props) => (
                    <CustomTabBar
                        {...props}
                        tabs={MY_TABS}
                        hiddenRoutes={[
                            'product/[slug]',
                            'search',
                            'categories',
                            'products-by-category/[id]',
                            'profile/edit',
                            'address',
                            'address/new',
                            'address/edit',
                        ]}
                    />
                )}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    sceneStyle: { backgroundColor: 'transparent' },
                }}
            >
                <Tabs.Screen name="home" />
                
                <Tabs.Screen name="search" />

                <Tabs.Screen
                    name="product/[slug]"
                    options={{ headerShown: false }}
                />

                <Tabs.Screen
                    name="categories"
                    options={{ headerShown: false }}
                />

                <Tabs.Screen
                    name="products-by-category/[id]"
                    options={{ headerShown: false }}
                />

                <Tabs.Protected guard={isAuthenticated}>
                    <Tabs.Screen name="cart" />
                    <Tabs.Screen name="profile" />
                    <Tabs.Screen name="profile/edit" options={{ headerShown: false }} />
                    <Tabs.Screen name="address" options={{ headerShown: false }} />
                    <Tabs.Screen name="address/new" options={{ headerShown: false }} />
                    <Tabs.Screen name="address/edit" options={{ headerShown: false }} />
                </Tabs.Protected>
            </Tabs>
        </GestureHandlerRootView>
    );
}
