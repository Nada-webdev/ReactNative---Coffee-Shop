import { getImageSource } from "@/lib/imageUtils";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Items({ item }: { item: any }) {
  const router = useRouter();

  return (
    <View>
      <ScrollView>
        <View
          key={item.id}
          className="flex-row  p-4 mb-2 bg-gray-100 rounded-lg shadow"
        >
          {(() => {
            const imageSource = getImageSource(
              item.image || item.imageURL || ""
            );

            if (imageSource) {
              return (
                <Image
                  source={imageSource}
                  style={{ width: 80, height: 80 }}
                  className="rounded-full mb-4"
                  resizeMode="cover"
                />
              );
            } else {
              return (
                <View className="w-20 h-20 bg-gray-200 rounded-full mb-4 justify-center items-center">
                  <Text className="text-gray-500 text-sm text-center">
                    Image
                  </Text>
                </View>
              );
            }
          })()}

          <View className="ml-4">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-orange-600">${item.price.toFixed(2)}</Text>
          </View>
          <View className=" flex justify-end items-end ml-auto">
            <Button
              buttonColor="#c2410c"
              labelStyle={{ color: "white", fontSize: 10 }}
              contentStyle={{ height: 24, paddingHorizontal: 8 }}
              compact
              mode="contained"
              onPress={() => {
                router.push({
                  pathname: "/product/[id]",
                  params: { id: String(item.id) },
                });
              }}
            >
              Details
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
