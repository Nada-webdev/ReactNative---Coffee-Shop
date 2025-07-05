import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { View, Text} from 'react-native';
import { Button } from 'react-native-paper';
import Header from './header';

export default function EmptyCartUi() {
          const router = useRouter();
  return (
    <View className="flex-1 bg-white">

      <Header title="Shopping Cart" />
      {/* Empty Cart */}
      <View className="flex-1 justify-center items-center">
        <MaterialCommunityIcons name="cart-outline" size={64} color="#ccc" />
        <Text className="text-lg text-gray-600 mt-4 mb-2">
          Your cart is empty
        </Text>
        <Text className="text-sm text-gray-400 mb-6">
          Add some delicious coffee to get started!
        </Text>
        <Button
          mode="contained"
          buttonColor="#c2410c"
          onPress={() => router.push("/(tabs)")}
        >
          Start Shopping
        </Button>
      </View>
    </View>
  );
}
