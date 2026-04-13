import Link from "next/link";

const quickCards = [
  {
    title: "Cadastro empresarial premium",
    description:
      "Entrada para locadoras, revendas, concessionárias e lojistas com base comercial preparada para crescer.",
  },
  {
    title: "Integração comercial inteligente",
    description:
      "Estrutura pronta para leitura de CNPJ, evolução da operação e fortalecimento da presença pública da empresa.",
  },
  {
    title: "Marketplace com apoio Aurora IA",
    description:
      "Fluxo pensado para compra, venda, exposição comercial e organização de veículos com aparência premium.",
  },
];

const discountCards = ["10%", "15%", "20%", "30%", "40%"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4fbff_0%,#eef8ff_40%,#ffffff_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="overflow-hidden rounded-[36px] border border-cyan-100 bg-white/90 shadow-[0_24px_80px_rgba(14,30,37,0.10)]">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_28%),radial-gradient(circle_at_right,rgba(96,165,250,0.18),transparent_22%),linear-gradient(135deg,#f7fdff_0%,#edf8ff_55%,#ffffff_100%)] px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-4xl font-extrabold text-white shadow-lg">
                    A
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">
                      Aurora IA
                    </div>
                    <h1 className="text-3xl font-black sm:text-5xl">
                      Seminovos Locadoras
                    </h1>
                  </div>
                </div>

                <p className="max-w-3xl text-lg leading-8 text-slate-600">
                  Marketplace completo para compra e venda de veículos de
                  locadoras, revendas e concessionárias com toda a
                  infraestrutura comercial da Aurora IA.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/buscar-veiculos"
                    className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-black text-white transition hover:scale-[1.01] hover:bg-cyan-600"
                  >
                    Buscar veículos
                  </Link>

                  <Link
                    href="/cadastrar-empresa"
                    className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-6 py-3 text-sm font-bold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Cadastrar empresa
                  </Link>

                  <Link
                    href="/seminovos-locadoras/empresas"
                    className="inline-flex items-center justify-center rounded-2xl border border-cyan-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    Empresas
                  </Link>

                  <Link
                    href="/cadastrar-veiculo"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cadastrar veículo
                  </Link>

                  <Link
                    href="/compradores"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    Compradores
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-md rounded-[30px] border border-cyan-100 bg-white/95 p-6 shadow-[0_18px_50px_rgba(14,30,37,0.08)]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-700/70">
                  Entrada principal
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  Fluxo comercial mais claro
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Agora a home destaca as entradas que realmente importam para
                  o usuário: buscar veículos, cadastrar empresa, ver empresas,
                  cadastrar veículo e avançar no fluxo comercial.
                </p>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
                    Locadoras e empresas com entrada visível
                  </div>
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
                    Base preparada para vitrine pública premium
                  </div>
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
                    Sistema em constante atualização com evolução segura
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-8 sm:px-10 lg:grid-cols-3">
            {quickCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[26px] border border-cyan-100 bg-[#fbfeff] p-5 shadow-[0_8px_20px_rgba(14,30,37,0.04)]"
              >
                <h3 className="text-lg font-black text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-cyan-100 px-6 py-8 sm:px-10">
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-cyan-700/70">
              Estratégia comercial
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {discountCards.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-center font-black text-slate-800 shadow-[0_8px_20px_rgba(14,30,37,0.04)]"
                >
                  {item} abaixo da FIPE
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-500">
              Sistema em constante atualização e pode haver momentos de
              instabilidade durante melhorias.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}