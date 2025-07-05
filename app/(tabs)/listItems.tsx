import Items from "@/components/items";
import Loading from "@/components/Loading";
import { PRODUCTS_COLLECTION_ID, PRODUCTS_DB_ID } from "@/constants/constants";
import { databases } from "@/lib/appwriteConfig";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export function ListItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(
        PRODUCTS_DB_ID,
        PRODUCTS_COLLECTION_ID
      );

      const formatted = response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.title,
        price: doc.price,
        image: doc.imageURL || "",
      }));

      setItems(formatted);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <View className="flex-1 bg-orange-100 p-4">
      <Text className="text-2xl text-orange-700 font-bold mb-4 text-center">
        Menu
      </Text>
        {items.map((item) => (
          <Items key={item.id} item={item} />
        ))}
      </View>

  );
}
