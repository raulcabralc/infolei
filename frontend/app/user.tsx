import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { api } from "../src/services/api";

const { width } = Dimensions.get("window");

const MOCK_USER = {
  name: "Raul Cabral",
  email: "raul.dev@infolei.com.br",
  bio: "sou um programador e professor",
  interestTags: ["Tecnologia", "Trabalho", "Educação"],
  avatar:
    "https://marketplace.canva.com/Dz63E/MAF4KJDz63E/1/tl/canva-user-icon-MAF4KJDz63E.png",
};

export default function UserProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastUser();
  }, []);

  async function fetchLastUser() {
    try {
      // Tenta buscar usuários do backend
      const response = await api.get("/users");

      const usersList = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (usersList && usersList.length > 0) {
        // Pega o ÚLTIMO usuário cadastrado
        const lastUser = usersList[usersList.length - 1];
        setUser(lastUser);
      } else {
        // Se a lista vier vazia, usa o Mock
        setUser(MOCK_USER);
      }
    } catch (error) {
      console.log("Erro ao buscar usuário (usando mock):", error);
      setUser(MOCK_USER);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Configuração da Barra de Navegação Nativa */}
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: "#F5F7FA" },
          headerShadowVisible: false,
          headerTintColor: "#4F46E5",
        }}
      />

      {/* --- CABEÇALHO DO PERFIL --- */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.avatar || MOCK_USER.avatar }}
            style={styles.avatar}
          />
          <View style={styles.activeBadge} />
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* --- ESTATÍSTICAS RÁPIDAS --- */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Leis Lidas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {user.interestTags?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Interesses</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>Novato</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
      </View>

      {/* --- BIOGRAFIA --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sobre Mim</Text>
        <View style={styles.bioCard}>
          <Text style={styles.bioText}>
            {user.bio || "Este usuário ainda não escreveu uma biografia."}
          </Text>
        </View>
      </View>

      {/* --- INTERESSES (TAGS) --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Interesses</Text>
        <View style={styles.tagsWrapper}>
          {(user.interestTags || []).map((tag: string, index: number) => (
            // Se tag for objeto (dependendo do seu backend), use tag.name
            <View key={index} style={styles.tagPill}>
              <Text style={styles.tagText}>
                {typeof tag === "string" ? tag : "Categoria"}
              </Text>
            </View>
          ))}
          {(!user.interestTags || user.interestTags.length === 0) && (
            <Text style={{ color: "#999" }}>Nenhum interesse selecionado.</Text>
          )}
        </View>
      </View>

      {/* --- BOTÃO LOGOUT (Visual) --- */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")} // Volta para o login/cadastro
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// --- ESTILOS ---
const themeBlue = "#4F46E5";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#ddd",
  },
  activeBadge: {
    width: 20,
    height: 20,
    backgroundColor: "#10B981", // Verde Online
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#F5F7FA",
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  userName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 24,
    color: "#111",
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#666",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: themeBlue,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    alignSelf: "center",
  },

  // Sections
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 12,
  },
  bioCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: themeBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bioText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },

  // Tags
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagPill: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: themeBlue,
    fontWeight: "bold",
    fontSize: 14,
  },

  // Logout
  logoutButton: {
    marginHorizontal: 24,
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 16,
  },
});
