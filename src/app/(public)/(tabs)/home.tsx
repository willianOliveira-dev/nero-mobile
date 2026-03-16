import { Text } from '@/src/components/gluestack/ui/text';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { View } from 'react-native';

export default function HomeScreen() {
    const { user } = useAuth();
    return (
        <View className="flex-1 flex items-center justify-center">
            <Text>Olá, {user?.name}</Text>
        </View>
    );
}
