"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Buyer = {
  id: string;
  nome?: string | null;
  cpf?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  cidade?: string | null;
  estado?: string | null;
  marca_desejada?: string | null;
  modelo_desejado?: string | null;
  preco_minimo?: number | null;
  preco_maximo?: number | null;
  created_at?: string | null;
};

type BuyersResponse = {
  success?: boolean;
  buyers?: Buyer[];
  message?: string;
  error?: string;
};

function formatMoney(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return "Não informado";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatCpf(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");

  if (digits.length !== 11) return value || "Não informado";

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function buildInterestLabel(buyer: Buyer) {
  const parts = [buyer.marca_desejada, buyer.modelo_desejado]
    .map((item) => (item || "").trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "Não informado";
}

function buildPriceRangeLabel(buyer: Buyer) {
  const min = formatMoney(buyer.preco_minimo);
  const max = formatMoney(buyer.preco_maximo);

  if (min === "Não informado" && max === "Não informado") {
    return "Não informado";
  }

  return `${min} até ${max}`;
}

function normalizeText(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

export default function ListaCompradoresPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBuyers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/buyers", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      });

      const rawText = await response.text();
      let parsed: BuyersResponse | null = null;

      if (rawText.trim()) {
        try {
          parsed = JSON.parse(rawText) as BuyersResponse;
        } catch {
          throw new Error(
            `A API respondeu em formato inesperado: ${rawText.slice(0, 220)}`
          );
        }
      }

      if (!response.ok || !parsed?.success) {
        throw new Error(
          parsed?.message || parsed?.error || "Não foi possível carregar compradores."
        );
      }

      setBuyers(Array.isArray(parsed.buyers) ? parsed.buyers : []);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao carregar compradores.";
      setError(msg);
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBuyers();
  }, []);

  const filteredBuyers = useMemo(() => {
    const term = normalizeText(search);

    if (!term) return buyers;

    return buyers.filter((buyer) => {
      return (
        normalizeText(buyer.nome).includes(term) ||
        normalizeText(buyer.cidade).includes(term) ||
        normalizeText(buyer.estado).includes(term) ||
        normalizeText(buyer.cpf).includes(term) ||
        normalizeText(buyer.email).includes(term) ||
        normalizeText(buyer.whatsapp).includes(term) ||
        normalizeText(buyer.marca_desejada).includes(term) ||
        normalizeText(buyer.modelo_desejado).includes(term)
      );
    });
  }, [buyers, search]);

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
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-700">
                  Aurora IA
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Compradores cadastrados
                </h1>

                <p className="mt-2 text-lg font-semibold text-cyan-700">
                  Base comercial real dos compradores
                </p>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Visualize a base de compradores já salvos no sistema, com
                  acesso rápido para operação comercial e evolução do funil.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void loadBuyers()}
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  Atualizar
                </button>

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
            <div className="mb-6 rounded-[24px] border border-cyan-100 bg-white/92 p-5 shadow-[0_10px_24px_rgba(14,30,37,0.05)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700/70">
                    Buscar compradores
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por nome, CPF, cidade, estado, e-mail, WhatsApp, marca ou modelo..."
                    className="mt-2 w-full rounded-2xl border border-cyan-100 bg-[#f8fcff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
                  />
                </div>

                <div className="grid gap-2 lg:min-w-[180px]">
                  <div className="rounded-[22px] border border-cyan-100 bg-[#fbfeff] p-4 text-center shadow-[0_8px_20px_rgba(14,30,37,0.04)]">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-700/70">
                      Total exibido
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                      {loading ? "..." : filteredBuyers.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[24px] border border-cyan-100 bg-cyan-50 p-6 text-sm font-semibold text-cyan-700">
                Carregando compradores...
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : filteredBuyers.length === 0 ? (
              <div className="rounded-[24px] border border-cyan-100 bg-white p-6 text-sm font-semibold text-slate-700">
                {buyers.length === 0
                  ? "Nenhum comprador cadastrado ainda."
                  : "Nenhum comprador encontrado para esta busca."}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBuyers.map((buyer) => {
                  const whatsappDigits = (buyer.whatsapp || "").replace(/\D/g, "");

                  return (
                    <article
                      key={buyer.id}
                      className="rounded-[24px] border border-cyan-100 bg-white p-5 shadow-[0_10px_24px_rgba(14,30,37,0.05)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <h2 className="text-xl font-black text-slate-900">
                            {buyer.nome || "Sem nome"}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            CPF: {formatCpf(buyer.cpf)}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {(buyer.cidade || "Cidade não informada").trim()} •{" "}
                            {(buyer.estado || "-").trim()}
                          </p>

                          <p className="mt-3 text-sm text-slate-600">
                            Interesse: {buildInterestLabel(buyer)}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            Faixa: {buildPriceRangeLabel(buyer)}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            E-mail: {buyer.email || "Não informado"}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            WhatsApp: {buyer.whatsapp || "Não informado"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/compradores/${buyer.id}/editar`}
                            className="inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                          >
                            Editar
                          </Link>

                          {whatsappDigits ? (
                            <Link
                              href={`https://wa.me/${whatsappDigits}`}
                              target="_blank"
                              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                            >
                              WhatsApp
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}