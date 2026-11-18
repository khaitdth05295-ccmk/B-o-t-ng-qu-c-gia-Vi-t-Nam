import OpenAI from 'openai';
import type { SupportedLocale } from '../src/types/heritage.ts';
import type { HeritageDatabase } from './database.ts';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2);
}

export class HeritageRagAssistant {
  private db: HeritageDatabase;

  constructor(db: HeritageDatabase) {
    this.db = db;
  }

  public getStatus() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';
    return {
      available: Boolean(apiKey),
      provider: 'openai',
      modelConfigured: model,
    };
  }

  private retrieveContext(query: string) {
    const tables = this.db.getTables();
    const keepers = this.db.getAllKeepers();
    const keepersMap = new Map(keepers.map((k) => [k.id, k]));
    const sourcesMap = new Map(tables.sources.map((s) => [s.id, s]));
    const qTokens = tokenize(query);

    const scoreText = (haystack: string) => {
      const normalized = haystack
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      let score = 0;
      for (const tok of qTokens) {
        if (normalized.includes(tok)) score += 1;
      }
      return score;
    };

    const rankedTreasures = tables.treasures
      .map((t) => {
        const keeper = keepersMap.get(t.currentKeeperId);
        const searchable = [
          t.officialName,
          t.otherNames.join(' '),
          t.dating,
          t.dynasty,
          t.discoveryPlace,
          t.summary,
          t.decisionNumber || '',
          keeper?.officialName || '',
          keeper?.provinceOrCity || '',
          t.sections.craftingTechnique,
          t.sections.historicalValue,
          t.sections.culturalValue,
        ].join(' ');
        return { treasure: t, keeper, score: scoreText(searchable) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const rankedKeepers = keepers
      .map((k) => ({
        keeper: k,
        score: scoreText(`${k.officialName} ${k.provinceOrCity} ${k.publicAddress} ${k.introduction}`),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const rankedArticles = tables.articles
      .map((a) => ({
        article: a,
        score: scoreText(`${a.title} ${a.category} ${a.summary} ${a.content.join(' ')}`),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const citedSourceIds = new Set<string>();
    for (const item of rankedTreasures) {
      item.treasure.sourceIds.forEach((id) => citedSourceIds.add(id));
    }
    rankedArticles.forEach((a) => citedSourceIds.add(a.article.sourceId));

    const citedSources = Array.from(citedSourceIds)
      .map((id) => sourcesMap.get(id))
      .filter(Boolean);

    return {
      rankedTreasures,
      rankedKeepers,
      rankedArticles,
      citedSources,
    };
  }

  public async answerQuestion(params: {
    question: string;
    locale: SupportedLocale;
    sessionId: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }) {
    const status = this.getStatus();
    if (!status.available) {
      return {
        available: false,
        answer: '',
        citedTreasures: [],
        citedSources: [],
        error: 'OPENAI_API_KEY is not configured on the server.',
      };
    }

    const apiKey = process.env.OPENAI_API_KEY!.trim();
    const model = status.modelConfigured;
    const client = new OpenAI({ apiKey });

    const { rankedTreasures, rankedKeepers, rankedArticles, citedSources } = this.retrieveContext(
      params.question,
    );

    const contextBlock = [
      '=== RETRIEVED ARTIFACT RECORDS ===',
      ...rankedTreasures.map(({ treasure: t, keeper }) =>
        JSON.stringify({
          id: t.id,
          code: t.code,
          officialName: t.officialName,
          recognitionStatus:
            t.recognitionStatus === 'national_treasure'
              ? 'BẢO VẬT QUỐC GIA (có quyết định chính thức)'
              : 'HIỆN VẬT DI SẢN TIÊU BIỂU (chưa là Bảo vật Quốc gia)',
          decision: t.decisionNumber ? `${t.decisionNumber} (${t.decisionDate}, Đợt ${t.batchNumber})` : 'Chưa có quyết định công nhận BVQG',
          dating: t.dating,
          dynasty: t.dynasty,
          discoveryPlace: t.discoveryPlace,
          keeper: keeper ? `${keeper.officialName} (${keeper.publicAddress})` : t.archival.currentHoldingInstitution,
          summary: t.summary,
          craftingTechnique: t.sections.craftingTechnique,
          historicalValue: t.sections.historicalValue,
          culturalValue: t.sections.culturalValue,
          conservationInfo: t.sections.conservationInfo,
          sourceIds: t.sourceIds,
        }),
      ),
      '=== RETRIEVED MUSEUMS & HERITAGE SITES ===',
      ...rankedKeepers.map(({ keeper: k }) =>
        JSON.stringify({
          id: k.id,
          officialName: k.officialName,
          kind: k.kind,
          provinceOrCity: k.provinceOrCity,
          publicAddress: k.publicAddress,
          openingHours: k.openingHours,
          officialWebsite: k.officialWebsite,
        }),
      ),
      '=== RETRIEVED RESEARCH ARTICLES ===',
      ...rankedArticles.map(({ article: a }) =>
        JSON.stringify({
          id: a.id,
          title: a.title,
          category: a.category,
          summary: a.summary,
          sourceId: a.sourceId,
        }),
      ),
      '=== VERIFIED SOURCES ===',
      ...citedSources.map((s) => `${s!.code}: ${s!.name} — ${s!.documentTitle} (${s!.url})`),
    ].join('\n');

    const systemPrompt = `You are "TRỢ LÝ DI SẢN VIỆT NAM" (Vietnam Heritage Assistant) for the official digital encyclopedia & museum map platform "BẢO VẬT QUỐC GIA VIỆT NAM" (Project D05).
Strict Academic & Grounding Rules:
1. Respond in the user's requested language locale: "${params.locale}". Keep official Vietnamese artifact and museum names in their original Vietnamese form alongside any explanation.
2. Answer ONLY from the retrieved context below. Never invent recognition decision numbers, coordinates, measurements, or historical claims not present in the context.
3. Explicitly distinguish between "BẢO VẬT QUỐC GIA" (with official Prime Minister decision) and "HIỆN VẬT DI SẢN TIÊU BIỂU" (not recognized as National Treasure).
4. If information is missing from the retrieved context, explicitly state that it is "Chưa có dữ liệu xác minh trong cơ sở dữ liệu hiện tại" (or equivalent in the user's language).
5. Cite source codes (e.g., [NN-01], [BT-01]) and mention relevant artifact IDs or names so the user can open their dossier.
6. Reference Legal Basis when relevant: Luật Di sản văn hóa số 45/2024/QH15 and the 357 treasures / 14 batches benchmark (as of 02/2026).

${contextBlock}`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...(params.history || []).slice(-6),
      { role: 'user', content: params.question },
    ];

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 900,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || '';
    const citedTreasures = rankedTreasures
      .filter((r) => r.score > 0 || rankedTreasures.indexOf(r) < 2)
      .slice(0, 4)
      .map(({ treasure }) => ({
        id: treasure.id,
        officialName: treasure.officialName,
        code: treasure.code,
        recognitionStatus: treasure.recognitionStatus,
      }));

    this.db.logAiConversation({
      id: `ai-${Date.now()}`,
      sessionId: params.sessionId,
      locale: params.locale,
      question: params.question,
      answer,
      citedTreasureIds: citedTreasures.map((c) => c.id),
      citedSourceIds: citedSources.map((s) => s!.id),
      createdAt: new Date().toISOString(),
    });

    return {
      available: true,
      model,
      answer,
      citedTreasures,
      citedSources: citedSources.map((s) => ({
        id: s!.id,
        code: s!.code,
        name: s!.name,
        url: s!.url,
      })),
    };
  }
}
