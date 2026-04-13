"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BuyerItem = {
  id: string;
  nome?: string | null;
  cpf?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  marca_desejada?: string | null;
  modelo_desejado?: string | null;
  ano_desejado?: string | null;
  preco_minimo?: number | null;
  preco_maximo?: number | null;
  regiao?: string | null;
  cidade?: string | null;
  estado?: string | null;
  vendedor_preferido?: string | null;
  tipo_compra?: string | null;
  percentual_abaixo_fipe_min?: number | null;
  percentual_abaixo_fipe_max?: number | null;
  receber_novos_veiculos?: boolean | null;
  aceita_whatsapp?: boolean | null;
  observacoes?: string | null;
  active?: boolean | null;
};

type BuyersApiResponse = {
  success?: boolean;
  buyers?: BuyerItem[];
  message?: string;
  error?: string;
};

const emptyBuyer: BuyerItem = {
  id: "",
  nome: "",
  cpf: "",
  whatsapp: "",
  email: "",
  marca_desejada: "",
  modelo_desejado: "",
  ano_desejado: "",
  preco_minimo: null,
  preco_maximo: null,
  regiao: "",
  cidade: "",
  estado: "",
  vendedor_preferido: "todos",
  tipo_compra: "todos",
  percentual_abaixo_fipe_min: null,
  percentual_abaixo_fipe_max: null,
  receber_novos_veiculos: true,
  aceita_whatsapp: true,
  observacoes: "",
  active: true,
};

function onlyDigits(value?: string | null) {
  return (value || "").replace(/\D/g, "");
}

function formatCpf(value?: string | null) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function isValidCpf(value?: string | null) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(cpf[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(cpf[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;

  return remainder === Number(cpf[10]);
}

function parseNullableNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function EditarCompradorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [buyerId, setBuyerId] = useState("");
  const [data, setData] = useState<BuyerItem>(emptyBuyer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveParams() {
      try {
        const resolved = await params;
        if (!isMounted) return;
        setBuyerId(resolved.id || "");
      } catch {
        if (!isMounted) return;
        setError("Não foi possível identificar o comprador.");
        setLoading(false);
      }
    }

    void resolveParams();

    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    if (!buyerId) return;

    async function loadBuyer() {
      try {
        setLoading(true);
        setError("");
        setMessage("");
        setNotFound(false);

        const response = await fetch("/api/buyers", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        });

        const rawText = await response.text();
        let parsed: BuyersApiResponse | null = null;

        if (rawText.trim()) {
          try {
            parsed = JSON.parse(rawText) as BuyersApiResponse;
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
              "Não foi possível carregar o comprador."
          );
        }

        const buyers = Array.isArray(parsed.buyers) ? parsed.buyers : [];
        const found = buyers.find((buyer) => buyer.id === buyerId);

        if (!found) {
          setNotFound(true);
          setData({
            ...emptyBuyer,
            id: buyerId,
          });
          return;
        }

        setData({
          ...emptyBuyer,
          ...found,
          id: found.id || buyerId,
          cpf: formatCpf(found.cpf),
        });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao carregar comprador.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    void loadBuyer();
  }, [buyerId]);

  function updateField<K extends keyof BuyerItem>(field: K, value: BuyerItem[K]) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (onlyDigits(data.cpf).length > 0 && !isValidCpf(data.cpf)) {
        throw new Error("Informe um CPF válido para o comprador.");
      }

      const payload = {
        ...data,
        id: buyerId,
        cpf: onlyDigits(data.cpf),
        preco_minimo:
          typeof data.preco_minimo === "number"
            ? data.preco_minimo
            : parseNullableNumber(String(data.preco_minimo ?? "")),
        preco_maximo:
          typeof data.preco_maximo === "number"
            ? data.preco_maximo
            : parseNullableNumber(String(data.preco_maximo ?? "")),
        percentual_abaixo_fipe_min:
          typeof data.percentual_abaixo_fipe_min === "number"
            ? data.percentual_abaixo_fipe_min
            : parseNullableNumber(String(data.percentual_abaixo_fipe_min ?? "")),
        percentual_abaixo_fipe_max:
          typeof data.percentual_abaixo_fipe_max === "number"
            ? data.percentual_abaixo_fipe_max
            : parseNullableNumber(String(data.percentual_abaixo_fipe_max ?? "")),
      };

      const response = await fetch("/api/buyers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let parsed: { success?: boolean; message?: string; error?: string } | null =
        null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as {
            success?: boolean;
            message?: string;
            error?: string;
          };
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
            "Não foi possível salvar o comprador."
        );
      }

      setMessage(parsed.message || "Comprador atualizado com sucesso.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao atualizar comprador.";
      setError(msg);
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
                  Editar comprador
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Atualização cadastral • Compradores
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Ajuste os dados do comprador sem perder o padrão memoriol.
                  Sistema em constante atualização e pode haver momentos de
                  instabilidade durante melhorias.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/compradores/lista"
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Voltar para lista
                </Link>

                <Link
                  href="/compradores"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                >
                  Novo comprador
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="rounded-[24px] border border-cyan-100 bg-cyan-50 p-6 text-sm font-semibold text-cyan-700">
                Carregando dados do comprador...
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : notFound ? (
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-700">
                Comprador não encontrado para este ID.
              </div>
            ) : (
              <div className="grid gap-6">
                <section className="rounded-[28px] border border-cyan-100 bg-white/92 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                  <h2 className="text-xl font-black text-slate-900">
                    Dados do comprador
                  </h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field label="Nome completo">
                      <input
                        value={data.nome || ""}
                        onChange={(event) => updateField("nome", event.target.value)}
                        className="input-base"
                      />
                    </Field>

                    <Field label="CPF">
                      <input
                        value={data.cpf || ""}
                        onChange={(event) =>
                          updateField("cpf", formatCpf(event.target.value))
                        }
                        className={`input-base ${
                          onlyDigits(data.cpf).length > 0 && !isValidCpf(data.cpf)
                            ? "border-red-300 bg-red-50"
                            : ""
                        }`}
                      />
                    </Field>

                    <Field label="WhatsApp">
                      <input
                        value={data.whatsapp || ""}
                        onChange={(event) =>
                          updateField("whatsapp", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="E-mail">
                      <input
                        value={data.email || ""}
                        onChange={(event) => updateField("email", event.target.value)}
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
                        value={data.marca_desejada || ""}
                        onChange={(event) =>
                          updateField("marca_desejada", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Modelo desejado">
                      <input
                        value={data.modelo_desejado || ""}
                        onChange={(event) =>
                          updateField("modelo_desejado", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Ano desejado">
                      <input
                        value={data.ano_desejado || ""}
                        onChange={(event) =>
                          updateField("ano_desejado", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Tipo de compra">
                      <select
                        value={data.tipo_compra || "todos"}
                        onChange={(event) =>
                          updateField("tipo_compra", event.target.value)
                        }
                        className="input-base"
                      >
                        <option value="todos">Todos</option>
                        <option value="unidade">Unidade</option>
                        <option value="frota">Frota</option>
                      </select>
                    </Field>

                    <Field label="Preço mínimo">
                      <input
                        value={data.preco_minimo ?? ""}
                        onChange={(event) =>
                          updateField(
                            "preco_minimo",
                            parseNullableNumber(event.target.value)
                          )
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Preço máximo">
                      <input
                        value={data.preco_maximo ?? ""}
                        onChange={(event) =>
                          updateField(
                            "preco_maximo",
                            parseNullableNumber(event.target.value)
                          )
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="% abaixo da FIPE mínimo">
                      <input
                        value={data.percentual_abaixo_fipe_min ?? ""}
                        onChange={(event) =>
                          updateField(
                            "percentual_abaixo_fipe_min",
                            parseNullableNumber(event.target.value)
                          )
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="% abaixo da FIPE máximo">
                      <input
                        value={data.percentual_abaixo_fipe_max ?? ""}
                        onChange={(event) =>
                          updateField(
                            "percentual_abaixo_fipe_max",
                            parseNullableNumber(event.target.value)
                          )
                        }
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
                        value={data.regiao || ""}
                        onChange={(event) =>
                          updateField("regiao", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Cidade">
                      <input
                        value={data.cidade || ""}
                        onChange={(event) =>
                          updateField("cidade", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Estado">
                      <input
                        value={data.estado || ""}
                        onChange={(event) =>
                          updateField("estado", event.target.value)
                        }
                        className="input-base"
                      />
                    </Field>

                    <Field label="Vendedor preferido">
                      <select
                        value={data.vendedor_preferido || "todos"}
                        onChange={(event) =>
                          updateField("vendedor_preferido", event.target.value)
                        }
                        className="input-base"
                      >
                        <option value="todos">Todos</option>
                        <option value="locadora">Locadora</option>
                        <option value="revenda">Revenda</option>
                        <option value="concessionaria">Concessionária</option>
                        <option value="lojista">Lojista</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="Observações">
                      <textarea
                        value={data.observacoes || ""}
                        onChange={(event) =>
                          updateField("observacoes", event.target.value)
                        }
                        rows={5}
                        className="w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                      />
                    </Field>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <ToggleCard
                      title="Receber novos veículos"
                      checked={!!data.receber_novos_veiculos}
                      onChange={(checked) =>
                        updateField("receber_novos_veiculos", checked)
                      }
                    />

                    <ToggleCard
                      title="Aceita contato por WhatsApp"
                      checked={!!data.aceita_whatsapp}
                      onChange={(checked) =>
                        updateField("aceita_whatsapp", checked)
                      }
                    />
                  </div>
                </section>

                {message ? (
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    {message}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </button>

                  <Link
                    href="/compradores/lista"
                    className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Voltar
                  </Link>
                </div>
              </div>
            )}
          </div>
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