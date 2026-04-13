"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

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
  company?: CompanyItem;
};

type SaveResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  company?: CompanyItem;
};

type FormState = {
  id: string;
  slug: string;
  company_type: string;
  cnpj: string;
  corporate_name: string;
  trade_name: string;
  state_registration: string;
  commercial_contact_name: string;
  commercial_contact_cpf: string;
  commercial_whatsapp: string;
  primary_email: string;
  secondary_email_1: string;
  secondary_email_2: string;
  secondary_email_3: string;
  secondary_email_4: string;
  secondary_email_5: string;
  website: string;
  city: string;
  state: string;
  address: string;
  address_number: string;
  neighborhood: string;
  zip_code: string;
  public_description: string;
  notes: string;
  maintenance_fee_monthly: string;
  accepts_whatsapp_contact: boolean;
  receives_leads: boolean;
  has_contract_template: boolean;
  active: boolean;
};

const INITIAL_FORM: FormState = {
  id: "",
  slug: "",
  company_type: "locadora",
  cnpj: "",
  corporate_name: "",
  trade_name: "",
  state_registration: "",
  commercial_contact_name: "",
  commercial_contact_cpf: "",
  commercial_whatsapp: "",
  primary_email: "",
  secondary_email_1: "",
  secondary_email_2: "",
  secondary_email_3: "",
  secondary_email_4: "",
  secondary_email_5: "",
  website: "",
  city: "",
  state: "",
  address: "",
  address_number: "",
  neighborhood: "",
  zip_code: "",
  public_description: "",
  notes: "",
  maintenance_fee_monthly: "49.90",
  accepts_whatsapp_contact: true,
  receives_leads: true,
  has_contract_template: false,
  active: true,
};

function extractCompanies(parsed: CompaniesApiResponse | null) {
  if (Array.isArray(parsed?.companies)) return parsed.companies;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.items)) return parsed.items;
  if (parsed?.company) return [parsed.company];
  return [];
}

function safeString(value?: string | null) {
  return value ?? "";
}

function normalizeNumberInput(value: string) {
  const clean = value.replace(",", ".").trim();
  if (!clean) return "0";
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed.toString() : "0";
}

function slugifyInput(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSlugPreview(form: FormState) {
  if (form.slug.trim()) return slugifyInput(form.slug);

  const name =
    form.trade_name.trim() ||
    form.corporate_name.trim() ||
    form.primary_email.trim() ||
    form.cnpj.trim() ||
    "empresa";

  const city = form.city.trim();
  const state = form.state.trim();
  const shortId = (form.id || "").split("-")[0] || "empresa";

  return [name, city, state, shortId]
    .map(slugifyInput)
    .filter(Boolean)
    .join("-");
}

function companyToForm(company: CompanyItem): FormState {
  return {
    id: company.id,
    slug: safeString(company.slug),
    company_type: safeString(company.company_type) || "locadora",
    cnpj: safeString(company.cnpj),
    corporate_name: safeString(company.corporate_name),
    trade_name: safeString(company.trade_name),
    state_registration: safeString(company.state_registration),
    commercial_contact_name: safeString(company.commercial_contact_name),
    commercial_contact_cpf: safeString(company.commercial_contact_cpf),
    commercial_whatsapp: safeString(company.commercial_whatsapp),
    primary_email: safeString(company.primary_email),
    secondary_email_1: safeString(company.secondary_email_1),
    secondary_email_2: safeString(company.secondary_email_2),
    secondary_email_3: safeString(company.secondary_email_3),
    secondary_email_4: safeString(company.secondary_email_4),
    secondary_email_5: safeString(company.secondary_email_5),
    website: safeString(company.website),
    city: safeString(company.city),
    state: safeString(company.state),
    address: safeString(company.address),
    address_number: safeString(company.address_number),
    neighborhood: safeString(company.neighborhood),
    zip_code: safeString(company.zip_code),
    public_description: safeString(company.public_description),
    notes: safeString(company.notes),
    maintenance_fee_monthly:
      typeof company.maintenance_fee_monthly === "number"
        ? company.maintenance_fee_monthly.toFixed(2)
        : "49.90",
    accepts_whatsapp_contact: Boolean(company.accepts_whatsapp_contact),
    receives_leads: Boolean(company.receives_leads),
    has_contract_template: Boolean(company.has_contract_template),
    active: company.active ?? true,
  };
}

function formatMoneyPreview(value: string) {
  const parsed = Number(normalizeNumberInput(value));
  return Number.isFinite(parsed)
    ? parsed.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00";
}

export default function EditarEmpresaPage() {
  const params = useParams();
  const router = useRouter();

  const companyId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!companyId) {
      setError("Não foi possível identificar a empresa para edição.");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadCompany() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

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
        const found = companies.find((item) => item.id === companyId);

        if (!found) {
          throw new Error("Empresa não encontrada para edição.");
        }

        if (!active) return;
        setForm(companyToForm(found));
      } catch (err) {
        if (!active) return;
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
  }, [companyId]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        id: form.id,
        slug: slugifyInput(form.slug),
        company_type: form.company_type,
        cnpj: form.cnpj,
        corporate_name: form.corporate_name,
        trade_name: form.trade_name,
        state_registration: form.state_registration,
        commercial_contact_name: form.commercial_contact_name,
        commercial_contact_cpf: form.commercial_contact_cpf,
        commercial_whatsapp: form.commercial_whatsapp,
        primary_email: form.primary_email,
        secondary_email_1: form.secondary_email_1,
        secondary_email_2: form.secondary_email_2,
        secondary_email_3: form.secondary_email_3,
        secondary_email_4: form.secondary_email_4,
        secondary_email_5: form.secondary_email_5,
        website: form.website,
        city: form.city,
        state: form.state,
        address: form.address,
        address_number: form.address_number,
        neighborhood: form.neighborhood,
        zip_code: form.zip_code,
        public_description: form.public_description,
        notes: form.notes,
        maintenance_fee_monthly: Number(normalizeNumberInput(form.maintenance_fee_monthly)),
        accepts_whatsapp_contact: form.accepts_whatsapp_contact,
        receives_leads: form.receives_leads,
        has_contract_template: form.has_contract_template,
        active: form.active,
      };

      const response = await fetch("/api/companies", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let parsed: SaveResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as SaveResponse;
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
            "Não foi possível salvar a edição da empresa."
        );
      }

      if (parsed.company) {
        setForm(companyToForm(parsed.company));
      }

      setSuccess(parsed.message || "Empresa atualizada com sucesso.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao salvar a empresa."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  const publicPreviewName = useMemo(() => {
    return (
      form.trade_name.trim() ||
      form.corporate_name.trim() ||
      form.primary_email.trim() ||
      "Empresa sem nome"
    );
  }, [form.trade_name, form.corporate_name, form.primary_email]);

  const slugPreview = useMemo(() => buildSlugPreview(form), [form]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f7fbff_45%,#ffffff_100%)] p-6 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-cyan-100 bg-white p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
          Carregando edição da empresa...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f7fbff_45%,#ffffff_100%)] text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/90 shadow-[0_20px_70px_rgba(14,30,37,0.10)]">
          <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(96,165,250,0.20),transparent_24%),linear-gradient(135deg,#f0fbff_0%,#edf7ff_55%,#f9fdff_100%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-700">
                  Aurora IA
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Editar empresa
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Seminovos Locadoras
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Complete os dados comerciais e operacionais para fortalecer a
                  listagem, a página pública e o slug premium da empresa.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/seminovos-locadoras/empresas"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Voltar para empresas
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/seminovos-locadoras/empresa/${slugPreview}`)
                  }
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                >
                  Ver página pública
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={handleSubmit} className="grid gap-6">
              {error ? (
                <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                  {success}
                </div>
              ) : null}

              <Card title="Slug premium">
                <div className="grid gap-4">
                  <TextInput
                    label="Slug público"
                    value={form.slug}
                    onChange={(value) => updateField("slug", slugifyInput(value))}
                    placeholder="ex.: aurora-ia-teste-lagoa-santa-mg-68bbad26"
                  />

                  <div className="rounded-[22px] border border-cyan-100 bg-[#fbfeff] p-4">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
                      Prévia da rota pública
                    </div>
                    <div className="mt-2 break-all text-sm font-semibold text-slate-900">
                      /seminovos-locadoras/empresa/{slugPreview}
                    </div>
                  </div>

                  <p className="text-sm text-slate-500">
                    Você pode editar o slug manualmente. Se deixar vazio, o sistema
                    continua montando automaticamente com nome, cidade, estado e ID.
                  </p>
                </div>
              </Card>

              <Card title="Dados principais">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tipo de empresa">
                    <select
                      value={form.company_type}
                      onChange={(e) => updateField("company_type", e.target.value)}
                      className={inputClassName}
                    >
                      <option value="locadora">Locadora</option>
                      <option value="revenda">Revenda</option>
                      <option value="concessionaria">Concessionária</option>
                      <option value="lojista">Lojista</option>
                    </select>
                  </Field>

                  <TextInput
                    label="CNPJ"
                    value={form.cnpj}
                    onChange={(value) => updateField("cnpj", value)}
                    placeholder="00.000.000/0001-00"
                  />

                  <TextInput
                    label="Razão social"
                    value={form.corporate_name}
                    onChange={(value) => updateField("corporate_name", value)}
                    placeholder="Nome jurídico da empresa"
                  />

                  <TextInput
                    label="Nome fantasia"
                    value={form.trade_name}
                    onChange={(value) => updateField("trade_name", value)}
                    placeholder="Nome comercial"
                  />

                  <TextInput
                    label="Inscrição estadual"
                    value={form.state_registration}
                    onChange={(value) => updateField("state_registration", value)}
                    placeholder="Opcional"
                  />

                  <TextInput
                    label="Responsável comercial"
                    value={form.commercial_contact_name}
                    onChange={(value) =>
                      updateField("commercial_contact_name", value)
                    }
                    placeholder="Nome do responsável"
                  />

                  <TextInput
                    label="CPF do responsável"
                    value={form.commercial_contact_cpf}
                    onChange={(value) =>
                      updateField("commercial_contact_cpf", value)
                    }
                    placeholder="000.000.000-00"
                  />

                  <TextInput
                    label="WhatsApp comercial"
                    value={form.commercial_whatsapp}
                    onChange={(value) =>
                      updateField("commercial_whatsapp", value)
                    }
                    placeholder="(31) 99999-9999"
                  />

                  <TextInput
                    label="E-mail principal"
                    value={form.primary_email}
                    onChange={(value) => updateField("primary_email", value)}
                    placeholder="contato@empresa.com"
                    type="email"
                  />

                  <TextInput
                    label="Site"
                    value={form.website}
                    onChange={(value) => updateField("website", value)}
                    placeholder="https://empresa.com.br"
                  />
                </div>
              </Card>

              <Card title="Localização e apresentação">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Cidade"
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                    placeholder="Belo Horizonte"
                  />

                  <TextInput
                    label="Estado"
                    value={form.state}
                    onChange={(value) => updateField("state", value)}
                    placeholder="MG"
                  />

                  <TextInput
                    label="Bairro"
                    value={form.neighborhood}
                    onChange={(value) => updateField("neighborhood", value)}
                    placeholder="Centro"
                  />

                  <TextInput
                    label="CEP"
                    value={form.zip_code}
                    onChange={(value) => updateField("zip_code", value)}
                    placeholder="00000-000"
                  />

                  <TextInput
                    label="Endereço"
                    value={form.address}
                    onChange={(value) => updateField("address", value)}
                    placeholder="Rua, avenida..."
                  />

                  <TextInput
                    label="Número"
                    value={form.address_number}
                    onChange={(value) => updateField("address_number", value)}
                    placeholder="123"
                  />
                </div>

                <div className="mt-4">
                  <TextArea
                    label="Descrição pública"
                    value={form.public_description}
                    onChange={(value) => updateField("public_description", value)}
                    placeholder="Descreva a empresa de forma comercial e objetiva."
                    rows={5}
                  />
                </div>
              </Card>

              <Card title="Camada interna e comercial">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Mensalidade"
                    value={form.maintenance_fee_monthly}
                    onChange={(value) =>
                      updateField("maintenance_fee_monthly", value)
                    }
                    placeholder="49,90"
                  />

                  <div className="rounded-[22px] border border-cyan-100 bg-[#fbfeff] p-4">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
                      Prévia da mensalidade
                    </div>
                    <div className="mt-2 text-lg font-black text-slate-900">
                      {formatMoneyPreview(form.maintenance_fee_monthly)}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <TextArea
                    label="Observações internas"
                    value={form.notes}
                    onChange={(value) => updateField("notes", value)}
                    placeholder="Observações internas, operação, negociação, detalhes do cadastro..."
                    rows={5}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Toggle
                    label="Aceita contato por WhatsApp"
                    checked={form.accepts_whatsapp_contact}
                    onChange={(value) =>
                      updateField("accepts_whatsapp_contact", value)
                    }
                  />

                  <Toggle
                    label="Recebe leads"
                    checked={form.receives_leads}
                    onChange={(value) => updateField("receives_leads", value)}
                  />

                  <Toggle
                    label="Possui contrato modelo"
                    checked={form.has_contract_template}
                    onChange={(value) =>
                      updateField("has_contract_template", value)
                    }
                  />

                  <Toggle
                    label="Empresa ativa"
                    checked={form.active}
                    onChange={(value) => updateField("active", value)}
                  />
                </div>
              </Card>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Salvando..." : "Salvar empresa"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/seminovos-locadoras/empresa/${slugPreview}`)
                  }
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Ver página pública
                </button>
              </div>
            </form>

            <div className="grid gap-6">
              <Card title="Prévia comercial">
                <div className="rounded-[24px] border border-cyan-100 bg-white p-5 shadow-[0_8px_20px_rgba(14,30,37,0.04)]">
                  <div className="mb-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                    {form.company_type || "Empresa"}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">
                    {publicPreviewName}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-cyan-700">
                    {form.city || "Cidade"}
                    {form.city || form.state ? " • " : ""}
                    {form.state || "UF"}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {form.public_description ||
                      "Sua descrição pública vai aparecer aqui assim que for preenchida."}
                  </p>
                </div>
              </Card>

              <Card title="Slug final da empresa">
                <div className="break-all text-sm font-mono text-slate-700">
                  {slugPreview || "Ainda não gerado"}
                </div>
              </Card>

              <Card title="ID da empresa">
                <div className="break-all text-sm font-mono text-slate-500">
                  {form.id || companyId || "Não identificado"}
                </div>
              </Card>

              <Card title="Objetivo desta etapa">
                <ul className="grid gap-2 text-sm text-slate-600">
                  <li>• completar dados comerciais da empresa</li>
                  <li>• melhorar a listagem pública</li>
                  <li>• deixar a página pública mais forte</li>
                  <li>• permitir controlar o slug manualmente</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClassName} min-h-[120px] resize-y py-3`}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[22px] border border-cyan-100 bg-[#fbfeff] p-4">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-cyan-500"
      />
    </label>
  );
}