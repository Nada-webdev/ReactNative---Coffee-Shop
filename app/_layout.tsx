import Loading from "@/components/Loading";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "./global.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments(); //this one will let you know the path user is in

  useEffect(() => {
    //the first load of the page
    if (isLoadingUser || !segments?.[0]) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, isLoadingUser, segments, router]);

  if (isLoadingUser || !segments?.[0]) {
    return <Loading />;
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
          </Stack>
        </RouteGuard>
      </CartProvider>
    </AuthProvider>
  );
}
