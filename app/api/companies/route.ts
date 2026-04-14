import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function onlyDigits(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(String(value || "").trim());
}

function jsonError(
  message: string,
  status = 400,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(extra || {}),
    },
    { status }
  );
}

function getAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function buildSlugFromName(name: string, city: string, state: string, id: string) {
  const base = `${name || "empresa"} ${city || ""} ${state || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

  const shortId = String(id || "").slice(0, 8);
  return `${base || "empresa"}-${shortId}`.replace(/--+/g, "-");
}

function normalizeRow(row: Record<string, any>) {
  const id = row?.id ?? null;

  const cnpj = row?.cnpj ?? "";
  const corporate_name = row?.razao_social ?? "";
  const trade_name = row?.nome_fantasia ?? "";
  const state_registration = row?.inscricao_estadual ?? "";
  const commercial_contact_name = row?.responsavel ?? "";
  const commercial_contact_cpf = row?.cpf_responsavel ?? "";
  const commercial_whatsapp = row?.whatsapp ?? "";
  const primary_email = row?.email_principal ?? "";

  const city = row?.cidade ?? "";
  const state = row?.estado ?? "";
  const address = row?.endereco ?? "";
  const address_number = row?.numero ?? "";
  const neighborhood = row?.bairro ?? "";
  const zip_code = row?.cep ?? "";

  const public_description = row?.descricao_publica ?? "";
  const notes = row?.observacoes ?? "";
  const website = row?.site ?? "";
  const logo_file_name = row?.logo_file_name ?? "";
  const contract_file_name = row?.contract_file_name ?? "";

  const accepts_whatsapp_contact = row?.aceita_contato_whatsapp ?? false;
  const receives_leads = row?.recebe_leads ?? false;
  const has_contract_template = row?.possui_contrato_modelo ?? false;
  const maintenance_fee_monthly = row?.maintenance_fee_monthly ?? null;
  const active = row?.active ?? true;
  const company_type = row?.company_type ?? "locadora";

  const slug =
    row?.slug ||
    buildSlugFromName(
      trade_name || corporate_name,
      city,
      state,
      String(id || "")
    );

  return {
    id,
    cnpj,
    corporate_name,
    trade_name,
    state_registration,
    commercial_contact_name,
    commercial_contact_cpf,
    commercial_whatsapp,
    primary_email,
    secondary_email_1: row?.email_secundario_1 ?? "",
    secondary_email_2: row?.email_secundario_2 ?? "",
    secondary_email_3: row?.email_secundario_3 ?? "",
    secondary_email_4: row?.email_secundario_4 ?? "",
    secondary_email_5: row?.email_secundario_5 ?? "",
    website,
    city,
    state,
    address,
    address_number,
    neighborhood,
    zip_code,
    public_description,
    notes,
    logo_file_name,
    contract_file_name,
    accepts_whatsapp_contact,
    receives_leads,
    has_contract_template,
    maintenance_fee_monthly,
    active,
    company_type,
    slug,
    created_at: row?.created_at ?? null,
    updated_at: row?.updated_at ?? null,
    raw: row,
  };
}

function buildHaystack(item: Record<string, any>) {
  return Object.values(item)
    .flatMap((value) => {
      if (value === null || value === undefined) {
        return [];
      }

      if (typeof value === "object") {
        try {
          return [JSON.stringify(value)];
        } catch {
          return [String(value)];
        }
      }

      return [String(value)];
    })
    .join(" ")
    .toLowerCase();
}

function buildCompanyLinks(company: Record<string, any>) {
  const normalized = normalizeRow(company);
  const id = normalized.id ? String(normalized.id) : "";
  const slug = normalized.slug ? String(normalized.slug) : "";

  return {
    edit_url: id ? `/seminovos-locadoras/empresas/${id}/editar` : "",
    view_url: slug ? `/empresa/${slug}` : "",
    internal_view_url: slug ? `/seminovos-locadoras/empresa/${slug}` : "",
  };
}

function extractSavePayload(body: any, sessionEmail?: string) {
  const cnpj = onlyDigits(body?.cnpj);

  const corporate_name = String(
    body?.corporate_name ?? body?.razao_social ?? ""
  ).trim();

  const trade_name = String(
    body?.trade_name ?? body?.nome_fantasia ?? ""
  ).trim();

  const state_registration = String(
    body?.state_registration ?? body?.inscricao_estadual ?? ""
  ).trim();

  const commercial_contact_name = String(
    body?.commercial_contact_name ?? body?.responsavel ?? ""
  ).trim();

  const commercial_contact_cpf = onlyDigits(
    body?.commercial_contact_cpf ?? body?.cpf_responsavel ?? ""
  );

  const commercial_whatsapp = onlyDigits(
    body?.commercial_whatsapp ?? body?.whatsapp ?? ""
  );

  const primary_email = String(
    body?.primary_email ?? body?.email_principal ?? ""
  )
    .trim()
    .toLowerCase();

  const secondary_email_1 = String(
    body?.secondary_email_1 ?? body?.email_secundario_1 ?? ""
  )
    .trim()
    .toLowerCase();

  const secondary_email_2 = String(
    body?.secondary_email_2 ?? body?.email_secundario_2 ?? ""
  )
    .trim()
    .toLowerCase();

  const secondary_email_3 = String(
    body?.secondary_email_3 ?? body?.email_secundario_3 ?? ""
  )
    .trim()
    .toLowerCase();

  const secondary_email_4 = String(
    body?.secondary_email_4 ?? body?.email_secundario_4 ?? ""
  )
    .trim()
    .toLowerCase();

  const secondary_email_5 = String(
    body?.secondary_email_5 ?? body?.email_secundario_5 ?? ""
  )
    .trim()
    .toLowerCase();

  const website = String(body?.website ?? body?.site ?? "").trim();
  const city = String(body?.city ?? body?.cidade ?? "").trim();
  const state = String(body?.state ?? body?.estado ?? "").trim().toUpperCase();
  const address = String(body?.address ?? body?.endereco ?? "").trim();
  const address_number = String(
    body?.address_number ?? body?.numero ?? ""
  ).trim();
  const neighborhood = String(
    body?.neighborhood ?? body?.bairro ?? ""
  ).trim();
  const zip_code = onlyDigits(body?.zip_code ?? body?.cep ?? "");
  const public_description = String(
    body?.public_description ?? body?.descricao_publica ?? ""
  ).trim();
  const notes = String(
    body?.notes ?? body?.observacoes ?? ""
  ).trim();

  const logo_file_name = String(body?.logo_file_name ?? "").trim();
  const contract_file_name = String(body?.contract_file_name ?? "").trim();

  const accepts_whatsapp_contact = Boolean(
    body?.accepts_whatsapp_contact ?? body?.aceita_contato_whatsapp ?? false
  );

  const receives_leads = Boolean(
    body?.receives_leads ?? body?.recebe_leads ?? false
  );

  const has_contract_template = Boolean(
    body?.has_contract_template ?? body?.possui_contrato_modelo ?? false
  );

  const maintenance_fee_monthly =
    body?.maintenance_fee_monthly !== undefined &&
    body?.maintenance_fee_monthly !== null &&
    String(body.maintenance_fee_monthly).trim() !== ""
      ? Number(body.maintenance_fee_monthly)
      : null;

  const active =
    body?.active !== undefined ? Boolean(body.active) : true;

  const company_type = String(
    body?.company_type ?? "locadora"
  ).trim().toLowerCase();

  const accepted_terms = Boolean(body?.accepted_terms ?? false);
  const accepted_at = body?.accepted_at
    ? String(body.accepted_at)
    : new Date().toISOString();
  const accepted_name = String(body?.accepted_name ?? "").trim();
  const accepted_document = onlyDigits(body?.accepted_document ?? "");
  const accepted_term_version = String(
    body?.accepted_term_version || "v1_comissao_plataforma"
  ).trim();

  const slugInput = String(body?.slug ?? "").trim();

  return {
    cnpj,
    corporate_name,
    trade_name,
    state_registration,
    commercial_contact_name,
    commercial_contact_cpf: commercial_contact_cpf || null,
    commercial_whatsapp,
    primary_email,
    secondary_email_1: secondary_email_1 || null,
    secondary_email_2: secondary_email_2 || null,
    secondary_email_3: secondary_email_3 || null,
    secondary_email_4: secondary_email_4 || null,
    secondary_email_5: secondary_email_5 || null,
    website: website || null,
    city,
    state,
    address: address || null,
    address_number: address_number || null,
    neighborhood: neighborhood || null,
    zip_code: zip_code || null,
    public_description: public_description || null,
    notes: notes || null,
    logo_file_name: logo_file_name || null,
    contract_file_name: contract_file_name || null,
    accepts_whatsapp_contact,
    receives_leads,
    has_contract_template,
    maintenance_fee_monthly:
      maintenance_fee_monthly !== null && !Number.isNaN(maintenance_fee_monthly)
        ? maintenance_fee_monthly
        : null,
    active,
    company_type,
    slugInput,
    accepted_terms,
    accepted_at,
    accepted_name,
    accepted_document,
    accepted_term_version,
    session_email: sessionEmail ? sessionEmail.toLowerCase() : null,
  };
}

function buildUpdatePayloadForExisting(
  payload: ReturnType<typeof extractSavePayload>,
  id: string
) {
  const generatedSlug = payload.slugInput
    ? payload.slugInput
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/--+/g, "-")
    : buildSlugFromName(
        payload.trade_name || payload.corporate_name,
        payload.city,
        payload.state,
        id
      );

  return {
    cnpj: payload.cnpj,
    company_type: payload.company_type,
    razao_social: payload.corporate_name || null,
    nome_fantasia: payload.trade_name || null,
    inscricao_estadual: payload.state_registration || null,
    responsavel: payload.commercial_contact_name || null,
    cpf_responsavel: payload.commercial_contact_cpf,
    whatsapp: payload.commercial_whatsapp || null,
    email_principal: payload.primary_email || null,
    email_secundario_1: payload.secondary_email_1,
    email_secundario_2: payload.secondary_email_2,
    email_secundario_3: payload.secondary_email_3,
    email_secundario_4: payload.secondary_email_4,
    email_secundario_5: payload.secondary_email_5,
    site: payload.website,
    cidade: payload.city,
    estado: payload.state,
    endereco: payload.address,
    numero: payload.address_number,
    bairro: payload.neighborhood,
    cep: payload.zip_code,
    descricao_publica: payload.public_description,
    aceita_contato_whatsapp: payload.accepts_whatsapp_contact,
    recebe_leads: payload.receives_leads,
    possui_contrato_modelo: payload.has_contract_template,
    logo_file_name: payload.logo_file_name,
    contract_file_name: payload.contract_file_name,
    observacoes: payload.notes,
    maintenance_fee_monthly: payload.maintenance_fee_monthly,
    active: payload.active,
    slug: generatedSlug,
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError(
        "Variáveis do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const { searchParams } = new URL(request.url);
    const query = String(searchParams.get("q") || "").trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("sl_companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return jsonError(`Falha ao carregar empresas: ${error.message}`, 500);
    }

    const rows = Array.isArray(data) ? data : [];
    const normalized = rows.map((row) => {
      const item = normalizeRow(row);
      const links = buildCompanyLinks(row);

      return {
        ...item,
        ...links,
      };
    });

    const filtered = !query
      ? normalized
      : normalized.filter((item) => buildHaystack(item).includes(query));

    return NextResponse.json({
      success: true,
      message: "Empresas listadas com sucesso.",
      companies: filtered,
      total: filtered.length,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao listar empresas.";

    return jsonError(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return jsonError(
        "Variáveis do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return jsonError(
        "Sessão inválida. Faça login novamente na área da empresa.",
        401
      );
    }

    const supabaseAuth = getAuthClient();

    if (!supabaseAuth) {
      return jsonError("Supabase Auth não configurado no servidor.", 500);
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);

    if (authError || !user?.email) {
      return jsonError(
        "Não foi possível validar a sessão da empresa. Entre novamente e tente de novo.",
        401
      );
    }

    const body = await request.json();
    const payload = extractSavePayload(body, user.email);

    if (payload.cnpj.length !== 14) {
      return jsonError("Informe um CNPJ válido.");
    }

    if (!payload.trade_name) {
      return jsonError("Informe o nome fantasia / empresa.");
    }

    if (!payload.commercial_whatsapp || payload.commercial_whatsapp.length < 10) {
      return jsonError("Informe um WhatsApp válido.");
    }

    if (!isValidEmail(payload.primary_email)) {
      return jsonError("Informe um e-mail principal válido.");
    }

    if (!payload.city) {
      return jsonError("Informe a cidade.");
    }

    if (!payload.state) {
      return jsonError("Informe o estado.");
    }

    if (!payload.accepted_name) {
      return jsonError("Informe o nome do responsável pelo aceite.");
    }

    if (payload.accepted_document.length < 11) {
      return jsonError("Informe CPF ou CNPJ válido no aceite.");
    }

    if (!payload.accepted_terms) {
      return jsonError(
        "É obrigatório aceitar os termos comerciais da plataforma."
      );
    }

    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError("Supabase Admin não configurado no servidor.", 500);
    }

    const { data: existingCompany, error: duplicateError } = await supabaseAdmin
      .from("sl_companies")
      .select("id, cnpj, nome_fantasia, razao_social, cidade, estado, slug")
      .eq("cnpj", payload.cnpj)
      .maybeSingle();

    if (duplicateError) {
      return jsonError(
        `Erro ao validar duplicidade do CNPJ: ${duplicateError.message}`,
        500
      );
    }

    if (existingCompany?.id) {
      const normalizedExisting = normalizeRow(existingCompany);
      const links = buildCompanyLinks(existingCompany);

      return jsonError(
        "Este CNPJ já está cadastrado na base empresarial.",
        409,
        {
          duplicate: true,
          existing_company: {
            ...normalizedExisting,
            ...links,
          },
          edit_url: links.edit_url,
          view_url: links.view_url,
        }
      );
    }

    const generatedSlug = payload.slugInput
      ? payload.slugInput
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .replace(/--+/g, "-")
      : buildSlugFromName(
          payload.trade_name || payload.corporate_name,
          payload.city,
          payload.state,
          ""
        );

    const insertPayload = {
      company_type: payload.company_type,
      cnpj: payload.cnpj,
      razao_social: payload.corporate_name || null,
      nome_fantasia: payload.trade_name,
      inscricao_estadual: payload.state_registration || null,
      responsavel: payload.commercial_contact_name || null,
      cpf_responsavel: payload.commercial_contact_cpf,
      whatsapp: payload.commercial_whatsapp,
      email_principal: payload.primary_email,
      email_secundario_1: payload.secondary_email_1,
      email_secundario_2: payload.secondary_email_2,
      email_secundario_3: payload.secondary_email_3,
      email_secundario_4: payload.secondary_email_4,
      email_secundario_5: payload.secondary_email_5,
      site: payload.website,
      cidade: payload.city,
      estado: payload.state,
      endereco: payload.address,
      numero: payload.address_number,
      bairro: payload.neighborhood,
      cep: payload.zip_code,
      descricao_publica: payload.public_description,
      aceita_contato_whatsapp: payload.accepts_whatsapp_contact,
      recebe_leads: payload.receives_leads,
      possui_contrato_modelo: payload.has_contract_template,
      logo_file_name: payload.logo_file_name,
      contract_file_name: payload.contract_file_name,
      observacoes: payload.notes,
      maintenance_fee_monthly: payload.maintenance_fee_monthly,
      active: payload.active,
      slug: generatedSlug,
    };

    const { data, error } = await supabaseAdmin
      .from("sl_companies")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      return jsonError(`Erro ao salvar empresa: ${error.message}`, 500);
    }

    const normalizedSaved = normalizeRow(data || {});
    const links = buildCompanyLinks(data || {});

    return NextResponse.json({
      success: true,
      message: "Empresa cadastrada com sucesso.",
      company: {
        ...normalizedSaved,
        ...links,
      },
      edit_url: links.edit_url,
      view_url: links.view_url,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao salvar empresa.";

    return jsonError(message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonError(
        "Variáveis do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const body = await request.json();
    const id = String(body?.id || "").trim();

    if (!id) {
      return jsonError("ID da empresa não informado.");
    }

    const payload = extractSavePayload(body);

    if (payload.cnpj.length !== 14) {
      return jsonError("Informe um CNPJ válido.");
    }

    if (!payload.trade_name) {
      return jsonError("Informe o nome fantasia.");
    }

    if (!payload.city) {
      return jsonError("Informe a cidade.");
    }

    if (!payload.state) {
      return jsonError("Informe o estado.");
    }

    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError("Supabase Admin não configurado no servidor.", 500);
    }

    const { data: currentCompany, error: currentError } = await supabaseAdmin
      .from("sl_companies")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (currentError) {
      return jsonError(
        `Erro ao localizar empresa para edição: ${currentError.message}`,
        500
      );
    }

    if (!currentCompany?.id) {
      return jsonError("Empresa não encontrada para edição.", 404);
    }

    if (payload.cnpj !== onlyDigits(currentCompany?.cnpj || "")) {
      const { data: duplicateCompany, error: duplicateError } = await supabaseAdmin
        .from("sl_companies")
        .select("id, cnpj")
        .eq("cnpj", payload.cnpj)
        .neq("id", id)
        .maybeSingle();

      if (duplicateError) {
        return jsonError(
          `Erro ao validar duplicidade do CNPJ na edição: ${duplicateError.message}`,
          500
        );
      }

      if (duplicateCompany?.id) {
        return jsonError(
          "Já existe outra empresa cadastrada com este CNPJ.",
          409
        );
      }
    }

    const updatePayload = buildUpdatePayloadForExisting(payload, id);

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("sl_companies")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return jsonError(
        `Não foi possível salvar a edição da empresa: ${updateError.message}`,
        500
      );
    }

    const normalizedUpdated = normalizeRow(updated || {});
    const links = buildCompanyLinks(updated || {});

    return NextResponse.json({
      success: true,
      message: "Empresa atualizada com sucesso.",
      company: {
        ...normalizedUpdated,
        ...links,
      },
      edit_url: links.edit_url,
      view_url: links.view_url,
      internal_view_url: links.internal_view_url,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar empresa.";

    return jsonError(message, 500);
  }
}