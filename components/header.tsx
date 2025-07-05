import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Loading from "./Loading";

export default function Header({ title }: { title?: string }) {
  const router = useRouter();
  const { signOut, isLoadingUser } = useAuth();
  const { cartItemsCount } = useCart();

  if (isLoadingUser) {
    return <Loading />;
  }
  return (
    <View className="bg-orange-700 p-4 flex-row justify-between items-center shadow-md">
      <View className="flex-row items-center space-x-2">
        <Button
          mode="text"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
          icon="arrow-left"
          textColor="white"
          compact
        >
          {""}
        </Button>
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
      <View className="flex-row items-center space-x-2">
        <Button
          mode="text"
          onPress={signOut}
          icon="logout"
          labelStyle={{ color: "white", fontSize: 20 }}
          contentStyle={{ padding: 0 }}
          compact
        >
          {""}
        </Button>
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="relative"
        >
          <MaterialCommunityIcons name="cart" size={24} color="white" />
          {cartItemsCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
