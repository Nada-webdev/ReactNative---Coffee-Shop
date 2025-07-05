import { getImageSource } from "@/lib/imageUtils";
import { CartItemProps } from "@/types/components";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
  isUpdating = false,
}: CartItemProps) {
  const unitPrice = item.total_price / item.quantity;

  const handleDecrease = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  return (
    <View className="bg-white p-4 mb-2 rounded-lg border border-gray-200">
      <View className="flex-row">
        {/* Product Image */}
        <View className="mr-4">
          {(() => {
            const imageSource = getImageSource(item.image || "");

            if (imageSource) {
              return (
                <Image
                  source={imageSource}
                  style={{ width: 80, height: 80 }}
                  className="rounded-lg"
                  resizeMode="cover"
                />
              );
            } else {
              return (
                <View className="w-20 h-20 bg-amber-100 rounded-lg justify-center items-center">
                  <MaterialCommunityIcons
                    name="coffee"
                    size={30}
                    color="#92400e"
                  />
                </View>
              );
            }
          })()}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.product_title}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            ${unitPrice.toFixed(2)} each
          </Text>

          {/* Quantity Controls */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleDecrease}
                disabled={isUpdating || item.quantity <= 1}
                className={`w-8 h-8 rounded-full justify-center items-center ${
                  isUpdating || item.quantity <= 1
                    ? "bg-gray-100"
                    : "bg-gray-200"
                }`}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={16}
                  color={isUpdating || item.quantity <= 1 ? "#ccc" : "#666"}
                />
              </TouchableOpacity>

              <Text className="mx-3 text-lg font-semibold">
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrease}
                disabled={isUpdating}
                className={`w-8 h-8 rounded-full justify-center items-center ${
                  isUpdating ? "bg-gray-100" : "bg-gray-200"
                }`}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={16}
                  color={isUpdating ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-green-800 mr-3">
                ${item.total_price.toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={handleRemove}
                disabled={isUpdating}
                className="p-2"
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color={isUpdating ? "#ccc" : "red"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
