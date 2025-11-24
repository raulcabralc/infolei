import { useLocalSearchParams, Stack, Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { api } from "../../src/services/api";

export default function CategoryDetails() {
  // Pega o ID para busca e o Nome para exibição via params
  const { id, name } = useLocalSearchParams();

  const [laws, setLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawsByCategory();
  }, [id]);

  async function fetchLawsByCategory() {
    try {
      // Busca leis filtradas pela categoria
      const response = await api.get("/law", {
        params: { category: id },
      });

      const list = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setLaws(list);
    } catch (error) {
      console.error("Erro ao buscar leis da categoria:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "", // Deixa o título vazio para usarmos o nosso customizado
          headerTintColor: "#4F46E5",
          headerStyle: { backgroundColor: "#F5F7FA" },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{name}</Text>
        <Text style={styles.categorySubtitle}>
          Leis e projetos relacionados a este tema.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={laws}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhuma lei encontrada nesta categoria.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Link href={`/law/${item._id}`} asChild>
              <TouchableOpacity style={styles.card}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.popularTitle}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.shortDescription}
                  </Text>
                  <Text style={styles.readMore}>Ler mais</Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  categoryTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 28,
    color: "#111",
    marginBottom: 8,
  },
  categorySubtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#666",
  },
  // Card Style (Vertical List)
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row", // Imagem na esquerda, texto na direita
    height: 120,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    width: 100,
    height: "100%",
    backgroundColor: "#eee",
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  readMore: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "bold",
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
