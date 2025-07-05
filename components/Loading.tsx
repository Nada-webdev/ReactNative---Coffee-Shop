import { View } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="flex-row space-x-2">
        <View className="w-5 h-5 bg-[#fa9212] rounded-full animate-bounce" />
        <View className="w-5 h-5 bg-[#713909] rounded-full animate-bounce" />
        <View className="w-5 h-5 bg-[#fae314] rounded-full animate-bounce" />
      </View>
    </View>
  );
}
