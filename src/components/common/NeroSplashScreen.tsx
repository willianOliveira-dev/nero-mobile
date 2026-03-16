import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedMaskedText from '../ui/molecules/animated-masked-text/AnimatedMaskedText';

interface Props {
    onFinish: () => void;
}

export default function NeroSplashScreen({ onFinish }: Props) {
    useEffect(() => {
        const timer = setTimeout(onFinish, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <AnimatedMaskedText
                    style={{
                        fontFamily: 'Oughter',
                        fontSize: 84,
                        fontWeight: '100',
                    }}
                    baseTextColor="#FF6B80"
                >
                    nero
                </AnimatedMaskedText>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D70040',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
