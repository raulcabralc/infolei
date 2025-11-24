import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { api } from "../../src/services/api";

const { width } = Dimensions.get("window");

export default function LawDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [law, setLaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLawDetails();
  }, [id]);

  async function fetchLawDetails() {
    try {
      const response = await api.get(`/law/${id}`);
      setLaw(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );

  if (!law)
    return (
      <View style={styles.loading}>
        <Text>Lei não encontrada.</Text>
      </View>
    );

  // Cor dinâmica da categoria (ou azul padrão se falhar)
  const categoryColor = law.category?.colorHex || "#4F46E5";

  return (
    <>
      {/* Configuração do Header Nativo */}
      <Stack.Screen
        options={{
          title: "", // Título simples na barra
          headerTintColor: "#4F46E5", // Cor da seta de voltar
          headerStyle: { backgroundColor: "#F5F7FA" }, // Fundo igual ao da tela
          headerShadowVisible: false, // Remove a linha/sombra do header
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 1. IMAGEM DE CAPA (Full Width, Altura Controlada) */}
        <Image
          source={{ uri: law.imageUrl }}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          {/* 2. CATEGORIA (Estilo Badge/Pill do Perfil) */}
          <View style={styles.categoryRow}>
            <View
              style={[styles.categoryBadge, { backgroundColor: categoryColor }]}
            >
              <Text style={styles.categoryText}>
                {law.category?.name || "Geral"}
              </Text>
            </View>
          </View>

          {/* 3. TÍTULOS */}
          <Text style={styles.popularTitle}>{law.popularTitle}</Text>
          <Text style={styles.officialTitle}>{law.officialTitle}</Text>

          {/* Divisor Sutil */}
          <View style={styles.divider} />

          {/* 4. DESCRIÇÃO LONGA */}
          <Text style={styles.sectionLabel}>O que diz a lei?</Text>
          <Text style={styles.longDescription}>{law.longDescription}</Text>

          {/* 5. SESSÃO DE IMPACTOS */}
          <View style={styles.impactSection}>
            <Text style={styles.sectionLabel}>Principais Impactos</Text>
            <View style={styles.impactBox}>
              {law.impactPoints?.map((point: string, index: number) => (
                <View key={index} style={styles.impactRow}>
                  {/* Bolinha colorida com a cor da categoria */}
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: categoryColor },
                    ]}
                  />
                  <Text style={styles.impactText}>{point}</Text>
                </View>
              ))}

              {(!law.impactPoints || law.impactPoints.length === 0) && (
                <Text style={styles.emptyImpacts}>Nenhum impacto listado.</Text>
              )}
            </View>
          </View>

          {/* Espaço extra no final para scroll confortável */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Imagem Topo
  banner: {
    width: width, // Ocupa toda a largura
    height: 240, // Altura fixa menor verticalmente
    backgroundColor: "#ddd",
  },

  contentContainer: {
    padding: 24,
    marginTop: -20, // Efeito visual: sobe um pouco sobre a imagem (opcional, ou remove se preferir flat)
    backgroundColor: "#F5F7FA", // Garante que o fundo cubra a imagem se usar margem negativa
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // Categoria Estilo "Pill"
  categoryRow: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // Bem arredondado
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
    textTransform: "uppercase",
  },

  // Títulos
  popularTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 26,
    color: "#111",
    marginBottom: 8,
    lineHeight: 32,
  },
  officialTitle: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },

  // Descrição
  sectionLabel: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  longDescription: {
    fontFamily: "Montserrat_400Regular", // Ou Poppins se tiver carregado
    fontSize: 16,
    lineHeight: 26, // Bom espaçamento entre linhas
    color: "#444",
    marginBottom: 32,
    textAlign: "justify", // Justificado para parecer artigo de jornal
  },

  // Impactos
  impactSection: {
    marginTop: 8,
  },
  impactBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  impactRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8, // Alinha com a primeira linha do texto
    marginRight: 12,
  },
  impactText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    fontFamily: "Montserrat_400Regular",
  },
  emptyImpacts: {
    color: "#999",
    fontStyle: "italic",
  },
});
