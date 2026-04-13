import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CompanyRow = {
  id: string;
  slug: string | null;
  company_type: string | null;
  cnpj: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  responsavel: string | null;
  cpf_responsavel: string | null;
  whatsapp: string | null;
  email_principal: string | null;
  email_secundario_1: string | null;
  email_secundario_2: string | null;
  email_secundario_3: string | null;
  email_secundario_4: string | null;
  email_secundario_5: string | null;
  site: string | null;
  cidade: string | null;
  estado: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cep: string | null;
  descricao_publica: string | null;
  aceita_contato_whatsapp: boolean | null;
  recebe_leads: boolean | null;
  possui_contrato_modelo: boolean | null;
  logo_file_name: string | null;
  contract_file_name: string | null;
  observacoes: string | null;
  maintenance_fee_monthly: number | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type CompanyApiItem = {
  id: string;
  slug?: string | null;
  company_type?: string | null;
  cnpj?: string | null;
  corporate_name?: string | null;
  trade_name?: string | null;
  state_registration?: string | null;
  commercial_contact_name?: string | null;
  commercial_contact_cpf?: string | null;
  commercial_whatsapp?: string | null;
  primary_email?: string | null;
  secondary_email_1?: string | null;
  secondary_email_2?: string | null;
  secondary_email_3?: string | null;
  secondary_email_4?: string | null;
  secondary_email_5?: string | null;
  website?: string | null;
  instagram?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  address_number?: string | null;
  neighborhood?: string | null;
  zip_code?: string | null;
  public_description?: string | null;
  accepts_whatsapp_contact?: boolean | null;
  receives_leads?: boolean | null;
  has_contract_template?: boolean | null;
  logo_file_name?: string | null;
  contract_file_name?: string | null;
  notes?: string | null;
  maintenance_fee_monthly?: number | null;
  active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type RequestBody = Record<string, unknown>;

type DuplicateCheckRow = {
  id: string;
  cnpj: string | null;
  nome_fantasia: string | null;
  razao_social: string | null;
};

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "aurora-images";

function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não configurada.");
  }

  if (!supabaseKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
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

function cleanNumber(value: unknown, fallback = 49.9) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function onlyDigits(value: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

function firstWhatsapp(value: string | null) {
  if (!value) return null;

  const parts = value
    .split(/[\/|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const first = parts[0] ?? value;
  return onlyDigits(first);
}

function slugifyPart(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function buildCompanySlugFromValues(values: {
  id: string;
  trade_name?: string | null;
  corporate_name?: string | null;
  primary_email?: string | null;
  cnpj?: string | null;
  city?: string | null;
  state?: string | null;
}) {
  const name = slugifyPart(
    values.trade_name ||
      values.corporate_name ||
      values.primary_email ||
      values.cnpj ||
      "empresa"
  );

  const city = slugifyPart(values.city);
  const state = slugifyPart(values.state);
  const shortId = (values.id || "").split("-")[0] || "empresa";

  return [name, city, state, shortId].filter(Boolean).join("-");
}

function mapRowToApiItem(row: CompanyRow): CompanyApiItem {
  return {
    id: row.id,
    slug: row.slug,
    company_type: row.company_type,
    cnpj: row.cnpj,
    corporate_name: row.razao_social,
    trade_name: row.nome_fantasia,
    state_registration: row.inscricao_estadual,
    commercial_contact_name: row.responsavel,
    commercial_contact_cpf: row.cpf_responsavel,
    commercial_whatsapp: row.whatsapp,
    primary_email: row.email_principal,
    secondary_email_1: row.email_secundario_1,
    secondary_email_2: row.email_secundario_2,
    secondary_email_3: row.email_secundario_3,
    secondary_email_4: row.email_secundario_4,
    secondary_email_5: row.email_secundario_5,
    website: row.site,
    instagram: null,
    city: row.cidade,
    state: row.estado,
    address: row.endereco,
    address_number: row.numero,
    neighborhood: row.bairro,
    zip_code: row.cep,
    public_description: row.descricao_publica,
    accepts_whatsapp_contact: row.aceita_contato_whatsapp,
    receives_leads: row.recebe_leads,
    has_contract_template: row.possui_contrato_modelo,
    logo_file_name: row.logo_file_name,
    contract_file_name: row.contract_file_name,
    notes: row.observacoes,
    maintenance_fee_monthly: row.maintenance_fee_monthly,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizePayload(body: RequestBody, forcedId?: string) {
  const normalized = {
    company_type: cleanString(body.company_type ?? body.companyType),
    cnpj: onlyDigits(cleanString(body.cnpj)),
    razao_social: cleanString(
      body.corporate_name ??
        body.corporateName ??
        body.razao_social ??
        body.razaoSocial
    ),
    nome_fantasia: cleanString(
      body.trade_name ??
        body.tradeName ??
        body.nome_fantasia ??
        body.nomeFantasia
    ),
    inscricao_estadual: cleanString(
      body.state_registration ??
        body.stateRegistration ??
        body.inscricao_estadual ??
        body.inscricaoEstadual
    ),
    responsavel: cleanString(
      body.commercial_contact_name ??
        body.commercialContactName ??
        body.responsavel
    ),
    cpf_responsavel: onlyDigits(
      cleanString(
        body.commercial_contact_cpf ??
          body.commercialContactCpf ??
          body.cpf_responsavel ??
          body.cpfResponsavel
      )
    ),
    whatsapp: firstWhatsapp(
      cleanString(
        body.commercial_whatsapp ??
          body.commercialWhatsapp ??
          body.whatsapp
      )
    ),
    email_principal: cleanString(
      body.primary_email ??
        body.primaryEmail ??
        body.email_principal ??
        body.emailPrincipal
    ),
    email_secundario_1: cleanString(
      body.secondary_email_1 ??
        body.secondaryEmail1 ??
        body.email_secundario_1 ??
        body.emailSecundario1
    ),
    email_secundario_2: cleanString(
      body.secondary_email_2 ??
        body.secondaryEmail2 ??
        body.email_secundario_2 ??
        body.emailSecundario2
    ),
    email_secundario_3: cleanString(
      body.secondary_email_3 ??
        body.secondaryEmail3 ??
        body.email_secundario_3 ??
        body.emailSecundario3
    ),
    email_secundario_4: cleanString(
      body.secondary_email_4 ??
        body.secondaryEmail4 ??
        body.email_secundario_4 ??
        body.emailSecundario4
    ),
    email_secundario_5: cleanString(
      body.secondary_email_5 ??
        body.secondaryEmail5 ??
        body.email_secundario_5 ??
        body.emailSecundario5
    ),
    site: cleanString(body.website ?? body.site),
    cidade: cleanString(body.city ?? body.cidade),
    estado: cleanString(body.state ?? body.estado),
    endereco: cleanString(body.address ?? body.endereco),
    numero: cleanString(
      body.address_number ?? body.addressNumber ?? body.numero
    ),
    bairro: cleanString(body.neighborhood ?? body.bairro),
    cep: onlyDigits(cleanString(body.zip_code ?? body.zipCode ?? body.cep)),
    descricao_publica: cleanString(
      body.public_description ??
        body.publicDescription ??
        body.descricao_publica ??
        body.descricaoPublica
    ),
    aceita_contato_whatsapp: cleanBoolean(
      body.accepts_whatsapp_contact ??
        body.acceptsWhatsappContact ??
        body.aceita_contato_whatsapp ??
        body.aceitaContatoWhatsapp,
      true
    ),
    recebe_leads: cleanBoolean(
      body.receives_leads ?? body.recebe_leads ?? body.recebeLeads,
      true
    ),
    possui_contrato_modelo: cleanBoolean(
      body.has_contract_template ??
        body.hasContractTemplate ??
        body.possui_contrato_modelo ??
        body.possuiContratoModelo,
      false
    ),
    logo_file_name: cleanString(body.logo_file_name ?? body.logoFileName),
    contract_file_name: cleanString(
      body.contract_file_name ?? body.contractFileName
    ),
    observacoes: cleanString(body.notes ?? body.observacoes),
    maintenance_fee_monthly: cleanNumber(
      body.maintenance_fee_monthly ?? body.maintenanceFeeMonthly,
      49.9
    ),
    active: cleanBoolean(body.active, true),
  };

  const slugFromBody = cleanString(body.slug);

  const effectiveId =
    forcedId || cleanString(body.id) || crypto.randomUUID();

  const slug =
    slugFromBody ||
    buildCompanySlugFromValues({
      id: effectiveId,
      trade_name: normalized.nome_fantasia,
      corporate_name: normalized.razao_social,
      primary_email: normalized.email_principal,
      cnpj: normalized.cnpj,
      city: normalized.cidade,
      state: normalized.estado,
    });

  return {
    ...normalized,
    slug,
  };
}

const baseSelect = `
  id,
  slug,
  company_type,
  cnpj,
  razao_social,
  nome_fantasia,
  inscricao_estadual,
  responsavel,
  cpf_responsavel,
  whatsapp,
  email_principal,
  email_secundario_1,
  email_secundario_2,
  email_secundario_3,
  email_secundario_4,
  email_secundario_5,
  site,
  cidade,
  estado,
  endereco,
  numero,
  bairro,
  cep,
  descricao_publica,
  aceita_contato_whatsapp,
  recebe_leads,
  possui_contrato_modelo,
  logo_file_name,
  contract_file_name,
  observacoes,
  maintenance_fee_monthly,
  active,
  created_at,
  updated_at
`;

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("sl_companies")
      .select(baseSelect)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar empresas:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao listar empresas.",
          error: error.message,
          companies: [],
          total: 0,
        },
        { status: 500 }
      );
    }

    const companies = Array.isArray(data)
      ? (data as CompanyRow[]).map(mapRowToApiItem)
      : [];

    return NextResponse.json(
      {
        success: true,
        message: "Empresas listadas com sucesso.",
        companies,
        total: companies.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno ao listar empresas:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno ao listar empresas.";

    return NextResponse.json(
      {
        success: false,
        message,
        companies: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const supabase = getSupabaseServerClient();

    const id = crypto.randomUUID();
    const payload = normalizePayload(body, id);

    if (!payload.cnpj) {
      return NextResponse.json(
        {
          success: false,
          message: "CNPJ é obrigatório para cadastrar a empresa.",
        },
        { status: 400 }
      );
    }

    const { data: existingCompanies, error: duplicateError } = await supabase
      .from("sl_companies")
      .select("id, cnpj, nome_fantasia, razao_social")
      .eq("cnpj", payload.cnpj)
      .limit(1);

    if (duplicateError) {
      console.error("Erro ao validar duplicidade por CNPJ:", duplicateError);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao validar duplicidade da empresa.",
          error: duplicateError.message,
          details: duplicateError.details ?? null,
          hint: duplicateError.hint ?? null,
          code: duplicateError.code ?? null,
        },
        { status: 500 }
      );
    }

    const existingCompany = Array.isArray(existingCompanies)
      ? (existingCompanies[0] as DuplicateCheckRow | undefined)
      : undefined;

    if (existingCompany) {
      const existingName =
        existingCompany.nome_fantasia ||
        existingCompany.razao_social ||
        "empresa já cadastrada";

      return NextResponse.json(
        {
          success: false,
          message: `Já existe uma empresa cadastrada com este CNPJ: ${existingName}.`,
          error: "duplicate_cnpj",
          company_id: existingCompany.id,
        },
        { status: 409 }
      );
    }

    const insertPayload = {
      id,
      ...payload,
    };

    const { data, error } = await supabase
      .from("sl_companies")
      .insert(insertPayload)
      .select(baseSelect)
      .single();

    if (error) {
      console.error("Erro Supabase ao salvar empresa:", error);
      console.error("Payload enviado para sl_companies:", insertPayload);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao salvar empresa.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    const company = mapRowToApiItem(data as CompanyRow);

    return NextResponse.json(
      {
        success: true,
        message: "Empresa salva com sucesso.",
        company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro interno ao salvar empresa:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno ao salvar empresa.";

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
          message: "ID da empresa é obrigatório para atualizar.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const payload = normalizePayload(body, id);

    if (payload.cnpj) {
      const { data: duplicateCompanies, error: duplicateError } = await supabase
        .from("sl_companies")
        .select("id, cnpj, nome_fantasia, razao_social")
        .eq("cnpj", payload.cnpj)
        .neq("id", id)
        .limit(1);

      if (duplicateError) {
        console.error("Erro ao validar duplicidade no update:", duplicateError);

        return NextResponse.json(
          {
            success: false,
            message: "Erro ao validar duplicidade da empresa.",
            error: duplicateError.message,
            details: duplicateError.details ?? null,
            hint: duplicateError.hint ?? null,
            code: duplicateError.code ?? null,
          },
          { status: 500 }
        );
      }

      const duplicateCompany = Array.isArray(duplicateCompanies)
        ? (duplicateCompanies[0] as DuplicateCheckRow | undefined)
        : undefined;

      if (duplicateCompany) {
        const duplicateName =
          duplicateCompany.nome_fantasia ||
          duplicateCompany.razao_social ||
          "empresa já cadastrada";

        return NextResponse.json(
          {
            success: false,
            message: `Já existe outra empresa cadastrada com este CNPJ: ${duplicateName}.`,
            error: "duplicate_cnpj",
            company_id: duplicateCompany.id,
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("sl_companies")
      .update(payload)
      .eq("id", id)
      .select(baseSelect)
      .single();

    if (error) {
      console.error("Erro Supabase ao atualizar empresa:", error);
      console.error("Payload enviado para update de sl_companies:", {
        id,
        ...payload,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao atualizar empresa.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    const company = mapRowToApiItem(data as CompanyRow);

    return NextResponse.json(
      {
        success: true,
        message: "Empresa atualizada com sucesso.",
        company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno ao atualizar empresa:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar empresa.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const id = cleanString(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID da empresa é obrigatório para excluir.",
        },
        { status: 400 }
      );
    }

    const { data: existingCompanies, error: findError } = await supabase
      .from("sl_companies")
      .select("id, logo_file_name")
      .eq("id", id)
      .limit(1);

    if (findError) {
      console.error("Erro ao localizar empresa para exclusão:", findError);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao localizar empresa para exclusão.",
          error: findError.message,
        },
        { status: 500 }
      );
    }

    const existingCompany = Array.isArray(existingCompanies)
      ? (existingCompanies[0] as {
          id: string;
          logo_file_name: string | null;
        } | undefined)
      : undefined;

    if (!existingCompany) {
      return NextResponse.json(
        {
          success: false,
          message: "Empresa não encontrada para exclusão.",
        },
        { status: 404 }
      );
    }

    if (existingCompany.logo_file_name) {
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([existingCompany.logo_file_name]);

      if (storageError) {
        console.error(
          "Aviso ao excluir logomarca do Storage:",
          storageError.message
        );
      }
    }

    const { error: deleteError } = await supabase
      .from("sl_companies")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Erro ao excluir empresa:", deleteError);

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao excluir empresa.",
          error: deleteError.message,
          details: deleteError.details ?? null,
          hint: deleteError.hint ?? null,
          code: deleteError.code ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Empresa excluída com sucesso.",
        id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno ao excluir empresa:", error);

    const message =
      error instanceof Error ? error.message : "Erro interno ao excluir empresa.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}