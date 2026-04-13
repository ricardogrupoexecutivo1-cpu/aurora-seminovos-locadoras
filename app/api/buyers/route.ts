import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BuyerRow = {
  id: string;
  nome: string | null;
  cpf: string | null;
  whatsapp: string | null;
  email: string | null;
  marca_desejada: string | null;
  modelo_desejado: string | null;
  ano_desejado: string | null;
  preco_minimo: number | null;
  preco_maximo: number | null;
  regiao: string | null;
  cidade: string | null;
  estado: string | null;
  vendedor_preferido: string | null;
  tipo_compra: string | null;
  percentual_abaixo_fipe_min: number | null;
  percentual_abaixo_fipe_max: number | null;
  receber_novos_veiculos: boolean | null;
  aceita_whatsapp: boolean | null;
  observacoes: string | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type BuyerApiItem = {
  id: string;
  nome?: string | null;
  cpf?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  marca_desejada?: string | null;
  modelo_desejado?: string | null;
  ano_desejado?: string | null;
  preco_minimo?: number | null;
  preco_maximo?: number | null;
  regiao?: string | null;
  cidade?: string | null;
  estado?: string | null;
  vendedor_preferido?: string | null;
  tipo_compra?: string | null;
  percentual_abaixo_fipe_min?: number | null;
  percentual_abaixo_fipe_max?: number | null;
  receber_novos_veiculos?: boolean | null;
  aceita_whatsapp?: boolean | null;
  observacoes?: string | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type RequestBody = Record<string, unknown>;

function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. A API de compradores precisa usar a service role."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getSupabaseProjectHint() {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

  return raw
    .replace("https://", "")
    .replace("http://", "")
    .replace(".supabase.co", "")
    .trim();
}

function getSupabaseKeyMode() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
    ? "service_role"
    : "missing_service_role";
}

function cleanString(value: unknown) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function cleanBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return fallback;
}

function cleanNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "string") {
    const normalized = value.replace(",", ".").trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function onlyDigits(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function mapRowToApiItem(row: BuyerRow): BuyerApiItem {
  return {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    whatsapp: row.whatsapp,
    email: row.email,
    marca_desejada: row.marca_desejada,
    modelo_desejado: row.modelo_desejado,
    ano_desejado: row.ano_desejado,
    preco_minimo: row.preco_minimo,
    preco_maximo: row.preco_maximo,
    regiao: row.regiao,
    cidade: row.cidade,
    estado: row.estado,
    vendedor_preferido: row.vendedor_preferido,
    tipo_compra: row.tipo_compra,
    percentual_abaixo_fipe_min: row.percentual_abaixo_fipe_min,
    percentual_abaixo_fipe_max: row.percentual_abaixo_fipe_max,
    receber_novos_veiculos: row.receber_novos_veiculos,
    aceita_whatsapp: row.aceita_whatsapp,
    observacoes: row.observacoes,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizePayload(body: RequestBody) {
  return {
    nome: cleanString(body.nome),
    cpf: onlyDigits(cleanString(body.cpf)),
    whatsapp: onlyDigits(cleanString(body.whatsapp)),
    email: cleanString(body.email),
    marca_desejada: cleanString(body.marca_desejada ?? body.marcaDesejada),
    modelo_desejado: cleanString(body.modelo_desejado ?? body.modeloDesejado),
    ano_desejado: cleanString(body.ano_desejado ?? body.anoDesejado),
    preco_minimo: cleanNumber(body.preco_minimo ?? body.precoMinimo),
    preco_maximo: cleanNumber(body.preco_maximo ?? body.precoMaximo),
    regiao: cleanString(body.regiao),
    cidade: cleanString(body.cidade ?? body.city),
    estado: cleanString(body.estado ?? body.state),
    vendedor_preferido: cleanString(
      body.vendedor_preferido ?? body.vendedorPreferido
    ),
    tipo_compra: cleanString(body.tipo_compra ?? body.tipoCompra),
    percentual_abaixo_fipe_min: cleanNumber(
      body.percentual_abaixo_fipe_min ?? body.percentualAbaixoFipeMin
    ),
    percentual_abaixo_fipe_max: cleanNumber(
      body.percentual_abaixo_fipe_max ?? body.percentualAbaixoFipeMax
    ),
    receber_novos_veiculos: cleanBoolean(
      body.receber_novos_veiculos ?? body.receberNovosVeiculos,
      true
    ),
    aceita_whatsapp: cleanBoolean(
      body.aceita_whatsapp ?? body.aceitaWhatsapp,
      true
    ),
    observacoes: cleanString(body.observacoes ?? body.notes),
    active: cleanBoolean(body.active, true),
  };
}

const baseSelect = `
  id,
  nome,
  cpf,
  whatsapp,
  email,
  marca_desejada,
  modelo_desejado,
  ano_desejado,
  preco_minimo,
  preco_maximo,
  regiao,
  cidade,
  estado,
  vendedor_preferido,
  tipo_compra,
  percentual_abaixo_fipe_min,
  percentual_abaixo_fipe_max,
  receber_novos_veiculos,
  aceita_whatsapp,
  observacoes,
  active,
  created_at,
  updated_at
`;

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const projectHint = getSupabaseProjectHint();
    const keyMode = getSupabaseKeyMode();

    const { count, error: countError } = await supabase
      .from("sl_buyers")
      .select("*", { count: "exact", head: true });

    const { data, error } = await supabase
      .from("sl_buyers")
      .select("*")
      .order("created_at", { ascending: false });

    if (countError) {
      console.error("Erro ao contar compradores:", countError);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao contar compradores.",
          error: countError.message,
          details: countError.details ?? null,
          hint: countError.hint ?? null,
          code: countError.code ?? null,
          buyers: [],
          total: 0,
          debug_supabase_project: projectHint,
          debug_key_mode: keyMode,
        },
        { status: 500 }
      );
    }

    if (error) {
      console.error("Erro ao listar compradores:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao listar compradores.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
          buyers: [],
          total: 0,
          debug_supabase_project: projectHint,
          debug_key_mode: keyMode,
          debug_count_exact: count ?? 0,
        },
        { status: 500 }
      );
    }

    console.log("BUYERS RAW GET:", data);
    console.log("BUYERS COUNT EXACT:", count);
    console.log("BUYERS SUPABASE PROJECT:", projectHint);
    console.log("BUYERS KEY MODE:", keyMode);

    const buyers = Array.isArray(data)
      ? (data as BuyerRow[]).map(mapRowToApiItem)
      : [];

    return NextResponse.json(
      {
        success: true,
        message: "Compradores listados com sucesso.",
        buyers,
        total: buyers.length,
        debug_supabase_project: projectHint,
        debug_key_mode: keyMode,
        debug_count_exact: count ?? 0,
        debug_first_raw_row: Array.isArray(data) && data.length > 0 ? data[0] : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno ao listar compradores:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao listar compradores.";

    return NextResponse.json(
      {
        success: false,
        message,
        buyers: [],
        total: 0,
        debug_supabase_project: getSupabaseProjectHint(),
        debug_key_mode: getSupabaseKeyMode(),
        debug_count_exact: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const supabase = getSupabaseServerClient();
    const payload = normalizePayload(body);

    if (!payload.nome) {
      return NextResponse.json(
        {
          success: false,
          message: "Nome do comprador é obrigatório.",
        },
        { status: 400 }
      );
    }

    console.log("Payload comprador POST:", payload);

    const insertPayload = {
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("sl_buyers")
      .insert(insertPayload)
      .select(baseSelect)
      .single();

    if (error) {
      console.error("Erro Supabase ao salvar comprador:", error);
      console.error("Payload enviado para sl_buyers:", insertPayload);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao salvar comprador.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    const buyer = mapRowToApiItem(data as BuyerRow);

    return NextResponse.json(
      {
        success: true,
        message: "Comprador salvo com sucesso.",
        buyer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro geral POST buyer:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao salvar comprador.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const id = cleanString(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do comprador é obrigatório para atualizar.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const payload = normalizePayload(body);

    console.log("Payload comprador PUT:", { id, ...payload });

    const { data, error } = await supabase
      .from("sl_buyers")
      .update(payload)
      .eq("id", id)
      .select(baseSelect)
      .single();

    if (error) {
      console.error("Erro Supabase ao atualizar comprador:", error);
      console.error("Payload enviado para update de sl_buyers:", {
        id,
        ...payload,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao atualizar comprador.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    const buyer = mapRowToApiItem(data as BuyerRow);

    return NextResponse.json(
      {
        success: true,
        message: "Comprador atualizado com sucesso.",
        buyer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno ao atualizar comprador:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar comprador.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}