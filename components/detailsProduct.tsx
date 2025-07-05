import { getImageSource } from "@/lib/imageUtils";
import { DetailsProductProps } from "@/types/components";
import { Image, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function DetailsProduct({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  addingToCart = false,
}: DetailsProductProps) {
  const handleDecrease = () => {
    onQuantityChange(Math.max(1, quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <>
      {/* Product Image */}
      <View className="items-center p-0 bg-white">
        {(() => {
          const imageSource = getImageSource(product.image || "");

          if (imageSource) {
            return (
              <Image
                source={imageSource}
                style={{ width: "100%", height: 300 }}
                resizeMode="cover"
              />
            );
          } else {
            return (
              <View className="w-32 h-32 bg-gray-200 rounded-lg justify-center items-center">
                <Text className="text-gray-500 text-sm text-center">
                  No Image
                </Text>
              </View>
            );
          }
        })()}
      </View>

      {/* Product Info */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {product.name}
        </Text>
        <Text className="text-xl text-green-600 font-semibold mb-4">
          ${product.price.toFixed(2)}
        </Text>

        <Text className="text-gray-600 text-base mb-4">
          {product.description}
        </Text>

        {/* Product Details */}
        <View className="bg-gray-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-800">
            Details
          </Text>
          <Text className="text-gray-600">Calories: {product.calories}</Text>
          <Text className="text-gray-600">Caffeine: {product.caffeine}</Text>
        </View>

        {/* Ingredients */}
        <View className="bg-gray-50 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-800">
            Ingredients
          </Text>
          {product.ingredients &&
            product.ingredients.map((ingredient, index) => (
              <Text key={index} className="text-gray-600">
                • {ingredient}
              </Text>
            ))}
        </View>

        {/* Quantity Selector */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg font-semibold text-gray-800">Quantity:</Text>
          <View className="flex-row items-center">
            <Button
              mode="outlined"
              onPress={handleDecrease}
              contentStyle={{ width: 40, height: 40 }}
              compact
              disabled={addingToCart || quantity <= 1}
            >
              -
            </Button>
            <Text className="mx-4 text-lg font-semibold text-gray-800">
              {quantity}
            </Text>
            <Button
              mode="outlined"
              onPress={handleIncrease}
              contentStyle={{ width: 40, height: 40 }}
              compact
              disabled={addingToCart}
            >
              +
            </Button>
          </View>
        </View>

        {/* Add to Cart Button */}
        <Button
          mode="contained"
          buttonColor="#c2410c"
          onPress={onAddToCart}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 16 }}
          disabled={addingToCart}
          loading={addingToCart}
        >
          {addingToCart
            ? "Adding..."
            : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
        </Button>
      </View>
    </>
  );
}
