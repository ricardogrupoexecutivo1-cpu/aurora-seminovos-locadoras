import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Company = {
  id: string;
  cnpj?: string;
  trade_name?: string;
  corporate_name?: string;
  commercial_contact_name?: string;
  commercial_whatsapp?: string;
  primary_email?: string;
  website?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  zip_code?: string;
  address?: string;
  address_number?: string;
  public_description?: string;
  maintenance_fee_monthly?: number | null;
  receives_leads?: boolean;
  accepts_whatsapp_contact?: boolean;
  has_contract_template?: boolean;
  company_type?: string;
  slug?: string;
  created_at?: string | null;
  updated_at?: string | null;
  active?: boolean | null;
};

const ASAAS_LINK_BASICO = "https://www.asaas.com/c/7ciz04x48fxjp3vl";
const ASAAS_LINK_PROFISSIONAL = "https://www.asaas.com/c/qckh04pvirb0jxh8";
const ASAAS_LINK_ELITE = "https://www.asaas.com/c/6cvbo3g79fovk7l7";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

function onlyDigits(value: string) {
  return String(value || "").replace(/\D/g, "");
}

function formatCnpj(value?: string) {
  const digits = onlyDigits(String(value || "")).slice(0, 14);

  if (digits.length !== 14) {
    return value || "Não informado";
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatZipCode(value?: string) {
  const digits = onlyDigits(String(value || "")).slice(0, 8);

  if (digits.length !== 8) {
    return value || "Não informado";
  }

  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Sem data";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function toWhatsappUrl(whatsapp?: string) {
  const digits = onlyDigits(String(whatsapp || ""));

  if (!digits) {
    return "";
  }

  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

function normalizeUrl(url?: string) {
  const value = String(url || "").trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function toTitleCase(value?: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeRow(row: Record<string, any>): Company {
  return {
    id: String(row?.id || ""),
    cnpj: row?.cnpj ?? "",
    trade_name: row?.nome_fantasia ?? "",
    corporate_name: row?.razao_social ?? "",
    commercial_contact_name: row?.responsavel ?? "",
    commercial_whatsapp: row?.whatsapp ?? "",
    primary_email: row?.email_principal ?? "",
    website: row?.site ?? "",
    city: row?.cidade ?? "",
    state: row?.estado ?? "",
    neighborhood: row?.bairro ?? "",
    zip_code: row?.cep ?? "",
    address: row?.endereco ?? "",
    address_number: row?.numero ?? "",
    public_description: row?.descricao_publica ?? "",
    maintenance_fee_monthly: row?.maintenance_fee_monthly ?? null,
    receives_leads: Boolean(row?.recebe_leads ?? false),
    accepts_whatsapp_contact: Boolean(row?.aceita_contato_whatsapp ?? false),
    has_contract_template: Boolean(row?.possui_contrato_modelo ?? false),
    company_type: row?.company_type ?? "locadora",
    slug: row?.slug ?? "",
    created_at: row?.created_at ?? null,
    updated_at: row?.updated_at ?? null,
    active: row?.active ?? true,
  };
}

async function getCompany(slug: string): Promise<Company | null> {
  const supabaseAdmin = getAdminClient();

  if (!supabaseAdmin) {
    return null;
  }

  const normalizedSlug = String(slug || "").trim();

  if (!normalizedSlug) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("sl_companies")
    .select("*")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeRow(data);
}

export default async function EmpresaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  const whatsappUrl = toWhatsappUrl(company.commercial_whatsapp);
  const siteUrl = normalizeUrl(company.website);

  const companyName =
    company.trade_name ||
    company.corporate_name ||
    "Empresa sem nome";

  const cityState = [toTitleCase(company.city), String(company.state || "").toUpperCase()]
    .filter(Boolean)
    .join(" • ");

  const companyType = toTitleCase(String(company.company_type || "empresa"));
  const initials =
    companyName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "AI";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-sky-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur">
            Aurora IA
          </div>

          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Página pública comercial
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Seminovos Locadoras
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Apresentação comercial da empresa dentro do projeto, com leitura direta do cadastro salvo no Supabase.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/seminovos-locadoras/empresas"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Voltar para empresas
              </Link>

              <Link
                href={`/seminovos-locadoras/empresas/${company.id}/editar`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Editar empresa
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-start gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_100%)] text-2xl font-black text-white shadow-[0_20px_40px_rgba(37,99,235,0.25)]">
                  {initials}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      {companyType}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        company.active
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {company.active ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-black tracking-[-0.02em] text-slate-950">
                    {companyName}
                  </h2>

                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {cityState || "Local não informado"}
                  </p>

                  <p className="mt-4 text-base leading-7 text-slate-700">
                    {company.public_description ||
                      "Empresa cadastrada na plataforma Aurora com presença comercial ativa no módulo Seminovos Locadoras."}
                  </p>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Slug atual:</span>{" "}
                    {company.slug || "não informado"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Contato e presença comercial
              </p>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    CNPJ
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {formatCnpj(company.cnpj)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Responsável
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {company.commercial_contact_name || "Não informado"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    WhatsApp
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {company.commercial_whatsapp || "Não informado"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    E-mail principal
                  </div>
                  <div className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {company.primary_email || "Não informado"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Site
                  </div>
                  <div className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {company.website || "Não informado"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(5,150,105,0.22)] transition hover:scale-[1.01]"
                    >
                      Chamar no WhatsApp
                    </a>
                  ) : null}

                  {siteUrl ? (
                    <a
                      href={siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Abrir site
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Dados operacionais
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Cidade
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {toTitleCase(company.city) || "Não informada"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Estado
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {String(company.state || "").toUpperCase() || "Não informado"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Bairro
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {toTitleCase(company.neighborhood) || "Não informado"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  CEP
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {formatZipCode(company.zip_code)}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Endereço
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {[toTitleCase(company.address), company.address_number]
                    .filter(Boolean)
                    .join(", ") || "Não informado"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Informações do cadastro
            </p>

            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Mensalidade atual
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {formatCurrency(company.maintenance_fee_monthly)}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Recebe leads
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {company.receives_leads ? "Sim" : "Não"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Contato por WhatsApp
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {company.accepts_whatsapp_contact ? "Ativado" : "Não informado"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Contrato modelo
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {company.has_contract_template ? "Sim" : "Não"}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="text-sm leading-7 text-slate-600">
                  Criado em {formatDate(company.created_at)} • Atualizado em {formatDate(company.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_100%)] p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Planos de manutenção
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
                Mantenha sua empresa ativa, forte e em destaque
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Os planos de manutenção mantêm sua empresa organizada, visível e pronta para captar mais negócios dentro do ecossistema Aurora.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-cyan-700 shadow-sm">
              Nome correto: <span className="text-slate-900">Planos de manutenção</span>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <a
              href={ASAAS_LINK_BASICO}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_20px_40px_rgba(8,145,178,0.12)]"
            >
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Básico
              </div>

              <h3 className="mt-4 text-2xl font-black text-slate-950">
                R$ 49,90
                <span className="text-sm font-semibold text-slate-500">/mês</span>
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Presença ativa na plataforma com manutenção essencial do cadastro empresarial.
              </p>

              <div className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,132,199,0.18)]">
                Assinar manutenção básica
              </div>
            </a>

            <a
              href={ASAAS_LINK_PROFISSIONAL}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_20px_40px_rgba(8,145,178,0.12)]"
            >
              <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Profissional
              </div>

              <h3 className="mt-4 text-2xl font-black text-slate-950">
                R$ 99,90
                <span className="text-sm font-semibold text-slate-500">/mês</span>
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Mais força comercial, melhor apresentação e manutenção contínua da presença digital.
              </p>

              <div className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#06b6d4_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.18)]">
                Assinar manutenção profissional
              </div>
            </a>

            <a
              href={ASAAS_LINK_ELITE}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[28px] border border-blue-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_20px_45px_rgba(37,99,235,0.10)] transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_24px_48px_rgba(37,99,235,0.16)]"
            >
              <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                Elite
              </div>

              <h3 className="mt-4 text-2xl font-black text-slate-950">
                R$ 199,90
                <span className="text-sm font-semibold text-slate-500">/mês</span>
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Plano premium para empresas que querem presença mais forte, percepção superior e manutenção de alto nível.
              </p>

              <div className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d4ed8_0%,#7c3aed_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(29,78,216,0.20)]">
                Assinar manutenção elite
              </div>
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm leading-7 text-slate-600">
            <span className="font-semibold text-amber-700">
              Sistema em constante atualização
            </span>{" "}
            — pode haver momentos de instabilidade.
          </p>
        </div>
      </section>
    </main>
  );
}