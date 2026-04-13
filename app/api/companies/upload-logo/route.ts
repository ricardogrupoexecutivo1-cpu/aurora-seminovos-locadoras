"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "aurora-images";

type CompanyItem = {
  id: string;
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

function buildLogoUrl(fileName?: string | null) {
  if (!fileName) return "";
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!baseUrl) return "";
  return `${baseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${fileName}`;
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

function formatCNPJ(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");

  if (digits.length !== 14) return value || "Não informado";

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function safeText(value?: string | null, fallback = "Não informado") {
  const text = (value || "").trim();
  return text ? text : fallback;
}

function pickCompanyName(company?: CompanyItem | null) {
  if (!company) return "Empresa";
  return (
    company.trade_name ||
    company.corporate_name ||
    company.primary_email ||
    company.cnpj ||
    "Empresa sem nome"
  );
}

function pickLocation(company?: CompanyItem | null) {
  if (!company) return "Local não informado";

  const city = company.city?.trim();
  const state = company.state?.trim();

  if (city && state) return `${city} • ${state}`;
  if (city) return city;
  if (state) return state;
  return "Local não informado";
}

function pickPublicDescription(company?: CompanyItem | null) {
  if (!company) {
    return "Base comercial ativa para seminovos, frota e negociação empresarial.";
  }

  if (company.public_description?.trim()) {
    return company.public_description.trim();
  }

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

function buildWhatsAppUrl(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

function buildWebsiteUrl(value?: string | null) {
  const text = (value || "").trim();
  if (!text) return "";
  if (text.startsWith("http://") || text.startsWith("https://")) return text;
  return `https://${text}`;
}

function extractCompanies(parsed: CompaniesApiResponse | null) {
  if (Array.isArray(parsed?.companies)) return parsed.companies;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.items)) return parsed.items;
  return [];
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

export default function EmpresaSlugPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const [company, setCompany] = useState<CompanyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) {
      setError("Não foi possível identificar a empresa na URL.");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadCompany() {
      try {
        setLoading(true);
        setError("");

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

        if (!response.ok) {
          throw new Error(
            parsed?.message ||
              parsed?.error ||
              `Falha ao carregar empresa. HTTP ${response.status}.`
          );
        }

        const companies = extractCompanies(parsed);
        const found =
          companies.find((item) => buildCompanySlug(item) === slug) || null;

        if (!found) {
          throw new Error("Empresa não encontrada para este slug.");
        }

        if (!active) return;
        setCompany(found);
      } catch (err) {
        if (!active) return;
        setCompany(null);
        setError(
          err instanceof Error
            ? err.message
            : "Erro inesperado ao carregar a empresa."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCompany();

    return () => {
      active = false;
    };
  }, [slug]);

  const companyName = useMemo(() => pickCompanyName(company), [company]);
  const logoUrl = useMemo(() => buildLogoUrl(company?.logo_file_name), [company]);
  const initials = useMemo(() => getInitials(companyName), [companyName]);
  const whatsappUrl = useMemo(
    () => buildWhatsAppUrl(company?.commercial_whatsapp),
    [company]
  );
  const websiteUrl = useMemo(() => buildWebsiteUrl(company?.website), [company]);
  const canonicalSlug = useMemo(
    () => (company ? buildCompanySlug(company) : ""),
    [company]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f7fbff_45%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute right-[-80px] top-[20px] h-[280px] w-[280px] rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute left-[25%] top-[220px] h-[240px] w-[240px] rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/90 shadow-[0_20px_70px_rgba(14,30,37,0.10)] backdrop-blur">
          <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(96,165,250,0.20),transparent_24%),linear-gradient(135deg,#f0fbff_0%,#edf7ff_55%,#f9fdff_100%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-700">
                  Aurora IA
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Página pública com slug bonito
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Seminovos Locadoras
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  URL premium para compartilhamento e apresentação comercial da
                  empresa dentro do módulo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/seminovos-locadoras/empresas"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Voltar para empresas
                </Link>

                {company ? (
                  <Link
                    href={`/seminovos-locadoras/empresas/${company.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                  >
                    Ver rota por ID
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 sm:p-8">
              <div className="rounded-[28px] border border-cyan-100 bg-cyan-50 p-6 text-sm text-cyan-700">
                Carregando página da empresa...
              </div>
            </div>
          ) : error ? (
            <div className="p-6 sm:p-8">
              <div className="overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <div className="border-b border-amber-100 bg-amber-50 px-5 py-4 sm:px-6">
                  <div className="inline-flex rounded-full border border-amber-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700">
                    Leitura com erro
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">
                    Não foi possível carregar esta empresa
                  </h2>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  <p className="text-sm leading-6 text-slate-700">{error}</p>

                  <p className="mt-4 break-all text-xs font-mono text-slate-400">
                    Slug da URL: {slug || "não identificado"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/seminovos-locadoras/empresas"
                      className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.01]"
                    >
                      Voltar para empresas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`Logo da empresa ${companyName}`}
                        className="h-24 w-24 shrink-0 rounded-2xl border border-cyan-100 bg-white object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 text-2xl font-black text-cyan-700">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                          {formatCompanyType(company?.company_type)}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                            company?.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {company?.active ? "Ativa" : "Inativa"}
                        </span>
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {companyName}
                      </h2>

                      <p className="mt-3 text-sm font-semibold text-cyan-700">
                        {pickLocation(company)}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {pickPublicDescription(company)}
                      </p>

                      <p className="mt-4 break-all rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-mono text-cyan-800">
                        Slug bonito: {canonicalSlug}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                  <h3 className="text-xl font-black text-slate-900">
                    Contato e presença comercial
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <InfoCard label="CNPJ" value={formatCNPJ(company?.cnpj)} />
                    <InfoCard
                      label="Responsável"
                      value={safeText(company?.commercial_contact_name)}
                    />
                    <InfoCard
                      label="WhatsApp"
                      value={safeText(company?.commercial_whatsapp)}
                    />
                    <InfoCard
                      label="E-mail principal"
                      value={safeText(company?.primary_email)}
                    />
                    <InfoCard label="Site" value={safeText(company?.website)} />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-600"
                      >
                        Chamar no WhatsApp
                      </a>
                    ) : null}

                    {websiteUrl ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                      >
                        Abrir site
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 px-6 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-2">
                <div className="rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                  <h3 className="text-xl font-black text-slate-900">
                    Dados operacionais
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InfoCard label="Cidade" value={safeText(company?.city)} />
                    <InfoCard label="Estado" value={safeText(company?.state)} />
                    <InfoCard label="Bairro" value={safeText(company?.neighborhood)} />
                    <InfoCard label="CEP" value={safeText(company?.zip_code)} />
                    <InfoCard label="Endereço" value={safeText(company?.address)} />
                    <InfoCard
                      label="Número"
                      value={safeText(company?.address_number)}
                    />
                  </div>
                </div>

                <div className="rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                  <h3 className="text-xl font-black text-slate-900">
                    Informações do cadastro
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InfoCard
                      label="Mensalidade"
                      value={
                        typeof company?.maintenance_fee_monthly === "number"
                          ? `R$ ${company.maintenance_fee_monthly
                              .toFixed(2)
                              .replace(".", ",")}`
                          : "Não informada"
                      }
                    />
                    <InfoCard
                      label="Recebe leads"
                      value={company?.receives_leads ? "Sim" : "Não"}
                    />
                    <InfoCard
                      label="Contato por WhatsApp"
                      value={
                        company?.accepts_whatsapp_contact ? "Ativado" : "Desativado"
                      }
                    />
                    <InfoCard
                      label="Contrato modelo"
                      value={company?.has_contract_template ? "Sim" : "Não"}
                    />
                  </div>

                  <div className="mt-6 border-t border-cyan-100 pt-4 text-sm text-slate-500">
                    Criado em {formatDate(company?.created_at)} • Atualizado em{" "}
                    {formatDate(company?.updated_at)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
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