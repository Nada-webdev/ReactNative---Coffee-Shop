import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  // Reusable Icon Renderer
  const TabBarIcon = ({
    focused,
    IconFocused,
    IconUnfocused,
    nameFocused,
    nameUnfocused,
    color,
    size,
  }: any) => {
    const Icon = focused ? IconFocused : IconUnfocused;
    const name = focused ? nameFocused : nameUnfocused;
    return <Icon name={name} size={size} color={color} />;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "brown",
        tabBarInactiveTintColor: "brown",
        tabBarStyle: {
          backgroundColor: "#fed7aa", // Orange-100 to match home background
          borderTopWidth: 0, // Remove border for seamless look
          borderTopColor: "transparent",
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              IconFocused={Entypo}
              IconUnfocused={Ionicons}
              nameFocused="home"
              nameUnfocused="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              IconFocused={Ionicons}
              IconUnfocused={Ionicons}
              nameFocused="cart"
              nameUnfocused="cart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
