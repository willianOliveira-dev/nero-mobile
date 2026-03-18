import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

interface SkeletonBoxProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: object;
}

export function SkeletonBox({
    width,
    height,
    borderRadius = 8,
    style,
}: SkeletonBoxProps) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width: width as number, height: height as number, borderRadius },
                animatedStyle,
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E5E7EB',
    },
});
