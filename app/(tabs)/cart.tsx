import CartItemComponent from "@/components/cartItem";
import EmptyCartUi from "@/components/emptyCartUi";
import Header from "@/components/header";
import Loading from "@/components/Loading";
import {
  ORDERS_COLLECTION_ID,
  ORDERS_ITEM_COLLECTION_ID,
  PRODUCTS_COLLECTION_ID,
  PRODUCTS_DB_ID,
} from "@/constants/constants";
import { databases } from "@/lib/appwriteConfig";
import { useAuth } from "@/lib/auth-context";
import { CartItem } from "@/types/cartItem";
import { Order } from "@/types/order";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Query } from "appwrite";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  //logique of fetching cart items, update qtity, remove item
  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // First, get user's order
      const existingOrders = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_COLLECTION_ID,
        [Query.equal("userID", user.$id)]
      );

      if (existingOrders.documents.length === 0) {
        setCartItems([]);
        setOrder(null);
        setLoading(false);
        return;
      }

      const userOrder = existingOrders.documents[0] as any;
      setOrder({
        id: userOrder.$id,
        userID: userOrder.userID,
        totalPrice: userOrder.totalPrice,
      });

      // Get all order items for this order
      const orderItems = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_ITEM_COLLECTION_ID,
        [Query.equal("orderID", userOrder.$id)]
      );

      // Get product IDs from order items
      const productIds = [
        ...new Set(orderItems.documents.map((item: any) => item.productID)),
      ];

      // Fetch product data for all products in the cart
      // Create a map of product ID to product data for quick lookup
      const productMap = new Map();

      // Fetch products individually (safer approach for multiple IDs)
      for (const productId of productIds) {
        try {
          const product = await databases.getDocument(
            PRODUCTS_DB_ID,
            PRODUCTS_COLLECTION_ID,
            productId
          );
          productMap.set(productId, product);
        } catch (error) {
          console.warn(`Failed to fetch product ${productId}:`, error);
          // Continue with other products
        }
      }

      const items: CartItem[] = orderItems.documents.map((item: any) => {
        const product = productMap.get(item.productID);
        return {
          id: item.$id,
          orderID: item.orderID,
          productID: item.productID,
          product_title: item.product_title,
          total_price: item.total_price,
          quantity: item.quantity,
          image: product?.imageURL || "",
        };
      });

      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Alert.alert("Error", "Failed to load cart items");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);

    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (!item) return;

      const unitPrice = item.total_price / item.quantity;
      const newTotalPrice = unitPrice * newQuantity;

      await databases.updateDocument(
        PRODUCTS_DB_ID,
        ORDERS_ITEM_COLLECTION_ID,
        itemId,
        {
          quantity: newQuantity,
          total_price: newTotalPrice,
        }
      );

      // Update local state
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, quantity: newQuantity, total_price: newTotalPrice }
            : i
        )
      );

      // Recalculate order total
      if (order) {
        const newOrderTotal = cartItems.reduce((total, i) => {
          if (i.id === itemId) {
            return total + newTotalPrice;
          }
          return total + i.total_price;
        }, 0);

        await databases.updateDocument(
          PRODUCTS_DB_ID,
          ORDERS_COLLECTION_ID,
          order.id,
          {
            totalPrice: newOrderTotal,
          }
        );

        setOrder((prev) =>
          prev ? { ...prev, totalPrice: newOrderTotal } : null
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await databases.deleteDocument(
                PRODUCTS_DB_ID,
                ORDERS_ITEM_COLLECTION_ID,
                itemId
              );

              // Update local state
              setCartItems((prev) => prev.filter((i) => i.id !== itemId));

              // Recalculate order total
              if (order) {
                const item = cartItems.find((i) => i.id === itemId);
                if (item) {
                  const newOrderTotal = order.totalPrice - item.total_price;

                  if (newOrderTotal <= 0) {
                    // Delete the order if no items left
                    await databases.deleteDocument(
                      PRODUCTS_DB_ID,
                      ORDERS_COLLECTION_ID,
                      order.id
                    );
                    setOrder(null);
                  } else {
                    await databases.updateDocument(
                      PRODUCTS_DB_ID,
                      ORDERS_COLLECTION_ID,
                      order.id,
                      {
                        totalPrice: newOrderTotal,
                      }
                    );
                    setOrder((prev) =>
                      prev ? { ...prev, totalPrice: newOrderTotal } : null
                    );
                  }
                }
              }
            } catch (error) {
              console.error("Error removing item:", error);
              Alert.alert("Error", "Failed to remove item");
            }
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartItemComponent
      item={item}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      isUpdating={updatingItem === item.id}
    />
  );

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-orange-100">
        <MaterialCommunityIcons name="cart-off" size={64} color="#ccc" />
        <Text className="text-lg text-gray-600 mt-4">
          Please log in to view your cart
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push("/auth")}
          className="mt-4"
        >
          Sign In
        </Button>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCartUi />;
  }

  return (
    <View className="flex-1 bg-orange-100">
      <Header title="Shopping Cart" />

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Cart Summary */}
      {order && (
        <View className="bg-orange-100 p-6 border-t border-orange-200">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Total:</Text>
            <Text className="text-2xl font-bold text-green-800">
              ${order.totalPrice.toFixed(2)}
            </Text>
          </View>

          <Button
            mode="contained"
            buttonColor="#c2410c"
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 16 }}
            onPress={() =>
              Alert.alert("Checkout", "Checkout functionality coming soon!")
            }
          >
            Proceed to Checkout
          </Button>
        </View>
      )}
    </View>
  );
}
