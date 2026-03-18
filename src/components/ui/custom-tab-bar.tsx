import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';

export interface TabConfig {
    name: string;
    Icon: React.FC<{ size: number; color: string; strokeWidth: number }>;
}

interface CustomTabBarProps extends BottomTabBarProps {
    tabs: TabConfig[];
    hiddenRoutes?: string[];
}

interface TabItemProps {
    tab: TabConfig;
    isFocused: boolean;
    onPress: () => void;
    accessibilityLabel?: string;
}

const TabItem: React.FC<TabItemProps> = ({
    tab,
    isFocused,
    onPress,
    accessibilityLabel,
}) => {
    const { Icon } = tab;
    const progress = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isFocused ? 1 : 0, {
            damping: 15,
            stiffness: 200,
        });
    }, [isFocused]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(isFocused ? -2 : 0, {
                    damping: 15,
                    stiffness: 200,
                }),
            },
        ],
    }));

    const dotStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
        transform: [
            {
                scale: withSpring(isFocused ? 1 : 0.4, {
                    damping: 12,
                    stiffness: 200,
                }),
            },
        ],
    }));

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={accessibilityLabel}
            className="flex-1 items-center justify-center gap-1.5 py-3"
        >
            <Animated.View style={iconStyle}>
                <Icon
                    size={22}
                    color={isFocused ? '#D70040' : '#9CA3AF'}
                    strokeWidth={isFocused ? 2.5 : 1.5}
                />
            </Animated.View>

            <Animated.View
                style={dotStyle}
                className="w-1 h-1 rounded-full bg-primary"
            />
        </Pressable>
    );
};

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
    state,
    descriptors,
    navigation,
    tabs,
    hiddenRoutes = [],
}) => {
    const insets = useSafeAreaInsets();

    const activeRouteName = state.routes[state.index]?.name;
    if (hiddenRoutes.includes(activeRouteName)) return null;

    return (
        <Box
            className="bg-white px-2"
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: insets.bottom || 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 12,
            }}
        >
            <HStack className="items-center">
                {state.routes.map((route, index) => {
                    const tabConfig = tabs.find((t) => t.name === route.name);
                    if (!tabConfig) return null;

                    const isFocused = state.index === index;
                    const { options } = descriptors[route.key];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabItem
                            key={route.key}
                            tab={tabConfig}
                            isFocused={isFocused}
                            onPress={onPress}
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                        />
                    );
                })}
            </HStack>
        </Box>
    );
};
