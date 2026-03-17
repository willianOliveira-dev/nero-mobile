import { CurvedBottomTabs } from '@/src/components/reacticx/ui/base/curved-bottom-tabs';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { Tabs } from 'expo-router';
import { Home, Search, ShoppingCart, User } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                tabBar={(props) => (
                    <CurvedBottomTabs
                        {...props}
                        gradients={['#D70040', '#A2002A']}
                        labelColor="#FFB3C1"
                    />
                )}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Início',
                        tabBarIcon: ({ focused }) => (
                            <Home
                                size={22}
                                color={focused ? '#FFFFFF' : '#FFB3C1'}
                                strokeWidth={focused ? 2.5 : 1.5}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: 'Buscar',
                        tabBarIcon: ({ focused }) => (
                            <Search
                                size={22}
                                color={focused ? '#FFFFFF' : '#FFB3C1'}
                                strokeWidth={focused ? 2.5 : 1.5}
                            />
                        ),
                    }}
                />
                <Tabs.Protected guard={isAuthenticated}>
                    <Tabs.Screen
                        name="cart"
                        options={{
                            title: 'Carrinho',
                            tabBarIcon: ({ focused }) => (
                                <ShoppingCart
                                    size={22}
                                    color={focused ? '#FFFFFF' : '#FFB3C1'}
                                    strokeWidth={focused ? 2.5 : 1.5}
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: 'Perfil',
                            tabBarIcon: ({ focused }) => (
                                <User
                                    size={22}
                                    color={focused ? '#FFFFFF' : '#FFB3C1'}
                                    strokeWidth={focused ? 2.5 : 1.5}
                                />
                            ),
                        }}
                    />
                </Tabs.Protected>
            </Tabs>
        </GestureHandlerRootView>
    );
}
