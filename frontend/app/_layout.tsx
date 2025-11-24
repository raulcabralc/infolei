import { Stack } from "expo-router";
// 1. IMPORTAR AS FONTES
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  // 2. CARREGAR AS FONTES
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  // 3. ESPERAR CARREGAR (mostra loading se não carregou)
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="law/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
