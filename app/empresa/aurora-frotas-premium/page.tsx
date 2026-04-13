type VehicleItem = {
  id: number
  marca: string
  modelo: string
  ano: number
  valor: number
  valorFipe: number
  abaixoFipe: number
  km: number
  tipoVenda: 'unidade' | 'frota'
  combustivel: string
  destaque: string
}

const vehicles: VehicleItem[] = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla XEi',
    ano: 2023,
    valor: 112900,
    valorFipe: 125000,
    abaixoFipe: 10,
    km: 38200,
    tipoVenda: 'unidade',
    combustivel: 'Flex',
    destaque: 'Revisado e pronto para transferência',
  },
  {
    id: 2,
    marca: 'Chevrolet',
    modelo: 'Onix LT',
    ano: 2024,
    valor: 73900,
    valorFipe: 86900,
    abaixoFipe: 15,
    km: 21400,
    tipoVenda: 'frota',
    combustivel: 'Flex',
    destaque: 'Venda em lote com preço comercial',
  },
  {
    id: 3,
    marca: 'Jeep',
    modelo: 'Renegade Longitude',
    ano: 2023,
    valor: 98900,
    valorFipe: 123600,
    abaixoFipe: 20,
    km: 46800,
    tipoVenda: 'unidade',
    combustivel: 'Flex',
    destaque: 'SUV com excelente saída comercial',
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function EmpresaAuroraFrotasPremiumPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="flex items-center justify-center border-b border-cyan-100 p-8 lg:border-b-0 lg:border-r">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white text-6xl font-black text-cyan-500 shadow-sm">
                A
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">
                  Locadora
                </span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  Página pública
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  Seminovos Locadoras
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Aurora Frotas Premium
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
                Empresa especializada na venda de veículos seminovos de locadora,
                com foco em giro rápido, oportunidades abaixo da FIPE, venda por
                unidade ou frota e atendimento comercial ágil.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Cidade / Estado
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Belo Horizonte • MG
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    WhatsApp
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    (31) 99999-9999
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    E-mail principal
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    comercial@aurorafrotas.com.br
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    Tipo de venda
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    Unidade e frota
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01]"
                >
                  Falar no WhatsApp
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Enviar e-mail
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
                >
                  Receber novos veículos
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900">
                Veículos desta empresa
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Estrutura pública para listar os veículos da empresa dentro do
                marketplace e fortalecer busca orgânica, contato direto e giro
                comercial.
              </p>

              <div className="mt-6 grid gap-5">
                {vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-5">
                        <div className="w-full rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-5 text-center shadow-inner">
                          <div className="text-5xl">🚗</div>
                          <p className="mt-3 text-sm font-bold text-slate-700">
                            Foto principal do veículo
                          </p>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                            {vehicle.tipoVenda === 'frota' ? 'Frota' : 'Unidade'}
                          </span>
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                            {vehicle.abaixoFipe}% abaixo da FIPE
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {vehicle.combustivel}
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-black text-slate-900">
                          {vehicle.marca} {vehicle.modelo}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {vehicle.ano} • {vehicle.km.toLocaleString('pt-BR')} km
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                              Valor
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-900">
                              {formatCurrency(vehicle.valor)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                              FIPE
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-900">
                              {formatCurrency(vehicle.valorFipe)}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                              Economia
                            </p>
                            <p className="mt-2 text-lg font-black text-slate-900">
                              {formatCurrency(vehicle.valorFipe - vehicle.valor)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-700">
                            Destaque comercial
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-900">
                            {vehicle.destaque}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01]"
                          >
                            Ver detalhes
                          </button>

                          <button
                            type="button"
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
                          >
                            Falar com a empresa
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Canais adicionais
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">financeiro@aurorafrotas.com.br</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">frota@aurorafrotas.com.br</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">contratos@aurorafrotas.com.br</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Contrato comercial
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Área preparada para a empresa disponibilizar seu contrato-base
                para download, assinatura fora da plataforma e devolução
                assinada.
              </p>
              <button
                type="button"
                className="mt-4 rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
              >
                Baixar contrato modelo
              </button>
            </div>

            <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Força da página pública
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• reforça confiança da marca</li>
                <li>• ajuda no SEO futuro</li>
                <li>• concentra canais de contato</li>
                <li>• exibe estoque da empresa</li>
                <li>• fortalece negociação direta</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}