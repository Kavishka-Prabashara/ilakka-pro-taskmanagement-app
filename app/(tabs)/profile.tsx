import { View, TouchableOpacity, Text } from "react-native";
import { Tabs } from "expo-router";
import { useRouter, useSegments } from "expo-router";

export default function NavBar({ state }: any) {
  const router = useRouter();
  const segments = useSegments();

  return (
    <View className="flex-row justify-around bg-gray-100 py-3 rounded-t-2xl shadow-lg">
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => router.push(route.name === "Home" ? "/(tabs)/Home" : route.name)}
            className="items-center"
          >
            <Text className={isFocused ? "text-green-600 font-bold" : "text-gray-600"}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
