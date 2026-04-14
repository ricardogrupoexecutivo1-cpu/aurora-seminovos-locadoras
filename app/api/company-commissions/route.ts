import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type CommissionCategory =
  | "passeio"
  | "intermediario"
  | "4x4"
  | "grande_porte";

const CATEGORY_PAYMENT_LINKS: Record<CommissionCategory, string> = {
  passeio: "https://www.asaas.com/c/elpqxnhsn2xcibvh",
  intermediario: "https://www.asaas.com/c/mj240d84fccw33mb",
  "4x4": "https://www.asaas.com/c/7y2oitl3glg6rq8c",
  grande_porte: "https://www.asaas.com/c/6hu5dgp57ep76ul1",
};

const CATEGORY_AMOUNTS: Record<CommissionCategory, number> = {
  passeio: 1000,
  intermediario: 1500,
  "4x4": 2000,
  grande_porte: 3000,
};

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

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeCategory(value: unknown): CommissionCategory | "" {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (raw === "passeio") return "passeio";
  if (raw === "intermediario") return "intermediario";
  if (raw === "4x4" || raw === "4x4s" || raw === "4x4 ") return "4x4";
  if (
    raw === "grande porte" ||
    raw === "grande_porte" ||
    raw === "grande-porte"
  ) {
    return "grande_porte";
  }

  return "";
}

function normalizeStatus(value: unknown) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!raw) return "";
  if (raw === "pendente") return "pendente";
  if (raw === "paga" || raw === "pago") return "paga";
  if (raw === "cancelada" || raw === "cancelado") return "cancelada";
  return raw;
}

function normalizeCommissionRow(row: Record<string, unknown>) {
  return {
    id: String(row?.id || ""),
    company_id: String(row?.company_id || ""),
    company_slug: String(row?.company_slug || ""),
    company_name: String(row?.company_name || ""),
    vehicle_category: String(row?.vehicle_category || ""),
    vehicle_label: String(row?.vehicle_label || ""),
    vehicle_id: String(row?.vehicle_id || ""),
    commission_amount: Number(row?.commission_amount || 0),
    payment_link: String(row?.payment_link || ""),
    payment_provider: String(row?.payment_provider || "asaas"),
    payment_type: String(row?.payment_type || "avulsa"),
    status: String(row?.status || "pendente"),
    paid_at: row?.paid_at || null,
    due_at: row?.due_at || null,
    external_payment_id: String(row?.external_payment_id || ""),
    notes: String(row?.notes || ""),
    created_by_email: String(row?.created_by_email || ""),
    updated_by_email: String(row?.updated_by_email || ""),
    created_at: row?.created_at || null,
    updated_at: row?.updated_at || null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError(
        "Supabase não configurado no servidor. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = normalizeText(searchParams.get("company_id"));
    const status = normalizeStatus(searchParams.get("status"));
    const category = normalizeCategory(searchParams.get("vehicle_category"));
    const limitRaw = Number(searchParams.get("limit") || 50);
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 200)
      : 50;

    let query = supabaseAdmin
      .from("sl_company_commissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("vehicle_category", category);
    }

    const { data, error } = await query;

    if (error) {
      return jsonError(`Erro ao listar comissões: ${error.message}`, 500, {
        debug_error: error,
      });
    }

    const commissions = Array.isArray(data)
      ? data.map((row) => normalizeCommissionRow(row))
      : [];

    const totalAmount = commissions.reduce(
      (sum, item) => sum + Number(item.commission_amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      message: "Comissões listadas com sucesso.",
      commissions,
      total: commissions.length,
      total_amount: totalAmount,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao listar comissões.";

    return jsonError(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError(
        "Supabase não configurado no servidor. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const body = await request.json();

    const company_id = normalizeText(body?.company_id);
    const company_slug = normalizeText(body?.company_slug);
    const company_name = normalizeText(body?.company_name);
    const vehicle_category = normalizeCategory(body?.vehicle_category);
    const vehicle_label = normalizeText(body?.vehicle_label);
    const vehicle_id = normalizeText(body?.vehicle_id);
    const notes = normalizeText(body?.notes);
    const created_by_email = normalizeText(body?.created_by_email).toLowerCase();
    const due_at = normalizeText(body?.due_at) || null;

    if (!company_id) {
      return jsonError("Informe o ID da empresa.");
    }

    if (!vehicle_category) {
      return jsonError(
        "Informe a categoria do veículo: passeio, intermediario, 4x4 ou grande_porte."
      );
    }

    const commission_amount = CATEGORY_AMOUNTS[vehicle_category];
    const payment_link = CATEGORY_PAYMENT_LINKS[vehicle_category];

    const insertPayload = {
      company_id,
      company_slug: company_slug || null,
      company_name: company_name || null,
      vehicle_category,
      vehicle_label: vehicle_label || null,
      vehicle_id: vehicle_id || null,
      commission_amount,
      payment_link,
      payment_provider: "asaas",
      payment_type: "avulsa",
      status: "pendente",
      paid_at: null,
      due_at,
      external_payment_id: null,
      notes: notes || null,
      created_by_email: created_by_email || null,
      updated_by_email: created_by_email || null,
    };

    const { data: insertedRows, error: insertError } = await supabaseAdmin
      .from("sl_company_commissions")
      .insert(insertPayload)
      .select("*");

    if (insertError) {
      return jsonError(`Erro ao lançar comissão: ${insertError.message}`, 500, {
        debug_stage: "insert",
        debug_payload: insertPayload,
        debug_error: insertError,
      });
    }

    const inserted = Array.isArray(insertedRows) ? insertedRows[0] : null;

    if (!inserted) {
      return jsonError(
        "A comissão foi enviada, mas o Supabase não retornou a linha criada.",
        500,
        {
          debug_stage: "insert_no_row_returned",
          debug_payload: insertPayload,
        }
      );
    }

    const commission = normalizeCommissionRow(inserted);

    return NextResponse.json({
      success: true,
      message: "Comissão lançada com sucesso.",
      commission,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao lançar comissão.";

    return jsonError(message, 500, {
      debug_stage: "catch",
      debug_error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : String(error),
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabaseAdmin = getAdminClient();

    if (!supabaseAdmin) {
      return jsonError(
        "Supabase não configurado no servidor. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        500
      );
    }

    const body = await request.json();

    const id = normalizeText(body?.id);
    const status = normalizeStatus(body?.status);
    const updated_by_email = normalizeText(body?.updated_by_email).toLowerCase();
    const external_payment_id = normalizeText(body?.external_payment_id);
    const notes = normalizeText(body?.notes);

    if (!id) {
      return jsonError("Informe o ID da comissão.");
    }

    if (!status) {
      return jsonError("Informe o novo status da comissão.");
    }

    if (!["pendente", "paga", "cancelada"].includes(status)) {
      return jsonError("Status inválido. Use pendente, paga ou cancelada.");
    }

    const { data: currentRow, error: currentError } = await supabaseAdmin
      .from("sl_company_commissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (currentError) {
      return jsonError(
        `Erro ao localizar comissão: ${currentError.message}`,
        500
      );
    }

    if (!currentRow?.id) {
      return jsonError("Comissão não encontrada.", 404);
    }

    const updatePayload: Record<string, unknown> = {
      status,
      updated_by_email: updated_by_email || currentRow.updated_by_email || null,
    };

    if (status === "paga") {
      updatePayload.paid_at = new Date().toISOString();
    }

    if (status !== "paga") {
      updatePayload.paid_at = null;
    }

    if (external_payment_id) {
      updatePayload.external_payment_id = external_payment_id;
    }

    if (notes) {
      updatePayload.notes = notes;
    }

    const { data: updatedRows, error: updateError } = await supabaseAdmin
      .from("sl_company_commissions")
      .update(updatePayload)
      .eq("id", id)
      .select("*");

    if (updateError) {
      return jsonError(
        `Erro ao atualizar comissão: ${updateError.message}`,
        500,
        {
          debug_stage: "patch_update",
          debug_payload: updatePayload,
          debug_error: updateError,
        }
      );
    }

    const updated = Array.isArray(updatedRows) ? updatedRows[0] : null;

    if (!updated) {
      return jsonError(
        "A comissão foi atualizada, mas o Supabase não retornou a linha final.",
        500,
        {
          debug_stage: "patch_no_row_returned",
          debug_payload: updatePayload,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comissão atualizada com sucesso.",
      commission: normalizeCommissionRow(updated),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar comissão.";

    return jsonError(message, 500, {
      debug_stage: "patch_catch",
      debug_error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : String(error),
    });
  }
}