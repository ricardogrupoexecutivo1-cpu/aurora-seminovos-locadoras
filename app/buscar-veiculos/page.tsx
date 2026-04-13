'use client'

import { useMemo, useState } from 'react'

type VehicleType = 'unidade' | 'frota'
type SellerType = 'locadora' | 'revenda' | 'concessionaria' | 'lojista'

type Vehicle = {
  id: number
  marca: string
  modelo: string
  ano: number
  cidade: string
  estado: string
  regiao: string
  vendedorTipo: SellerType
  empresa: string
  tipoVenda: VehicleType
  valor: number
  valorFipe: number
  abaixoFipe: number
  km: number
  combustivel: string
  destaque: string
}

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla XEi',
    ano: 2023,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    regiao: 'Sudeste',
    vendedorTipo: 'locadora',
    empresa: 'Aurora Frotas Premium',
    tipoVenda: 'unidade',
    valor: 112900,
    valorFipe: 125000,
    abaixoFipe: 9.68,
    km: 38200,
    combustivel: 'Flex',
    destaque: 'Revisado e pronto para transferência',
  },
  {
    id: 2,
    marca: 'Chevrolet',
    modelo: 'Onix LT',
    ano: 2024,
    cidade: 'Campinas',
    estado: 'SP',
    regiao: 'Sudeste',
    vendedorTipo: 'locadora',
    empresa: 'Seminovos Locadoras Brasil',
    tipoVenda: 'frota',
    valor: 73900,
    valorFipe: 86900,
    abaixoFipe: 14.96,
    km: 21400,
    combustivel: 'Flex',
    destaque: 'Venda em lote com preço comercial',
  },
  {
    id: 3,
    marca: 'Volkswagen',
    modelo: 'T-Cross Comfortline',
    ano: 2022,
    cidade: 'Curitiba',
    estado: 'PR',
    regiao: 'Sul',
    vendedorTipo: 'revenda',
    empresa: 'Portal Auto Revendas',
    tipoVenda: 'unidade',
    valor: 104500,
    valorFipe: 130600,
    abaixoFipe: 19.98,
    km: 49700,
    combustivel: 'Flex',
    destaque: 'SUV com ótima saída comercial',
  },
  {
    id: 4,
    marca: 'Hyundai',
    modelo: 'HB20 Comfort',
    ano: 2023,
    cidade: 'Salvador',
    estado: 'BA',
    regiao: 'Nordeste',
    vendedorTipo: 'lojista',
    empresa: 'Bahia Veículos Express',
    tipoVenda: 'unidade',
    valor: 68900,
    valorFipe: 98400,
    abaixoFipe: 29.98,
    km: 45100,
    combustivel: 'Flex',
    destaque: 'Preço agressivo para giro rápido',
  },
  {
    id: 5,
    marca: 'Jeep',
    modelo: 'Compass Longitude',
    ano: 2022,
    cidade: 'Goiânia',
    estado: 'GO',
    regiao: 'Centro-Oeste',
    vendedorTipo: 'concessionaria',
    empresa: 'Conecta Motors',
    tipoVenda: 'unidade',
    valor: 109900,
    valorFipe: 183100,
    abaixoFipe: 39.98,
    km: 61800,
    combustivel: 'Diesel',
    destaque: 'Oportunidade forte abaixo da FIPE',
  },
]

const sellerLabels: Record<SellerType, string> = {
  locadora: 'Locadora',
  revenda: 'Revenda',
  concessionaria: 'Concessionária',
  lojista: 'Lojista',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function toNumber(value: string) {
  if (!value) return 0
  return Number(String(value).replace(/\./g, '').replace(',', '.')) || 0
}

export default function BuscarVeiculosPage() {
  const [filters, setFilters] = useState({
    regiao: '',
    marca: '',
    modelo: '',
    ano: '',
    precoMin: '',
    precoMax: '',
    vendedorTipo: '',
    abaixoFipeMin: '',
    abaixoFipeMax: '',
    tipoVenda: '',
  })

  const filteredVehicles = useMemo(() => {
    const abaixoMin = toNumber(filters.abaixoFipeMin)
    const abaixoMax = toNumber(filters.abaixoFipeMax)
    const precoMin = toNumber(filters.precoMin)
    const precoMax = toNumber(filters.precoMax)

    return mockVehicles.filter((vehicle) => {
      const regiaoOk = !filters.regiao || vehicle.regiao === filters.regiao
      const marcaOk =
        !filters.marca ||
        vehicle.marca.toLowerCase().includes(filters.marca.toLowerCase())
      const modeloOk =
        !filters.modelo ||
        vehicle.modelo.toLowerCase().includes(filters.modelo.toLowerCase())
      const anoOk = !filters.ano || String(vehicle.ano) === filters.ano
      const precoMinOk = !filters.precoMin || vehicle.valor >= precoMin
      const precoMaxOk = !filters.precoMax || vehicle.valor <= precoMax
      const vendedorOk =
        !filters.vendedorTipo || vehicle.vendedorTipo === filters.vendedorTipo
      const abaixoFipeMinOk =
        !filters.abaixoFipeMin || vehicle.abaixoFipe >= abaixoMin
      const abaixoFipeMaxOk =
        !filters.abaixoFipeMax || vehicle.abaixoFipe <= abaixoMax
      const tipoVendaOk =
        !filters.tipoVenda || vehicle.tipoVenda === filters.tipoVenda

      return (
        regiaoOk &&
        marcaOk &&
        modeloOk &&
        anoOk &&
        precoMinOk &&
        precoMaxOk &&
        vendedorOk &&
        abaixoFipeMinOk &&
        abaixoFipeMaxOk &&
        tipoVendaOk
      )
    })
  }, [filters])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function limparFiltros() {
    setFilters({
      regiao: '',
      marca: '',
      modelo: '',
      ano: '',
      precoMin: '',
      precoMax: '',
      vendedorTipo: '',
      abaixoFipeMin: '',
      abaixoFipeMax: '',
      tipoVenda: '',
    })
  }

  function aplicarFaixaRapida(percentual: number) {
    setFilters((prev) => ({
      ...prev,
      abaixoFipeMin: String(percentual),
      abaixoFipeMax: '',
    }))
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
            Busca inteligente
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Buscar veículos
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
            Encontre veículos por região, marca, modelo, ano, faixa de preço,
            tipo de vendedor, percentual livre abaixo da FIPE e venda por
            unidade ou frota.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-900">Filtros</h2>
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Limpar
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Região
                </label>
                <select
                  name="regiao"
                  value={filters.regiao}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="">Todas</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Sul">Sul</option>
                  <option value="Nordeste">Nordeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Norte">Norte</option>
                </select>
              </div>

              <Field
                label="Marca"
                name="marca"
                value={filters.marca}
                onChange={handleChange}
                placeholder="Ex.: Toyota"
              />

              <Field
                label="Modelo"
                name="modelo"
                value={filters.modelo}
                onChange={handleChange}
                placeholder="Ex.: Corolla"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Ano
                </label>
                <select
                  name="ano"
                  value={filters.ano}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="">Todos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <Field
                label="Preço mínimo"
                name="precoMin"
                value={filters.precoMin}
                onChange={handleChange}
                placeholder="Ex.: 60000"
              />

              <Field
                label="Preço máximo"
                name="precoMax"
                value={filters.precoMax}
                onChange={handleChange}
                placeholder="Ex.: 120000"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Tipo de vendedor
                </label>
                <select
                  name="vendedorTipo"
                  value={filters.vendedorTipo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="">Todos</option>
                  <option value="locadora">Locadora</option>
                  <option value="revenda">Revenda</option>
                  <option value="concessionaria">Concessionária</option>
                  <option value="lojista">Lojista</option>
                </select>
              </div>

              <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  % abaixo da FIPE
                </p>

                <div className="mt-4 grid gap-4">
                  <Field
                    label="Percentual mínimo"
                    name="abaixoFipeMin"
                    value={filters.abaixoFipeMin}
                    onChange={handleChange}
                    placeholder="Ex.: 8"
                  />

                  <Field
                    label="Percentual máximo"
                    name="abaixoFipeMax"
                    value={filters.abaixoFipeMax}
                    onChange={handleChange}
                    placeholder="Ex.: 25"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[10, 15, 20, 30, 40].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => aplicarFaixaRapida(item)}
                      className="rounded-2xl border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
                    >
                      {item}%+
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Agora o filtro não fica engessado. O comprador pode procurar
                  oportunidades com percentual livre, mínimo e máximo.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Tipo de venda
                </label>
                <select
                  name="tipoVenda"
                  value={filters.tipoVenda}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="">Todos</option>
                  <option value="unidade">Unidade</option>
                  <option value="frota">Frota</option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                Visão comercial
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                O percentual livre abaixo da FIPE dá mais força para o comprador
                encontrar oportunidades reais e mais liberdade para a estratégia
                comercial do vendedor aparecer na busca.
              </p>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {filteredVehicles.length} veículo(s) encontrado(s)
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Busca visual preparada para o marketplace evoluir para dados
                  reais.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">
                  Busca por região
                </span>
                <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700">
                  FIPE livre
                </span>
              </div>
            </div>

            <div className="grid gap-5">
              {filteredVehicles.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 p-6">
                      <div className="w-full rounded-[2rem] border border-dashed border-slate-300 bg-white p-6 text-center shadow-inner">
                        <div className="text-5xl">🚗</div>
                        <p className="mt-3 text-sm font-bold text-slate-700">
                          Espaço para foto principal
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Base pronta para imagens reais dos anúncios
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                              {sellerLabels[vehicle.vendedorTipo]}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                              {vehicle.tipoVenda === 'frota' ? 'Frota' : 'Unidade'}
                            </span>
                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                              {formatPercent(vehicle.abaixoFipe)}% abaixo da FIPE
                            </span>
                          </div>

                          <h2 className="mt-4 text-2xl font-black text-slate-900">
                            {vehicle.marca} {vehicle.modelo}
                          </h2>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {vehicle.ano} • {vehicle.combustivel} •{' '}
                            {vehicle.km.toLocaleString('pt-BR')} km
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {vehicle.cidade} • {vehicle.estado} • {vehicle.regiao}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Empresa: <span className="font-bold">{vehicle.empresa}</span>
                          </p>
                        </div>

                        <div className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-4 lg:min-w-[240px]">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                            Valor anunciado
                          </p>
                          <div className="mt-2 text-3xl font-black text-slate-900">
                            {formatCurrency(vehicle.valor)}
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            FIPE: {formatCurrency(vehicle.valorFipe)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                            Oportunidade
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-900">
                            {vehicle.destaque}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                            Economia sobre FIPE
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-900">
                            {formatCurrency(vehicle.valorFipe - vehicle.valor)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                            Desconto aplicado
                          </p>
                          <p className="mt-2 text-sm font-bold text-slate-900">
                            {formatPercent(vehicle.abaixoFipe)}%
                          </p>
                        </div>
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
                          Falar no WhatsApp
                        </button>

                        <button
                          type="button"
                          className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
                        >
                          Receber novos veículos
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredVehicles.length === 0 && (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <div className="text-5xl">🔎</div>
                  <h2 className="mt-4 text-2xl font-black text-slate-900">
                    Nenhum veículo encontrado
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Ajuste os filtros para ampliar a busca e encontrar novas
                    oportunidades.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

function Field({ label, name, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
      />
    </div>
  )
}