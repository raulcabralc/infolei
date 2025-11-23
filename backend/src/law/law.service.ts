import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { LawRepository } from "./law.repository";
import { CreateLawDTO } from "./dtos/create-law.dto";
import { Law } from "./law.schema";
import { lastValueFrom } from "rxjs";
import { AiService } from "src/ai/ai.service";
import { CategoryService } from "src/category/category.service";
import { HttpService } from "@nestjs/axios";
import { LawsIndexDTO } from "./dtos/laws-index.dto";

@Injectable()
export class LawService {
  constructor(
    private readonly lawRepository: LawRepository,
    private readonly httpService: HttpService,
    private readonly aiService: AiService,
    private readonly categoryService: CategoryService,
  ) {}

  async index(queryDTO: LawsIndexDTO) {
    const { page = 1, limit = 10, search, category } = queryDTO;

    const skip = (page - 1) * limit;

    const filters: any = {};

    if (category) {
      filters.category = category;
    }

    if (search) {
      filters.$or = [
        { popularTitle: { $regex: search, $options: "i" } },
        { officialTitle: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
      ];
    }

    return this.lawRepository.index(filters, skip, limit, page);
  }

  async syncFromCamara() {
    const url =
      "https://dadosabertos.camara.leg.br/api/v2/proposicoes?codSituacao=1140&ordem=DESC&ordenarPor=id";

    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          Accept: "application/json",
        },
      }),
    );

    const propositions = response.data.dados;

    const categoryIndex = await this.categoryService.index();

    let savedCount = 0;

    for (const proposition of propositions) {
      const officialTitle = `${proposition.siglaTipo} ${proposition.numero}/${proposition.ano}`;

      const exists =
        await this.lawRepository.findOneByOfficialTitle(officialTitle);

      if (exists) continue;

      try {
        const aiData = await this.aiService.analyzeAndClassify(
          officialTitle,
          proposition.ementa,
          categoryIndex,
        );

        if (!aiData) {
          continue;
        }

        const categoryObj = categoryIndex.find(
          (c) => c._id.toString() === aiData.categoryId,
        );
        const themeImage = this.getThemeImage(categoryObj?.name || "Geral");

        await this.lawRepository.create({
          officialTitle: officialTitle,
          popularTitle: aiData.popularTitle || officialTitle,
          sourceUrl: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${proposition.id}`,
          publishDate: new Date(),
          imageUrl: themeImage,
          category: aiData.categoryId,
          shortDescription: aiData.shortDescription,
          longDescription: aiData.longDescription,
          impactPoints: aiData.impactPoints,
        });

        savedCount++;
      } catch {
        throw new ServiceUnavailableException("An unknown error has occured.");
      }
    }

    return {
      message: `Sync completed successfully. ${savedCount} new imported laws.`,
      total: propositions.length,
    };
  }

  async syncBatch(limit: number = 50) {
    const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes?codSituacao=1140&ordem=DESC&ordenarPor=id&itens=${limit}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Accept: "application/json",
          },
        }),
      );

      const data = response.data.dados;

      return this.processLawList(data);
    } catch {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async importSpecificLaws(ids: number[]) {
    const processingList: any[] = [];

    try {
      for (const id of ids) {
        const url = `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${id}`;

        const response = await lastValueFrom(
          this.httpService.get(url, {
            headers: {
              Accept: "application/json",
            },
          }),
        );

        if (response.data.dados) {
          processingList.push(response.data.dados);
        }
      }
    } catch {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }

    return this.processLawList(processingList);
  }

  async deleteAll() {
    return await this.lawRepository.deleteAll();
  }

  /// UTILS

  private async processLawList(propositionList: any[]) {
    const categoryIndex = await this.categoryService.index();

    let saved = 0;
    let ignored = 0;
    let errors = 0;

    for (const proposition of propositionList) {
      const officialTitle = `${proposition.siglaTipo} ${proposition.numero}/${proposition.ano}`;

      const exists =
        await this.lawRepository.findOneByOfficialTitle(officialTitle);
      if (exists) continue;

      try {
        const aiData = await this.aiService.analyzeAndClassify(
          officialTitle,
          proposition.ementa,
          categoryIndex,
        );

        if (!aiData) {
          ignored++;
          continue;
        }

        const categoryObj = categoryIndex.find(
          (c) => c._id.toString() === aiData.categoryId,
        );
        const themeImage = this.getThemeImage(categoryObj?.name || "Geral");

        await this.lawRepository.create({
          officialTitle,
          popularTitle: aiData.popularTitle,
          sourceUrl: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${proposition.id}`,
          publishDate: new Date(),
          imageUrl: themeImage,

          category: aiData.categoryId,
          shortDescription: aiData.shortDescription,
          longDescription: aiData.longDescription,
          impactPoints: aiData.impactPoints,
        });

        saved++;
      } catch {
        errors++;
      }
    }

    return {
      status: "Done",
      saved_laws: saved,
      ignored_irrelevant: ignored,
      errors,
      total_scanned: propositionList.length,
    };
  }

  private getThemeImage(categoryName: string): string {
    const termo = categoryName.toLowerCase();

    if (termo.includes("saúde") || termo.includes("médic")) {
      return "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop";
    }
    if (
      termo.includes("trabalho") ||
      termo.includes("emprego") ||
      termo.includes("clt")
    ) {
      return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop";
    }
    if (
      termo.includes("transporte") ||
      termo.includes("trânsito") ||
      termo.includes("veículo")
    ) {
      return "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop";
    }
    if (
      termo.includes("educação") ||
      termo.includes("escola") ||
      termo.includes("ensino")
    ) {
      return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop";
    }
    if (termo.includes("mulher") || termo.includes("maternidade")) {
      return "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=800&auto=format&fit=crop";
    }
    if (
      termo.includes("tecnologia") ||
      termo.includes("digital") ||
      termo.includes("internet")
    ) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop";
    }
    if (
      termo.includes("segurança") ||
      termo.includes("penal") ||
      termo.includes("crime")
    ) {
      return "https://images.unsplash.com/photo-1555881400-74d7acaacd81?q=80&w=800&auto=format&fit=crop";
    }

    return "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop";
  }
}
