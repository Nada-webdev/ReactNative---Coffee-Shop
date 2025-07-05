import DetailsProduct from "@/components/detailsProduct";
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
import { useCart } from "@/lib/cart-context";
import { Product } from "@/types/product";
import { ID, Query } from "appwrite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const productId = Array.isArray(id) ? id[0] : id;

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      const response = await databases.getDocument(
        PRODUCTS_DB_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );

      console.log("Appwrite response:", response);

      // Helper function
      const parseIngredients = (ingredients: any): string[] => {
        if (!ingredients) return ["Coffee"];

        if (Array.isArray(ingredients)) {
          return ingredients.map((item) => String(item).trim());
        }

        if (typeof ingredients === "string") {
          return ingredients.split(",").map((i: string) => i.trim());
        }

        return ["Coffee"];
      };

      const productData: Product = {
        id: response.$id,
        name: response.title,
        price: response.price,
        description: response.description || "Delicious coffee product",
        ingredients: parseIngredients(response.ingredients),
        calories: response.calories || 0,
        caffeine: response.caffeine || "N/A",
        image: response.imageURL || "",
      };

      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">Product not found !!</Text>
        <Button
          onPress={() => router.back()}
          buttonColor="red"
          textColor="white"
        >
          Go Back
        </Button>
      </View>
    );
  }

  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    if (!user || !product) {
      Alert.alert("Error", "You must be logged in to add items to cart");
      return;
    }

    setAddingToCart(true);

    try {
      // First, check if user has an existing order (cart)
      const existingOrders = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_COLLECTION_ID,
        [Query.equal("userID", user.$id)]
      );

      let orderId: string;

      // If no existing order, create one
      if (existingOrders.documents.length === 0) {
        const newOrder = await databases.createDocument(
          PRODUCTS_DB_ID,
          ORDERS_COLLECTION_ID,
          ID.unique(),
          {
            userID: user.$id,
            totalPrice: product.price * quantity,
          }
        );
        orderId = newOrder.$id;
      } else {
        // Use existing order and update total price
        const existingOrder = existingOrders.documents[0];
        orderId = existingOrder.$id;

        // Update total price
        await databases.updateDocument(
          PRODUCTS_DB_ID,
          ORDERS_COLLECTION_ID,
          orderId,
          {
            totalPrice: existingOrder.totalPrice + product.price * quantity,
          }
        );
      }

      // Check if product already exists in cart
      const existingOrderItems = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_ITEM_COLLECTION_ID,
        [Query.equal("orderID", orderId), Query.equal("productID", product.id)]
      );

      if (existingOrderItems.documents.length > 0) {
        // Update existing order item
        const existingItem = existingOrderItems.documents[0];
        const newQuantity = existingItem.quantity + quantity;
        const newTotalPrice = product.price * newQuantity;

        await databases.updateDocument(
          PRODUCTS_DB_ID,
          ORDERS_ITEM_COLLECTION_ID,
          existingItem.$id,
          {
            quantity: newQuantity,
            total_price: newTotalPrice,
          }
        );
      } else {
        // Create new order item
        await databases.createDocument(
          PRODUCTS_DB_ID,
          ORDERS_ITEM_COLLECTION_ID,
          ID.unique(),
          {
            orderID: orderId,
            productID: product.id,
            product_title: product.name,
            total_price: product.price * quantity,
            quantity: quantity,
          }
        );
      }

      Alert.alert("Success", `${quantity} ${product.name}(s) added to cart!`, [
        {
          text: "Continue Shopping",
          style: "default",
        },
        {
          text: "View Cart",
          style: "default",
          onPress: () => {
            router.push("/cart");
          },
        },
      ]);

      // Refresh cart count after successful add
      refreshCart();

      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title="Product Details" />

      <ScrollView className="bg-white">
        <DetailsProduct
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
        />
      </ScrollView>
    </View>
  );
}
