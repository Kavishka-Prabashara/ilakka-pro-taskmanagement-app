import { Tabs } from "expo-router";
import Profile from "./profile";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Profile {...props} />}
    >
      <Tabs.Screen name="Home" />
      {/* Add more screens like Profile, Settings here */}
    </Tabs>
  );
}
