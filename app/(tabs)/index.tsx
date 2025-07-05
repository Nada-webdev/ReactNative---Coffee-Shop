import Loading from "@/components/Loading";
import { useAuth } from "@/lib/auth-context";
import {  View } from "react-native";
import { ListItems } from "./listItems";
import Header from "@/components/header";

export default function Index() {
  const { isLoadingUser } = useAuth();
  
  if (isLoadingUser) {
    return <Loading />;
  }
  return (
    <View className="flex-1 ">
  
      <Header title="Coffee shop " />
      {/*  List of items on the store  */}
      <ListItems />
    </View>
  );
}
