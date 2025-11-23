import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { Category } from "src/category/category.schema";
import { CategoryService } from "src/category/category.service";

@Injectable()
export class AiService {
  private openAi: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_KEY"),
    });
  }

  async analyzeAndClassify(
    lawTitle: string,
    lawContent: string,
    categoryIndex: Category[],
  ) {
    const categories = categoryIndex
      .map((c) => `- ${c.name} (ID: ${c._id})`)
      .join("\n");

    const prompt = `
      Você é um especialista jurídico sênior e redator focado em UX.
      Analise a nova lei abaixo e realize duas tarefas: Classificação e Resumo Didático.

      --- DADOS DA LEI ---
      Título: "${lawTitle}"
      Texto/Contexto: "${lawContent}"

      --- TAREFA 1: CLASSIFICAÇÃO ---
      Escolha a categoria mais adequada da lista abaixo. 
      ATENÇÃO: Use estritamente o ID fornecido. Se tiver dúvida, escolha o mais próximo.
      ${categories}

      --- TAREFA 2: GERAÇÃO DE CONTEÚDO ---
      1. shortDescription: Um resumo ultra-compacto (máx 8 palavras) para cards. Ex: "Aumento de salário para enfermeiros."
      2. longDescription: Uma explicação didática de 2 parágrafos para leigos. Sem juridiquês.
      3. impactPoints: Lista de 3 a 5 impactos práticos na vida do brasileiro.
      4. popularTitle: Título popular da lei. Ex: "Lei Anticorrupção".

      --- TAREFA CRÍTICA: FILTRO DE RELEVÂNCIA ---
      Se a lei for sobre: 
      - Denominação de logradouros, rodovias, viadutos ou prédios.
      - Instituição de datas comemorativas, semanas nacionais ou títulos honoríficos.
      - Remanejamento de orçamento interno ou créditos suplementares.
      
      RETORNE APENAS: { "ignored": true }
      
      Caso contrário, preencha o JSON completo abaixo:
      {
        "popularTitle": "título popular",
        "categoryId": "ID_DA_CATEGORIA_ESCOLHIDA",
        "shortDescription": "texto...",
        "longDescription": "texto...",
        "impactPoints": ["texto", "texto"]
      }
    `;

    try {
      const completion = await this.openAi.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;

      if (!content) {
        throw new ServiceUnavailableException("An unknown error has occured.");
      }

      const aiData = JSON.parse(content);

      if (aiData.ignored) {
        return null;
      }

      return {
        popularTitle: aiData.popularTitle,
        categoryId: aiData.categoryId,
        shortDescription: aiData.shortDescription,
        longDescription: aiData.longDescription,
        impactPoints: aiData.impactPoints,
      };
    } catch {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async analyzeBioAndClassifyUser(bio: string, categoryIndex: Category[]) {
    const categories = categoryIndex
      .map((c) => `- ${c.name} (ID: ${c._id})`)
      .join("\n");

    const prompt = `
      Você é um motor de classificação estrito (Strict Classifier).
      Sua única função é ler a biografia do usuário e retornar os IDs das categorias correspondentes da lista abaixo.

      --- LISTA DE CATEGORIAS VÁLIDAS (IDs Hexadecimais) ---
      ${categories}

      --- BIOGRAFIA DO USUÁRIO ---
      "${bio}"

      --- SUAS INSTRUÇÕES ---
      1. Leia a biografia e identifique temas-chave (profissão, família, bens).
      2. Encontre a categoria da lista acima que melhor engloba esses temas.
      3. Raciocínio de De-Para (Exemplos):
          - "Filhos/Pai/Mãe" -> Encaixar em Família e Herança ou Educação.
          - "Programador/Dados/TI" -> Encaixar em Digital e Tecnologia.
          - "Motorista/Uber" -> Encaixar em Trânsito e Trabalho.
          - "Separação/Ex" -> Encaixar em Família e Herança.

      --- REGRAS DE SEGURANÇA (CRÍTICO) ---
      - PROIBIDO criar novas categorias.
      - PROIBIDO retornar o nome da categoria. RETORNE APENAS O ID (Ex: "65a9...").
      - Se a biografia não combinar com nada específico, use o ID da categoria "Geral".

      --- SAÍDA JSON ESPERADA ---
      {
      "matchedCategoryIds": ["ID_HEXADECIMAL_1", "ID_HEXADECIMAL_2"]
      }
    `;

    try {
      const completion = await this.openAi.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) return [];

      const aiData = JSON.parse(content);

      if (aiData.ignored) {
        return null;
      }

      return aiData.matchedCategoryIds;
    } catch {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  /// UTILS

  async checkConnection() {
    try {
      await this.openAi.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }
}
