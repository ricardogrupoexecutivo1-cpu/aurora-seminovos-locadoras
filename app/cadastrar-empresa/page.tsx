"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type CompanyFormData = {
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
  accepts_whatsapp_contact: boolean;
  receives_leads: boolean;
  has_contract_template: boolean;
  notes: string;
};

type SaveCompanyResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

type CnpjLookupResponse = {
  success?: boolean;
  message?: string;
  source?: string;
  fallback_from?: string;
  data?: Partial<CompanyFormData> & {
    source_status?: string | null;
    company_nature?: string | null;
    company_size?: string | null;
    main_activity?: string | null;
  };
  attempts?: Array<{
    source: string;
    status: number;
    message: string;
  }>;
};

const initialFormData: CompanyFormData = {
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
  accepts_whatsapp_contact: true,
  receives_leads: true,
  has_contract_template: false,
  notes: "",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

function isValidLookupCnpj(value: string) {
  return onlyDigits(value).length === 14;
}

export default function CadastrarEmpresaPage() {
  const [formData, setFormData] = useState<CompanyFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const [lookupDetails, setLookupDetails] = useState("");
  const [lookupSource, setLookupSource] = useState("");

  const canLookupCnpj = useMemo(
    () => isValidLookupCnpj(formData.cnpj),
    [formData.cnpj]
  );

  function updateField<K extends keyof CompanyFormData>(
    field: K,
    value: CompanyFormData[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function applyLookupData(data?: CnpjLookupResponse["data"]) {
    if (!data) return;

    setFormData((current) => ({
      ...current,
      cnpj: data.cnpj ? formatCnpj(data.cnpj) : current.cnpj,
      corporate_name: data.corporate_name || current.corporate_name,
      trade_name: data.trade_name || current.trade_name,
      primary_email: data.primary_email || current.primary_email,
      commercial_whatsapp:
        data.commercial_whatsapp || current.commercial_whatsapp,
      city: data.city || current.city,
      state: data.state || current.state,
      address: data.address || current.address,
      address_number: data.address_number || current.address_number,
      neighborhood: data.neighborhood || current.neighborhood,
      zip_code: data.zip_code ? formatCep(data.zip_code) : current.zip_code,
      public_description:
        data.public_description || current.public_description,
      notes: [
        current.notes,
        data.main_activity ? `Atividade principal: ${data.main_activity}` : "",
        data.source_status
          ? `Situação cadastral: ${data.source_status}`
          : "",
        data.company_nature
          ? `Natureza jurídica: ${data.company_nature}`
          : "",
        data.company_size ? `Porte: ${data.company_size}` : "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim(),
    }));
  }

  async function handleLookupCnpj() {
    try {
      setLookupLoading(true);
      setLookupMessage("");
      setLookupDetails("");
      setLookupSource("");
      setErrorMessage("");
      setSuccessMessage("");

      const digits = onlyDigits(formData.cnpj);

      if (digits.length !== 14) {
        setLookupMessage("Informe um CNPJ válido com 14 dígitos para consulta.");
        return;
      }

      const response = await fetch(`/api/cnpj/${digits}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      });

      const rawText = await response.text();
      let parsed: CnpjLookupResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as CnpjLookupResponse;
        } catch {
          throw new Error(
            `A consulta do CNPJ respondeu em formato inesperado: ${rawText.slice(
              0,
              220
            )}`
          );
        }
      }

      if (!response.ok || !parsed?.success) {
        const attemptsText =
          parsed?.attempts && parsed.attempts.length > 0
            ? parsed.attempts
                .map(
                  (item) => `${item.source} (${item.status}): ${item.message}`
                )
                .join(" | ")
            : "";

        setLookupMessage(
          parsed?.message || "Não foi possível consultar o CNPJ informado."
        );
        setLookupDetails(attemptsText);
        return;
      }

      applyLookupData(parsed.data);
      setLookupSource(
        parsed.fallback_from
          ? `${parsed.source} (fallback após ${parsed.fallback_from})`
          : parsed.source || ""
      );
      setLookupMessage(parsed.message || "CNPJ consultado com sucesso.");
      setLookupDetails(
        "Dados preenchidos automaticamente. Você ainda pode editar tudo."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao consultar CNPJ.";
      setLookupMessage(message);
      setLookupDetails("");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        ...formData,
        cnpj: onlyDigits(formData.cnpj),
        commercial_contact_cpf: onlyDigits(formData.commercial_contact_cpf),
        zip_code: onlyDigits(formData.zip_code),
      };

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let parsed: SaveCompanyResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as SaveCompanyResponse;
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
            "Não foi possível salvar a empresa."
        );
      }

      setSuccessMessage(parsed.message || "Empresa salva com sucesso.");
      setErrorMessage("");
      setLookupMessage("");
      setLookupDetails("");
      setLookupSource("");
      setFormData(initialFormData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao salvar empresa.";
      setErrorMessage(message);
      setSuccessMessage("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f7fbff_45%,#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute right-[-80px] top-[20px] h-[280px] w-[280px] rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute left-[25%] top-[220px] h-[240px] w-[240px] rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white/88 shadow-[0_20px_70px_rgba(14,30,37,0.10)] backdrop-blur">
          <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_right,rgba(96,165,250,0.20),transparent_24%),linear-gradient(135deg,#f0fbff_0%,#edf7ff_55%,#f9fdff_100%)] px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-700">
                  Aurora IA
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Cadastrar empresa
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Base comercial completa • Seminovos Locadoras
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Cadastro empresarial com leitura automática por CNPJ e edição
                  total depois do preenchimento. Sistema em constante atualização
                  e pode haver momentos de instabilidade durante melhorias.
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
                  href="/seminovos-locadoras/empresas"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                >
                  Ver empresas
                </Link>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid gap-6">
              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Dados principais da empresa
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Agora essa tela salva de verdade no Supabase e já pode buscar
                  dados por CNPJ antes de salvar.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Tipo de empresa">
                    <select
                      value={formData.company_type}
                      onChange={(event) =>
                        updateField("company_type", event.target.value)
                      }
                      className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                    >
                      <option value="locadora">Locadora</option>
                      <option value="revenda">Revenda</option>
                      <option value="concessionaria">Concessionária</option>
                      <option value="lojista">Lojista</option>
                    </select>
                  </Field>

                  <Field label="CNPJ">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={formData.cnpj}
                        onChange={(event) =>
                          updateField("cnpj", formatCnpj(event.target.value))
                        }
                        placeholder="Ex.: 00.000.000/0001-00"
                        className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                      />

                      <button
                        type="button"
                        onClick={() => void handleLookupCnpj()}
                        disabled={!canLookupCnpj || lookupLoading}
                        className="inline-flex min-w-[190px] items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {lookupLoading ? "Buscando..." : "Buscar na Receita"}
                      </button>
                    </div>

                    {lookupMessage ? (
                      <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                        <div className="font-bold">{lookupMessage}</div>
                        {lookupSource ? (
                          <div className="mt-1 text-cyan-700">
                            Fonte: {lookupSource}
                          </div>
                        ) : null}
                        {lookupDetails ? (
                          <div className="mt-1 text-cyan-700">
                            {lookupDetails}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </Field>

                  <Field label="Razão social">
                    <input
                      value={formData.corporate_name}
                      onChange={(event) =>
                        updateField("corporate_name", event.target.value)
                      }
                      placeholder="Ex.: Seminovos Brasil Frotas Ltda"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Nome fantasia">
                    <input
                      value={formData.trade_name}
                      onChange={(event) =>
                        updateField("trade_name", event.target.value)
                      }
                      placeholder="Ex.: Aurora Seminovos"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Inscrição estadual">
                    <input
                      value={formData.state_registration}
                      onChange={(event) =>
                        updateField("state_registration", event.target.value)
                      }
                      placeholder="Ex.: 123456789"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Responsável comercial">
                    <input
                      value={formData.commercial_contact_name}
                      onChange={(event) =>
                        updateField("commercial_contact_name", event.target.value)
                      }
                      placeholder="Ex.: Ricardo Leonardo Moreira"
                      className="input-base"
                    />
                  </Field>

                  <Field label="CPF do responsável">
                    <input
                      value={formData.commercial_contact_cpf}
                      onChange={(event) =>
                        updateField(
                          "commercial_contact_cpf",
                          formatCpf(event.target.value)
                        )
                      }
                      placeholder="Ex.: 000.000.000-00"
                      className="input-base"
                    />
                  </Field>

                  <Field label="WhatsApp comercial">
                    <input
                      value={formData.commercial_whatsapp}
                      onChange={(event) =>
                        updateField("commercial_whatsapp", event.target.value)
                      }
                      placeholder="Ex.: (31) 99999-9999"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail principal">
                    <input
                      type="email"
                      value={formData.primary_email}
                      onChange={(event) =>
                        updateField("primary_email", event.target.value)
                      }
                      placeholder="Ex.: comercial@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail adicional 1">
                    <input
                      type="email"
                      value={formData.secondary_email_1}
                      onChange={(event) =>
                        updateField("secondary_email_1", event.target.value)
                      }
                      placeholder="Ex.: financeiro@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail adicional 2">
                    <input
                      type="email"
                      value={formData.secondary_email_2}
                      onChange={(event) =>
                        updateField("secondary_email_2", event.target.value)
                      }
                      placeholder="Ex.: frota@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail adicional 3">
                    <input
                      type="email"
                      value={formData.secondary_email_3}
                      onChange={(event) =>
                        updateField("secondary_email_3", event.target.value)
                      }
                      placeholder="Ex.: vendas@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail adicional 4">
                    <input
                      type="email"
                      value={formData.secondary_email_4}
                      onChange={(event) =>
                        updateField("secondary_email_4", event.target.value)
                      }
                      placeholder="Ex.: contratos@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail adicional 5">
                    <input
                      type="email"
                      value={formData.secondary_email_5}
                      onChange={(event) =>
                        updateField("secondary_email_5", event.target.value)
                      }
                      placeholder="Ex.: suporte@empresa.com.br"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Site">
                    <input
                      value={formData.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                      placeholder="Ex.: https://empresa.com.br"
                      className="input-base"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Endereço e descrição pública
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Cidade">
                    <input
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      placeholder="Ex.: Belo Horizonte"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Estado">
                    <input
                      value={formData.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      placeholder="Ex.: MG"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Endereço">
                    <input
                      value={formData.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="Ex.: Rua Tebas"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Número">
                    <input
                      value={formData.address_number}
                      onChange={(event) =>
                        updateField("address_number", event.target.value)
                      }
                      placeholder="Ex.: 223"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Bairro">
                    <input
                      value={formData.neighborhood}
                      onChange={(event) =>
                        updateField("neighborhood", event.target.value)
                      }
                      placeholder="Ex.: Vera Cruz"
                      className="input-base"
                    />
                  </Field>

                  <Field label="CEP">
                    <input
                      value={formData.zip_code}
                      onChange={(event) =>
                        updateField("zip_code", formatCep(event.target.value))
                      }
                      placeholder="Ex.: 30285-300"
                      className="input-base"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Descrição pública">
                    <textarea
                      value={formData.public_description}
                      onChange={(event) =>
                        updateField("public_description", event.target.value)
                      }
                      placeholder="Descreva de forma comercial a empresa para exibição pública."
                      rows={4}
                      className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Observações internas">
                    <textarea
                      value={formData.notes}
                      onChange={(event) => updateField("notes", event.target.value)}
                      placeholder="Observações internas, detalhes comerciais, anotações e ajustes."
                      rows={5}
                      className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Configurações comerciais
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ToggleCard
                    title="Aceita contato por WhatsApp"
                    checked={formData.accepts_whatsapp_contact}
                    onChange={(checked) =>
                      updateField("accepts_whatsapp_contact", checked)
                    }
                  />

                  <ToggleCard
                    title="Recebe leads"
                    checked={formData.receives_leads}
                    onChange={(checked) => updateField("receives_leads", checked)}
                  />

                  <ToggleCard
                    title="Possui contrato modelo"
                    checked={formData.has_contract_template}
                    onChange={(checked) =>
                      updateField("has_contract_template", checked)
                    }
                  />
                </div>
              </section>

              {successMessage ? (
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar empresa"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormData);
                    setSuccessMessage("");
                    setErrorMessage("");
                    setLookupMessage("");
                    setLookupDetails("");
                    setLookupSource("");
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Limpar formulário
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <style jsx global>{`
        .input-base {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #cfeff9;
          background: #f8fcff;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-base:focus {
          border-color: #22c7ee;
          background: #ffffff;
        }
      `}</style>
    </main>
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
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleCard({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-[24px] border p-5 text-left transition ${
        checked
          ? "border-cyan-200 bg-cyan-50"
          : "border-cyan-100 bg-[#fbfeff]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-500">
            {checked ? "Ativado" : "Desativado"}
          </div>
        </div>

        <div
          className={`h-7 w-12 rounded-full border transition ${
            checked
              ? "border-cyan-400 bg-cyan-500"
              : "border-slate-200 bg-slate-200"
          }`}
        >
          <div
            className={`mt-[2px] h-5 w-5 rounded-full bg-white shadow transition ${
              checked ? "ml-6" : "ml-1"
            }`}
          />
        </div>
      </div>
    </button>
  );
}