import {
  ORDERS_COLLECTION_ID,
  ORDERS_ITEM_COLLECTION_ID,
  PRODUCTS_DB_ID,
} from "@/constants/constants";
import { databases } from "@/lib/appwriteConfig";
import { useAuth } from "@/lib/auth-context";
import { Query } from "appwrite";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartContextType {
  cartItemsCount: number;
  refreshCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartItemsCount = useCallback(async () => {
    if (!user) {
      setCartItemsCount(0);
      return;
    }

    setIsLoading(true);
    try {
      // Get user's orders
      const orders = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_COLLECTION_ID,
        [Query.equal("userID", user.$id)]
      );

      if (orders.documents.length === 0) {
        setCartItemsCount(0);
        return;
      }

      const order = orders.documents[0];

      // Get order items
      const orderItems = await databases.listDocuments(
        PRODUCTS_DB_ID,
        ORDERS_ITEM_COLLECTION_ID,
        [Query.equal("orderID", order.$id)]
      );


      const totalCount = orderItems.documents.length;

      setCartItemsCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart items count:", error);
      setCartItemsCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshCart = useCallback(() => {
    fetchCartItemsCount();
  }, [fetchCartItemsCount]);

  useEffect(() => {
    fetchCartItemsCount();
  }, [fetchCartItemsCount]);

  return (
    <CartContext.Provider
      value={{
        cartItemsCount,
        refreshCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
