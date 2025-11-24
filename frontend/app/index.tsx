import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, router } from "expo-router";
import { api } from "../src/services/api";

interface Category {
  _id: string;
  name: string;
  colorHex: string;
}

export default function RegisterScreen() {
  // Estados do Formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados de Preferência
  const [preferenceMode, setPreferenceMode] = useState<"bio" | "tags">("bio");
  const [bio, setBio] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Estados de Dados e Loading
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoadingCats(true);
      const response = await api.get("/category");
      const list = Array.isArray(response.data)
        ? response.data
        : response.data.data;
      setCategories(list || []);
    } catch (error) {
      console.log("Erro ao buscar categorias:", error);
    } finally {
      setLoadingCats(false);
    }
  }

  function toggleTag(id: string) {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((tagId) => tagId !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  }

  // --- FUNÇÃO DE REGISTRO ATUALIZADA ---
  async function handleRegister() {
    console.log("1. Iniciando tentativa de cadastro...");

    // 1. Validação Básica
    if (!name || !email || !password) {
      console.log("Erro: Campos vazios");
      return Alert.alert("Atenção", "Preencha nome, email e senha.");
    }

    // 2. Montagem do Payload
    const payload: any = {
      name,
      email,
      password,
    };

    // 3. Validação de Preferências e inserção no payload
    if (preferenceMode === "bio") {
      if (bio.length < 10) {
        return Alert.alert(
          "Bio curta",
          "Escreva pelo menos uma frase sobre você."
        );
      }
      payload.bio = bio;
      // Limpa tags para garantir que não envie lixo
      delete payload.interestTags;
    } else {
      if (selectedTags.length === 0) {
        return Alert.alert("Selecione", "Escolha pelo menos uma categoria.");
      }
      payload.interestTags = selectedTags;
      // Limpa bio
      delete payload.bio;
    }

    console.log("2. Payload pronto para envio:", JSON.stringify(payload));

    try {
      setSubmitting(true);

      const response = await api.post("/user/register", payload);

      console.log("3. Sucesso! Resposta do Back:", response.status);

      Alert.alert("Bem-vindo!", "Sua conta foi criada.", [
        {
          text: "Começar",
          onPress: () => {
            console.log("Navegando para home...");
            router.replace("/home");
          },
        },
      ]);
    } catch (error: any) {
      console.error("4. ERRO NO ENVIO:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);

      const msgErro =
        error.response?.data?.message ||
        "Verifique sua conexão e tente novamente.";
      Alert.alert(
        "Erro ao criar conta",
        Array.isArray(msgErro) ? msgErro[0] : msgErro
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            E tenha acesso às leis traduzidas.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Seu Nome"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Personalize seu Feed</Text>
        <Text style={styles.sectionSubtitle}>
          Como você prefere definir seus interesses?
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              preferenceMode === "bio" && styles.toggleActive,
            ]}
            onPress={() => setPreferenceMode("bio")}
          >
            <Text
              style={[
                styles.toggleText,
                preferenceMode === "bio" && styles.textActive,
              ]}
            >
              Escrever Bio (IA)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              preferenceMode === "tags" && styles.toggleActive,
            ]}
            onPress={() => setPreferenceMode("tags")}
          >
            <Text
              style={[
                styles.toggleText,
                preferenceMode === "tags" && styles.textActive,
              ]}
            >
              Selecionar Lista
            </Text>
          </TouchableOpacity>
        </View>

        {preferenceMode === "bio" ? (
          <View style={styles.bioContainer}>
            <TextInput
              style={styles.bioInput}
              multiline
              numberOfLines={4}
              placeholder="Ex: Sou estudante de direito e me interesso por tecnologia..."
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />
            <Text style={styles.hintText}>
              Nossa IA analisará seu texto para encontrar as melhores leis para
              você.
            </Text>
          </View>
        ) : (
          <View style={styles.tagsContainer}>
            {loadingCats ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              categories.map((cat) => {
                const isSelected = selectedTags.includes(cat._id);
                return (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.tagBadge,
                      isSelected && {
                        backgroundColor: themeBlue,
                        borderColor: themeBlue,
                      },
                    ]}
                    onPress={() => toggleTag(cat._id)}
                  >
                    <Text
                      style={[styles.tagText, isSelected && { color: "#fff" }]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Finalizar Cadastro</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Login", "Implementar navegação para Login")
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>Já tenho conta? Fazer Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const themeBlue = "#4F46E5";
const themeYellow = "#F4C430";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: { marginBottom: 30 },
  title: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 28,
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#666",
  },
  formSection: { marginBottom: 20 },
  label: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontFamily: "Montserrat_400Regular",
  },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 24 },
  sectionTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: "#111",
    marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontFamily: "Montserrat_700Bold", fontSize: 14, color: "#666" },
  textActive: { color: themeBlue },
  bioContainer: { marginBottom: 20 },
  bioInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 120,
    fontFamily: "Montserrat_400Regular",
  },
  hintText: { fontSize: 12, color: "#888", marginTop: 8, fontStyle: "italic" },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tagBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tagText: { fontSize: 14, color: "#555", fontFamily: "Montserrat_700Bold" },
  submitButton: {
    backgroundColor: themeBlue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
    shadowColor: themeBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
  },
  backButton: { alignItems: "center", marginBottom: 30 },
  backText: { color: themeBlue, fontSize: 14, fontWeight: "bold" },
});
