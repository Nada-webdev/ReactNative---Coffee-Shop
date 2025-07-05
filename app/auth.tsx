import Loading from "@/components/Loading";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";

export default function Auth() {
  const router = useRouter(); //like useNavigate in react
  const [isSignUp, setIsSignUp] = useState<boolean>(false); //this will help controle ui
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>("");
  const { isLoadingUser } = useAuth();

  const { signIn, signUp } = useAuth(); //use the hook created in auth-context

  const handleAuth = async () => {
    if (!email || !password) {
      setErr("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErr("Passwords must be at least 6 characters long.");
      return;
    }

    setErr(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setErr(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setErr(error);
        return;
      }

      router.replace("/");
    }
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  //the switch between the two btn signIn and signUp
  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/authBg.jpg")}
      className="flex-1 w-full"
      resizeMode="cover"
    >
      <View className="flex-1 justify-center px-8 bg-black/30">
        <Text className="text-3xl font-bold text-center text-white mb-4">
          {isSignUp ? "Sign up" : "Sign in"}
        </Text>
        <Text className="text-center text-gray-200 mb-4 text-base">
          {isSignUp ? "Create your account" : "Welcome back"}
        </Text>

        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4 bg-white"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-2 bg-white"
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        {err !== "" && err !== null && (
          <Text className="text-white text-sm mb-2">{err}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleAuth}
          buttonColor="#c2410c"
          labelStyle={{ color: "white" }}
          contentStyle={{ height: 45 }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <Button mode="text" onPress={handleSwitchMode} textColor="#ffffff">
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </ImageBackground>
  );
}
