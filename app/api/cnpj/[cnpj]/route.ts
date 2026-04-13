import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BrasilApiCnpjResponse = {
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string | null;
  descricao_situacao_cadastral?: string | null;
  descricao_tipo_de_logradouro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  municipio?: string | null;
  uf?: string | null;
  ddd_telefone_1?: string | null;
  ddd_telefone_2?: string | null;
  email?: string | null;
  porte?: string | null;
  natureza_juridica?: string | null;
  cnae_fiscal_descricao?: string | null;
};

type ReceitaWsResponse = {
  status?: string;
  message?: string;
  cnpj?: string;
  nome?: string;
  fantasia?: string;
  situacao?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  telefone?: string;
  email?: string;
  porte?: string;
  natureza_juridica?: string;
  atividade_principal?: Array<{ text?: string }>;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizePhone(value?: string | null) {
  return (value || "").trim() || null;
}

function buildPublicDescription(parts: Array<string | null | undefined>) {
  const filtered = parts.map((item) => (item || "").trim()).filter(Boolean);
  return filtered.length > 0 ? filtered.join(" • ") : null;
}

function mapBrasilApiToForm(data: BrasilApiCnpjResponse) {
  const phone = data.ddd_telefone_1 || data.ddd_telefone_2 || null;
  const address =
    [data.descricao_tipo_de_logradouro, data.logradouro]
      .filter(Boolean)
      .join(" ")
      .trim() || null;

  return {
    cnpj: data.cnpj || null,
    corporate_name: data.razao_social || null,
    trade_name: data.nome_fantasia || data.razao_social || null,
    primary_email: data.email || null,
    commercial_whatsapp: normalizePhone(phone),
    city: data.municipio || null,
    state: data.uf || null,
    address,
    address_number: data.numero || null,
    neighborhood: data.bairro || null,
    zip_code: data.cep || null,
    public_description: buildPublicDescription([
      data.razao_social || data.nome_fantasia || null,
      data.cnae_fiscal_descricao || null,
      data.municipio && data.uf ? `${data.municipio} - ${data.uf}` : null,
    ]),
    source_status: data.descricao_situacao_cadastral || null,
    company_nature: data.natureza_juridica || null,
    company_size: data.porte || null,
    main_activity: data.cnae_fiscal_descricao || null,
  };
}

function mapReceitaWsToForm(data: ReceitaWsResponse) {
  const mainActivity = data.atividade_principal?.[0]?.text || null;

  return {
    cnpj: data.cnpj || null,
    corporate_name: data.nome || null,
    trade_name: data.fantasia || data.nome || null,
    primary_email: data.email || null,
    commercial_whatsapp: normalizePhone(data.telefone),
    city: data.municipio || null,
    state: data.uf || null,
    address: data.logradouro || null,
    address_number: data.numero || null,
    neighborhood: data.bairro || null,
    zip_code: data.cep || null,
    public_description: buildPublicDescription([
      data.nome || data.fantasia || null,
      mainActivity,
      data.municipio && data.uf ? `${data.municipio} - ${data.uf}` : null,
    ]),
    source_status: data.situacao || null,
    company_nature: data.natureza_juridica || null,
    company_size: data.porte || null,
    main_activity: mainActivity,
  };
}

async function tryBrasilApi(cnpj: string) {
  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const rawText = await response.text();
  let parsed: BrasilApiCnpjResponse | { message?: string } | null = null;

  if (rawText.trim()) {
    try {
      parsed = JSON.parse(rawText) as BrasilApiCnpjResponse | { message?: string };
    } catch {
      return {
        ok: false as const,
        provider: "BrasilAPI",
        status: 502,
        message: "BrasilAPI respondeu em formato inesperado.",
        raw: rawText.slice(0, 300),
      };
    }
  }

  if (!response.ok) {
    const message =
      parsed && "message" in parsed && parsed.message
        ? parsed.message
        : "BrasilAPI não conseguiu retornar os dados do CNPJ.";
    return {
      ok: false as const,
      provider: "BrasilAPI",
      status: response.status,
      message,
      raw: rawText.slice(0, 300),
    };
  }

  return {
    ok: true as const,
    provider: "BrasilAPI",
    status: 200,
    raw: parsed as BrasilApiCnpjResponse,
    data: mapBrasilApiToForm(parsed as BrasilApiCnpjResponse),
  };
}

async function tryReceitaWs(cnpj: string) {
  const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const rawText = await response.text();
  let parsed: ReceitaWsResponse | null = null;

  if (rawText.trim()) {
    try {
      parsed = JSON.parse(rawText) as ReceitaWsResponse;
    } catch {
      return {
        ok: false as const,
        provider: "ReceitaWS",
        status: 502,
        message: "ReceitaWS respondeu em formato inesperado.",
        raw: rawText.slice(0, 300),
      };
    }
  }

  if (!response.ok) {
    return {
      ok: false as const,
      provider: "ReceitaWS",
      status: response.status,
      message: parsed?.message || "ReceitaWS não conseguiu retornar os dados do CNPJ.",
      raw: rawText.slice(0, 300),
    };
  }

  if (parsed?.status && parsed.status.toUpperCase() === "ERROR") {
    return {
      ok: false as const,
      provider: "ReceitaWS",
      status: 404,
      message: parsed.message || "ReceitaWS não encontrou dados para este CNPJ.",
      raw: rawText.slice(0, 300),
    };
  }

  return {
    ok: true as const,
    provider: "ReceitaWS",
    status: 200,
    raw: parsed as ReceitaWsResponse,
    data: mapReceitaWsToForm(parsed as ReceitaWsResponse),
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ cnpj: string }> }
) {
  try {
    const { cnpj } = await context.params;
    const normalizedCnpj = onlyDigits(cnpj || "");

    if (normalizedCnpj.length !== 14) {
      return NextResponse.json(
        {
          success: false,
          message: "Informe um CNPJ válido com 14 dígitos.",
        },
        { status: 400 }
      );
    }

    const brasilApiResult = await tryBrasilApi(normalizedCnpj);

    if (brasilApiResult.ok) {
      return NextResponse.json(
        {
          success: true,
          message: "CNPJ consultado com sucesso.",
          cnpj: normalizedCnpj,
          source: brasilApiResult.provider,
          data: brasilApiResult.data,
          raw: brasilApiResult.raw,
        },
        { status: 200 }
      );
    }

    const receitaWsResult = await tryReceitaWs(normalizedCnpj);

    if (receitaWsResult.ok) {
      return NextResponse.json(
        {
          success: true,
          message: "CNPJ consultado com sucesso.",
          cnpj: normalizedCnpj,
          source: receitaWsResult.provider,
          data: receitaWsResult.data,
          raw: receitaWsResult.raw,
          fallback_from: brasilApiResult.provider,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Não foi possível consultar o CNPJ nas fontes externas.",
        attempts: [
          {
            source: brasilApiResult.provider,
            status: brasilApiResult.status,
            message: brasilApiResult.message,
          },
          {
            source: receitaWsResult.provider,
            status: receitaWsResult.status,
            message: receitaWsResult.message,
          },
        ],
      },
      { status: 502 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao consultar CNPJ.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}