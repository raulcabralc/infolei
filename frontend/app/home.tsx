import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link, Stack } from "expo-router";
import { api } from "../src/services/api";

const { width } = Dimensions.get("window");

// --- Interfaces ---
interface Category {
  _id: string;
  name: string;
  colorHex: string;
  iconUrl: string;
}

interface Law {
  _id: string;
  popularTitle: string;
  shortDescription: string;
  imageUrl: string;
  category?: Category;
}

export default function HomeScreen() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const userProfileImage =
    "https://marketplace.canva.com/Dz63E/MAF4KJDz63E/1/tl/canva-user-icon-MAF4KJDz63E.png";

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const [lawsResponse, categoriesResponse] = await Promise.all([
        api.get("/law"),
        api.get("/category"),
      ]);

      const listaDeLeis = Array.isArray(lawsResponse.data)
        ? lawsResponse.data
        : lawsResponse.data.data || [];
      setLaws(listaDeLeis);

      const listaDeCategorias = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : categoriesResponse.data.data || [];
      setCategories(listaDeCategorias);
    } catch (error: any) {
      console.error("Erro no fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const featuredLaw = laws.length > 0 ? laws[0] : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- SEÇÃO 1: HERO HEADER --- */}
      <View style={styles.heroSection}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.heroGreeting}>Olá, cidadão</Text>
            <Text style={styles.heroDate}>Bem-vindo de volta</Text>
          </View>

          <Link href="/user" asChild>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{ uri: userProfileImage }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroContentRow}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Novidades Jurídicas</Text>
            <Text style={styles.heroSubtitle}>
              Novos projetos de lei acabaram de chegar e impactam a sua
              categoria.
            </Text>
          </View>

          {featuredLaw && (
            <Image
              source={{
                uri: "https://img.freepik.com/fotos-gratis/legal-document-signing_23-2152022021.jpg?semt=ais_hybrid&w=740&q=80",
              }}
              style={styles.heroLawImage}
              resizeMode="cover"
            />
          )}
        </View>
      </View>

      {/* --- SEÇÃO 2: ÚLTIMAS LEIS --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Últimas Leis Publicadas</Text>

        <FlatList
          horizontal
          data={laws.slice(0, 3)}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 24, paddingRight: 10 }}
          renderItem={({ item }) => (
            <Link href={`/law/${item._id}`} asChild>
              <TouchableOpacity style={styles.horizontalCard}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.horizontalCardImage}
                  resizeMode="cover"
                />
                <View style={styles.horizontalCardContent}>
                  <Text style={styles.hCardTitle} numberOfLines={2}>
                    {item.popularTitle}
                  </Text>
                  <Text style={styles.hCardDescription} numberOfLines={3}>
                    {item.shortDescription}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>

      {/* --- SEÇÃO 3: CATEGORIAS --- */}
      <View style={styles.sectionContainer}>
        <View style={styles.categoryHeaderRow}>
          <Text style={styles.sectionTitle}>Selecione a categoria</Text>
        </View>

        <View style={styles.gridContainer}>
          {categories.length === 0 ? (
            <Text style={{ color: "#999", marginLeft: 24 }}>
              Carregando categorias...
            </Text>
          ) : (
            categories.map((cat, index) => (
              <Link
                key={cat._id || index}
                href={{
                  pathname: "/category/[id]",
                  params: { id: cat._id, name: cat.name },
                }}
                asChild
              >
                <TouchableOpacity
                  // AQUI ESTAVA O ERRO: Array de estilos dentro de um Link na Web.
                  // SOLUÇÃO: StyleSheet.flatten() transforma o array em um objeto único.
                  style={StyleSheet.flatten([
                    styles.gridCard,
                    { backgroundColor: cat.colorHex || "#ccc" },
                  ])}
                >
                  {cat.iconUrl ? (
                    <Image
                      source={{ uri: cat.iconUrl }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                      }}
                      resizeMode="contain"
                    />
                  ) : null}
                  <Text style={styles.gridCardTitle}>{cat.name}</Text>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </View>
      </View>

      {/* --- FOOTER --- */}
      <View style={styles.footerSection}>
        <View style={styles.logoCircle}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.footerLogoImage}
          />
        </View>
        <Text style={styles.footerText}>InfoLei</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => alert("Chat em breve!")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/724/724715.png",
            }}
            style={{ width: 24, height: 24, tintColor: "#fff" }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- ESTILOS ---
const themeBlue = "#4F46E5";
const themeYellow = "#F4C430";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Hero
  heroSection: {
    backgroundColor: themeBlue,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  heroGreeting: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    color: "#fff",
  },
  heroDate: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 12,
    color: "#E0E7FF",
  },
  profileButton: { elevation: 4 },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: themeYellow,
  },
  heroContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTextContainer: { flex: 1, paddingRight: 16 },
  heroTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 22,
    color: "#fff",
    marginBottom: 8,
  },
  heroSubtitle: { fontSize: 13, color: "#E0E7FF", lineHeight: 20 },
  heroLawImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },

  // Sections
  sectionContainer: { marginTop: 30, marginBottom: 10 },
  sectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 24,
  },

  // Cards
  horizontalCard: {
    width: width * 0.45,
    backgroundColor: themeBlue,
    borderRadius: 16,
    marginRight: 16,
    height: 220,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalCardImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#333",
  },
  horizontalCardContent: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-start",
  },
  hCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 18,
    marginBottom: 8,
  },
  hCardDescription: { fontSize: 10, color: "#E0E7FF", lineHeight: 14 },

  // Grid
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    height: 100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: "flex-end",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 2,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Footer
  footerSection: {
    backgroundColor: themeBlue,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    minHeight: 120,
  },
  logoCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  footerLogoImage: { width: 70, height: 70, resizeMode: "contain" },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 50,
    height: 50,
    backgroundColor: themeYellow,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
