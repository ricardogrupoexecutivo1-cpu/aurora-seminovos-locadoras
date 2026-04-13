"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "aurora-images";

function buildLogoUrl(fileName?: string | null) {
  if (!fileName) return "";
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!baseUrl) return "";
  return `${baseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
}

type CompanyItem = {
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

type CompaniesApiResponse = {
  success?: boolean;
  companies?: CompanyItem[];
  total?: number;
  message?: string;
  error?: string;
  data?: CompanyItem[];
  items?: CompanyItem[];
};

type DeleteCompanyResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function normalizeText(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function normalizeCNPJ(value?: string | null) {
  return (value || "").replace(/\D/g, "");
}

function formatCompanyType(value?: string | null) {
  const map: Record<string, string> = {
    locadora: "Locadora",
    revenda: "Revenda",
    concessionaria: "Concessionária",
    lojista: "Lojista",
  };

  if (!value) return "Empresa";
  return map[value] || value;
}

function pickCompanyName(company: CompanyItem) {
  return (
    company.trade_name ||
    company.corporate_name ||
    company.primary_email ||
    company.cnpj ||
    "Empresa sem nome"
  );
}

function pickLocation(company: CompanyItem) {
  const city = (company.city || "").trim();
  const state = (company.state || "").trim();

  if (city && state) return `${city} • ${state}`;
  if (city) return city;
  if (state) return state;
  return "Local não informado";
}

function pickPublicDescription(company: CompanyItem) {
  if (company.public_description?.trim()) return company.public_description.trim();
  return "Base comercial ativa para seminovos, frota e negociação empresarial.";
}

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "AU";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

function getCompanyCompletenessScore(company: CompanyItem) {
  let score = 0;

  if (company.logo_file_name) score += 30;
  if (company.trade_name) score += 12;
  if (company.corporate_name) score += 10;
  if (company.commercial_whatsapp) score += 10;
  if (company.primary_email) score += 10;
  if (company.city) score += 6;
  if (company.state) score += 6;
  if (company.website) score += 6;
  if (company.public_description) score += 5;
  if (company.commercial_contact_name) score += 3;
  if (company.address) score += 2;

  return score;
}

function getUpdatedTimestamp(company: CompanyItem) {
  const base = company.updated_at || company.created_at;
  if (!base) return 0;
  const timestamp = new Date(base).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function isVerifiedCompany(company: CompanyItem) {
  return Boolean(
    company.logo_file_name &&
      company.primary_email &&
      company.commercial_whatsapp &&
      company.city &&
      company.state
  );
}

function getHighlightLabel(company: CompanyItem, isTopRanked: boolean) {
  if (isTopRanked && isVerifiedCompany(company)) return "Destaque Aurora";
  if (isVerifiedCompany(company)) return "Empresa verificada";
  return "Cadastro inicial";
}

function getHighlightClasses(label: string) {
  if (label === "Destaque Aurora") {
    return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
  }

  if (label === "Empresa verificada") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-white text-slate-600";
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

function buildCompanySlug(company: CompanyItem) {
  const name = slugifyPart(
    company.trade_name ||
      company.corporate_name ||
      company.primary_email ||
      company.cnpj ||
      "empresa"
  );
  const city = slugifyPart(company.city);
  const state = slugifyPart(company.state);
  const shortId = (company.id || "").split("-")[0] || "empresa";

  return [name, city, state, shortId].filter(Boolean).join("-");
}

export default function SeminovosEmpresasPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("Aguardando leitura");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function loadCompanies() {
    try {
      setLoading(true);
      setError("");
      setActionError("");
      setApiStatus("Consultando API /api/companies");

      const response = await fetch(`/api/companies?ts=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      });

      const rawText = await response.text();
      let parsed: CompaniesApiResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as CompaniesApiResponse;
        } catch {
          throw new Error(
            `A API respondeu, mas não retornou JSON válido. Resposta recebida: ${rawText.slice(
              0,
              220
            )}`
          );
        }
      }

      console.log("API RESPONSE /api/companies:", parsed);

      if (!response.ok) {
        const message =
          parsed?.message ||
          parsed?.error ||
          `Falha ao carregar empresas. HTTP ${response.status}.`;
        throw new Error(message);
      }

      const maybeCompanies = Array.isArray(parsed?.companies)
        ? parsed.companies
        : Array.isArray(parsed?.data)
        ? parsed.data
        : Array.isArray(parsed?.items)
        ? parsed.items
        : [];

      setCompanies(maybeCompanies);

      if (maybeCompanies.length > 0) {
        setApiStatus("Base lida com sucesso");
      } else {
        setApiStatus("API respondeu, mas ainda não trouxe empresas");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao listar empresas.";
      setError(message);
      setCompanies([]);
      setApiStatus("Leitura com erro");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(company: CompanyItem) {
    const companyName = pickCompanyName(company);
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a empresa "${companyName}"?\n\nEssa ação remove o cadastro da base e tenta apagar a logomarca vinculada.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(company.id);
      setActionMessage("");
      setActionError("");

      const response = await fetch(
        `/api/companies?id=${encodeURIComponent(company.id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        }
      );

      const rawText = await response.text();
      let parsed: DeleteCompanyResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as DeleteCompanyResponse;
        } catch {
          throw new Error(
            `A API respondeu em formato inesperado: ${rawText.slice(0, 220)}`
          );
        }
      }

      if (!response.ok || !parsed?.success) {
        throw new Error(
          parsed?.message ||
            parsed?.error ||
            "Não foi possível excluir a empresa."
        );
      }

      setCompanies((current) =>
        current.filter((item) => item.id !== company.id)
      );
      setActionMessage(parsed.message || "Empresa excluída com sucesso.");
      setActionError("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao excluir empresa.";
      setActionError(message);
      setActionMessage("");
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    void loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const term = normalizeText(search);
    const termCNPJ = normalizeCNPJ(search);

    const baseList = !term
      ? companies
      : companies.filter((company) => {
          const fields = [
            company.trade_name,
            company.corporate_name,
            company.city,
            company.state,
            company.primary_email,
            company.commercial_whatsapp,
            company.commercial_contact_name,
            company.public_description,
            company.slug,
          ];

          const matchText = fields.some((field) =>
            normalizeText(field).includes(term)
          );

          const matchCNPJ = !!(
            termCNPJ && normalizeCNPJ(company.cnpj).includes(termCNPJ)
          );

          return matchText || matchCNPJ;
        });

    return [...baseList].sort((a, b) => {
      const scoreDiff =
        getCompanyCompletenessScore(b) - getCompanyCompletenessScore(a);

      if (scoreDiff !== 0) return scoreDiff;

      const updatedDiff = getUpdatedTimestamp(b) - getUpdatedTimestamp(a);

      if (updatedDiff !== 0) return updatedDiff;

      return pickCompanyName(a).localeCompare(pickCompanyName(b), "pt-BR");
    });
  }, [companies, search]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f7fbff_45%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute right-[-80px] top-[20px] h-[280px] w-[280px] rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute left-[25%] top-[220px] h-[240px] w-[240px] rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/88 shadow-[0_20px_70px_rgba(14,30,37,0.10)] backdrop-blur">
          <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(96,165,250,0.20),transparent_24%),linear-gradient(135deg,#f0fbff_0%,#edf7ff_55%,#f9fdff_100%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-700">
                  Aurora IA
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Seminovos Locadoras
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Empresas cadastradas
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Base comercial premium com leitura real do Supabase para
                  locadoras, revendas, concessionárias e lojistas. Sistema em
                  constante atualização e pode haver momentos de instabilidade
                  durante melhorias.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Voltar para Home
                </Link>

                <Link
                  href="/cadastrar-empresa"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                >
                  Cadastrar nova empresa
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4 sm:p-8">
            <MetricCard
              label="Total salvo"
              value={loading ? "..." : String(companies.length)}
              description="Empresas registradas"
            />
            <MetricCard
              label="Exibidas agora"
              value={loading ? "..." : String(filteredCompanies.length)}
              description="Resultado após a busca"
            />
            <MetricCard
              label="Status"
              value={loading ? "Carregando" : error ? "Com erro" : "Online"}
              description={apiStatus}
            />
            <MetricCard
              label="Integração"
              value="Supabase"
              description="Tabela sl_companies"
            />
          </div>
        </div>

        <div className="mt-6 rounded-[30px] border border-cyan-100 bg-white/92 p-5 shadow-[0_18px_50px_rgba(14,30,37,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-black text-slate-900">
                Buscar empresas da base
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pesquise por nome, CNPJ, cidade, estado, e-mail, WhatsApp,
                responsável comercial, descrição pública ou slug.
              </p>

              <div className="mt-4">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ex.: Aurora, 00.000.000/0001-00, Belo Horizonte..."
                  className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => void loadCompanies()}
                className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
              >
                Atualizar leitura
              </button>
            </div>
          </div>
        </div>

        {actionMessage ? (
          <div className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {actionMessage}
          </div>
        ) : null}

        {actionError ? (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {actionError}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-[28px] border border-cyan-100 bg-cyan-50 p-6 text-sm text-cyan-700">
            Carregando empresas salvas...
          </div>
        ) : error ? (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-4 sm:px-6">
              <div className="inline-flex rounded-full border border-amber-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700">
                Leitura com erro
              </div>
              <h2 className="mt-3 text-2xl font-black text-slate-900">
                Não foi possível listar as empresas
              </h2>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <p className="text-sm leading-6 text-slate-700">{error}</p>

              <p className="mt-4 text-sm text-slate-500">
                Sistema em constante atualização — pode haver momentos de
                instabilidade.
              </p>

              <button
                type="button"
                onClick={() => void loadCompanies()}
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.01]"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-cyan-100 bg-white/92 p-8 text-center shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-xl font-black text-cyan-700">
              0
            </div>

            <h2 className="mt-4 text-2xl font-black text-slate-900">
              Nenhuma empresa encontrada
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Ajuste a busca ou faça um novo cadastro para alimentar a base
              comercial.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5">
            {filteredCompanies.map((company, index) => {
              const companyName = pickCompanyName(company);
              const logoUrl = buildLogoUrl(company.logo_file_name);
              const initials = getInitials(companyName);
              const badgeLabel = getHighlightLabel(company, index === 0);
              const isDeleting = deletingId === company.id;
              const companySlug = company.slug || buildCompanySlug(company);

              return (
                <article
                  key={company.id}
                  className="overflow-hidden rounded-[28px] border border-cyan-100 bg-white/96 shadow-[0_18px_50px_rgba(14,30,37,0.08)]"
                >
                  <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_right,rgba(96,165,250,0.14),transparent_24%),linear-gradient(135deg,#f7fdff_0%,#f3faff_55%,#ffffff_100%)] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                            {formatCompanyType(company.company_type)}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                            {pickLocation(company)}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                              company.active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {company.active ? "Ativa" : "Inativa"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${getHighlightClasses(
                              badgeLabel
                            )}`}
                          >
                            {badgeLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={`Logo da empresa ${companyName}`}
                              className="h-14 w-14 shrink-0 rounded-xl border border-cyan-100 bg-white object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-cyan-200 bg-cyan-50 text-sm font-black text-cyan-700">
                              {initials}
                            </div>
                          )}

                          <h3 className="truncate text-xl font-black text-slate-900 sm:text-2xl">
                            {companyName}
                          </h3>
                        </div>

                        {company.corporate_name &&
                        company.corporate_name !== company.trade_name ? (
                          <p className="mt-1 text-sm text-slate-500">
                            Razão social: {company.corporate_name}
                          </p>
                        ) : null}

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {pickPublicDescription(company)}
                        </p>

                        <p className="mt-3 break-all text-xs font-mono text-slate-400">
                          ID: {company.id}
                        </p>

                        <p className="mt-2 break-all text-xs font-mono text-cyan-700">
                          Slug: {companySlug}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/seminovos-locadoras/empresas/${company.id}/editar`}
                          className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                        >
                          Editar empresa
                        </Link>

                        <Link
                          href={`/seminovos-locadoras/empresa/${companySlug}`}
                          className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                        >
                          Ver página da empresa
                        </Link>

                        <button
                          type="button"
                          onClick={() => void handleDelete(company)}
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? "Excluindo..." : "Excluir empresa"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-6">
                    <InfoCard label="CNPJ" value={company.cnpj || "Não informado"} />
                    <InfoCard
                      label="Responsável"
                      value={company.commercial_contact_name || "Não informado"}
                    />
                    <InfoCard
                      label="WhatsApp"
                      value={company.commercial_whatsapp || "Não informado"}
                    />
                    <InfoCard
                      label="E-mail principal"
                      value={company.primary_email || "Não informado"}
                    />
                    <InfoCard label="Cidade" value={company.city || "Não informada"} />
                    <InfoCard label="Estado" value={company.state || "Não informado"} />
                    <InfoCard label="Site" value={company.website || "Não informado"} />
                    <InfoCard
                      label="Mensalidade"
                      value={
                        typeof company.maintenance_fee_monthly === "number"
                          ? `R$ ${company.maintenance_fee_monthly
                              .toFixed(2)
                              .replace(".", ",")}`
                          : "Não informada"
                      }
                    />
                  </div>

                  <div className="border-t border-cyan-100 px-5 py-4 text-sm text-slate-500 sm:px-6">
                    Criado em {formatDate(company.created_at)} • Atualizado em{" "}
                    {formatDate(company.updated_at)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-cyan-100 bg-[#fafdff] p-5 shadow-[0_10px_24px_rgba(14,30,37,0.05)]">
      <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-700/70">
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
      <div className="mt-2 text-sm leading-5 text-slate-500">{description}</div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-cyan-100 bg-[#fbfeff] p-4 shadow-[0_8px_20px_rgba(14,30,37,0.04)]">
      <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}