"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type BuyerFormData = {
  nome: string;
  cpf: string;
  whatsapp: string;
  email: string;
  marca_desejada: string;
  modelo_desejado: string;
  ano_desejado: string;
  tipo_compra: string;
  preco_minimo: string;
  preco_maximo: string;
  percentual_abaixo_fipe_min: string;
  percentual_abaixo_fipe_max: string;
  regiao: string;
  cidade: string;
  estado: string;
  vendedor_preferido: string;
  observacoes: string;
  receber_novos_veiculos: boolean;
  aceita_whatsapp: boolean;
  active: boolean;
};

type SaveBuyerResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
  buyer?: {
    id: string;
  };
};

const initialFormData: BuyerFormData = {
  nome: "",
  cpf: "",
  whatsapp: "",
  email: "",
  marca_desejada: "",
  modelo_desejado: "",
  ano_desejado: "",
  tipo_compra: "Todos",
  preco_minimo: "",
  preco_maximo: "",
  percentual_abaixo_fipe_min: "",
  percentual_abaixo_fipe_max: "",
  regiao: "",
  cidade: "",
  estado: "",
  vendedor_preferido: "Todos",
  observacoes: "",
  receber_novos_veiculos: true,
  aceita_whatsapp: true,
  active: true,
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatWhatsapp(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCPF(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(cpf[i]) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(cpf[i]) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === Number(cpf[10]);
}

function normalizeNumberInput(value: string) {
  const clean = value.replace(",", ".").trim();
  if (!clean) return null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildFriendlyError(parsed: SaveBuyerResponse | null) {
  const rawMessage = parsed?.message || parsed?.error || "Erro ao salvar comprador.";
  const joined = [
    rawMessage,
    parsed?.details || "",
    parsed?.hint || "",
    parsed?.code || "",
  ]
    .join(" | ")
    .toLowerCase();

  if (joined.includes("duplicate") || joined.includes("duplic")) {
    return "Já existe um comprador cadastrado com este CPF ou dado único.";
  }

  if (joined.includes("cpf")) {
    return "CPF inválido ou já utilizado. Verifique os dados informados.";
  }

  if (joined.includes("tipo_compra")) {
    return "Tipo de compra inválido para a regra atual da base.";
  }

  return rawMessage;
}

export default function CompradoresPage() {
  const [formData, setFormData] = useState<BuyerFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const cpfDigits = useMemo(() => onlyDigits(formData.cpf), [formData.cpf]);

  const cpfStatus = useMemo(() => {
    if (!cpfDigits) {
      return {
        valid: false,
        show: false,
        message: "",
      };
    }

    if (cpfDigits.length < 11) {
      return {
        valid: false,
        show: true,
        message: "Digite os 11 números do CPF.",
      };
    }

    if (!isValidCPF(formData.cpf)) {
      return {
        valid: false,
        show: true,
        message: "CPF inválido. Verifique os dados informados.",
      };
    }

    return {
      valid: true,
      show: true,
      message: "CPF válido para envio.",
    };
  }, [cpfDigits, formData.cpf]);

  function updateField<K extends keyof BuyerFormData>(
    field: K,
    value: BuyerFormData[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      if (!formData.nome.trim()) {
        setErrorMessage("Nome completo é obrigatório.");
        return;
      }

      if (!cpfStatus.valid) {
        setErrorMessage(
          cpfStatus.message || "CPF inválido. Verifique os dados informados."
        );
        return;
      }

      const payload = {
        nome: formData.nome.trim(),
        cpf: onlyDigits(formData.cpf),
        whatsapp: onlyDigits(formData.whatsapp),
        email: formData.email.trim(),
        marca_desejada: formData.marca_desejada.trim(),
        modelo_desejado: formData.modelo_desejado.trim(),
        ano_desejado: formData.ano_desejado.trim(),
        tipo_compra: formData.tipo_compra.trim(),
        preco_minimo: normalizeNumberInput(formData.preco_minimo),
        preco_maximo: normalizeNumberInput(formData.preco_maximo),
        percentual_abaixo_fipe_min: normalizeNumberInput(
          formData.percentual_abaixo_fipe_min
        ),
        percentual_abaixo_fipe_max: normalizeNumberInput(
          formData.percentual_abaixo_fipe_max
        ),
        regiao: formData.regiao.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim(),
        vendedor_preferido: formData.vendedor_preferido.trim(),
        observacoes: formData.observacoes.trim(),
        receber_novos_veiculos: formData.receber_novos_veiculos,
        aceita_whatsapp: formData.aceita_whatsapp,
        active: formData.active,
      };

      const response = await fetch("/api/buyers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let parsed: SaveBuyerResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as SaveBuyerResponse;
        } catch {
          throw new Error(
            `A API respondeu em formato inesperado: ${rawText.slice(0, 220)}`
          );
        }
      }

      if (!response.ok || !parsed?.success) {
        throw new Error(buildFriendlyError(parsed));
      }

      setSuccessMessage(parsed.message || "Comprador cadastrado com sucesso.");
      setErrorMessage("");
      setFormData(initialFormData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao salvar comprador.";

      setErrorMessage(message);
      setSuccessMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
                  Compradores
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Cadastro de compradores pessoa física e jurídica
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Estrutura pronta para compradores com CPF, preferências de compra
                  e edição posterior, no padrão memoriol mais caro do mundo.
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

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Dados do comprador
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Nome completo">
                    <input
                      value={formData.nome}
                      onChange={(event) => updateField("nome", event.target.value)}
                      placeholder="Nome do comprador"
                      className="input-base"
                    />
                  </Field>

                  <Field label="CPF">
                    <input
                      value={formData.cpf}
                      onChange={(event) =>
                        updateField("cpf", formatCpf(event.target.value))
                      }
                      placeholder="000.000.000-00"
                      className={`input-base ${
                        cpfStatus.show
                          ? cpfStatus.valid
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-red-300 bg-red-50"
                          : ""
                      }`}
                    />
                    {cpfStatus.show ? (
                      <div
                        className={`mt-2 text-sm font-semibold ${
                          cpfStatus.valid ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {cpfStatus.message}
                      </div>
                    ) : null}
                  </Field>

                  <Field label="WhatsApp">
                    <input
                      value={formData.whatsapp}
                      onChange={(event) =>
                        updateField("whatsapp", formatWhatsapp(event.target.value))
                      }
                      placeholder="Ex.: (31) 99999-9999"
                      className="input-base"
                    />
                  </Field>

                  <Field label="E-mail">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="Ex.: comprador@email.com"
                      className="input-base"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Preferências de compra
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Marca desejada">
                    <input
                      value={formData.marca_desejada}
                      onChange={(event) =>
                        updateField("marca_desejada", event.target.value)
                      }
                      placeholder="Ex.: Toyota"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Modelo desejado">
                    <input
                      value={formData.modelo_desejado}
                      onChange={(event) =>
                        updateField("modelo_desejado", event.target.value)
                      }
                      placeholder="Ex.: Corolla"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Ano desejado">
                    <input
                      value={formData.ano_desejado}
                      onChange={(event) =>
                        updateField("ano_desejado", event.target.value)
                      }
                      placeholder="Ex.: 2022 a 2024"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Tipo de compra">
                    <select
                      value={formData.tipo_compra}
                      onChange={(event) =>
                        updateField("tipo_compra", event.target.value)
                      }
                      className="input-base"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                    </select>
                  </Field>

                  <Field label="Preço mínimo">
                    <input
                      value={formData.preco_minimo}
                      onChange={(event) =>
                        updateField("preco_minimo", event.target.value)
                      }
                      placeholder="Ex.: 50000"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Preço máximo">
                    <input
                      value={formData.preco_maximo}
                      onChange={(event) =>
                        updateField("preco_maximo", event.target.value)
                      }
                      placeholder="Ex.: 100000"
                      className="input-base"
                    />
                  </Field>

                  <Field label="% abaixo da FIPE mínimo">
                    <input
                      value={formData.percentual_abaixo_fipe_min}
                      onChange={(event) =>
                        updateField(
                          "percentual_abaixo_fipe_min",
                          event.target.value
                        )
                      }
                      placeholder="Ex.: 5"
                      className="input-base"
                    />
                  </Field>

                  <Field label="% abaixo da FIPE máximo">
                    <input
                      value={formData.percentual_abaixo_fipe_max}
                      onChange={(event) =>
                        updateField(
                          "percentual_abaixo_fipe_max",
                          event.target.value
                        )
                      }
                      placeholder="Ex.: 20"
                      className="input-base"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <h2 className="text-xl font-black text-slate-900">
                  Região e preferências comerciais
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Região">
                    <input
                      value={formData.regiao}
                      onChange={(event) => updateField("regiao", event.target.value)}
                      placeholder="Ex.: Grande BH"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Cidade">
                    <input
                      value={formData.cidade}
                      onChange={(event) => updateField("cidade", event.target.value)}
                      placeholder="Ex.: Belo Horizonte"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Estado">
                    <input
                      value={formData.estado}
                      onChange={(event) => updateField("estado", event.target.value)}
                      placeholder="Ex.: MG"
                      className="input-base"
                    />
                  </Field>

                  <Field label="Vendedor preferido">
                    <select
                      value={formData.vendedor_preferido}
                      onChange={(event) =>
                        updateField("vendedor_preferido", event.target.value)
                      }
                      className="input-base"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Locadora">Locadora</option>
                      <option value="Revenda">Revenda</option>
                      <option value="Concessionária">Concessionária</option>
                      <option value="Lojista">Lojista</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Observações">
                    <textarea
                      value={formData.observacoes}
                      onChange={(event) =>
                        updateField("observacoes", event.target.value)
                      }
                      placeholder="Perfil do comprador, urgência, preferências, observações comerciais."
                      rows={5}
                      className="input-base min-h-[120px] resize-y py-3"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <div className="grid gap-4 md:grid-cols-2">
                  <ToggleCard
                    title="Receber novos veículos"
                    checked={formData.receber_novos_veiculos}
                    onChange={(checked) =>
                      updateField("receber_novos_veiculos", checked)
                    }
                  />

                  <ToggleCard
                    title="Aceita contato por WhatsApp"
                    checked={formData.aceita_whatsapp}
                    onChange={(checked) =>
                      updateField("aceita_whatsapp", checked)
                    }
                  />
                </div>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar comprador"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormData);
                    setSuccessMessage("");
                    setErrorMessage("");
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