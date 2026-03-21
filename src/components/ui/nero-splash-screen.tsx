import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn, FadeOut } from 'react-native-reanimated';

interface Props {
    onFinish: () => void;
}

export default function NeroSplashScreen({ onFinish }: Props) {
    useEffect(() => {
        const finishTimer = setTimeout(() => {
            onFinish();
        }, 3300);

        return () => clearTimeout(finishTimer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <Animated.Text
                    entering={FadeIn.duration(1200)}
                    exiting={FadeOut.duration(400)}
                    style={styles.text}
                >
                    nero
                </Animated.Text>
            </View>
        </View>
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
    text: {
        fontFamily: 'Oughter',
        fontSize: 84,
        fontWeight: '100', // Restore peso da fonte, pode ser a causa do texto oculto se Oughter normal não existe
        color: '#FF6B80',
    }
});
