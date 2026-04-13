'use client'

import { useMemo, useState } from 'react'

const quickDiscountOptions = [10, 15, 20, 30, 40]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(value) ? value : 0)
}

export default function CadastrarVeiculoPage() {
  const [form, setForm] = useState({
    renavan: '',
    chassi: '',
    marca: '',
    modelo: '',
    ano: '',
    versao: '',
    combustivel: '',
    km: '',
    regiao: '',
    cidade: '',
    estado: '',
    valorFipe: '',
    percentualAbaixoFipe: '',
    tipoVenda: 'unidade',
    valorUnidadeManual: '',
    valorFrota: '',
    quantidadeFrota: '',
    observacoes: '',
  })

  const valorFipeNumero = Number(
    String(form.valorFipe).replace(/\./g, '').replace(',', '.')
  ) || 0

  const percentualNumero = Number(
    String(form.percentualAbaixoFipe).replace(',', '.')
  ) || 0

  const valorSugerido = useMemo(() => {
    if (!valorFipeNumero) return 0

    const percentualAplicado =
      percentualNumero < 0 ? 0 : percentualNumero > 100 ? 100 : percentualNumero

    return valorFipeNumero * (1 - percentualAplicado / 100)
  }, [valorFipeNumero, percentualNumero])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function aplicarDescontoRapido(percentual: number) {
    setForm((prev) => ({
      ...prev,
      percentualAbaixoFipe: String(percentual),
    }))
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
            Aurora IA
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Cadastro de veículo • Seminovos Locadoras
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Cadastre veículos de locadoras, revendas, concessionárias e lojistas
            com estrutura pronta para FIPE, desconto livre abaixo da tabela,
            venda por unidade ou frota, região e futura integração com fotos,
            contratos, crédito e páginas públicas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-slate-900">
              Dados principais do veículo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Estrutura inicial segura para validar o coração comercial do app.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field
                label="RENAVAN"
                name="renavan"
                value={form.renavan}
                onChange={handleChange}
                placeholder="Ex.: 12345678901"
              />
              <Field
                label="CHASSI"
                name="chassi"
                value={form.chassi}
                onChange={handleChange}
                placeholder="Ex.: 9BWZZZ377VT004251"
              />
              <Field
                label="Marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Ex.: Toyota"
              />
              <Field
                label="Modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Ex.: Corolla"
              />
              <Field
                label="Ano"
                name="ano"
                value={form.ano}
                onChange={handleChange}
                placeholder="Ex.: 2023"
              />
              <Field
                label="Versão"
                name="versao"
                value={form.versao}
                onChange={handleChange}
                placeholder="Ex.: XEi 2.0"
              />
              <Field
                label="Combustível"
                name="combustivel"
                value={form.combustivel}
                onChange={handleChange}
                placeholder="Ex.: Flex"
              />
              <Field
                label="KM"
                name="km"
                value={form.km}
                onChange={handleChange}
                placeholder="Ex.: 45200"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Região e disponibilidade
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field
                  label="Região"
                  name="regiao"
                  value={form.regiao}
                  onChange={handleChange}
                  placeholder="Ex.: Sudeste"
                />
                <Field
                  label="Cidade"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  placeholder="Ex.: Belo Horizonte"
                />
                <Field
                  label="Estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  placeholder="Ex.: MG"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Preço com base na FIPE
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Valor FIPE"
                  name="valorFipe"
                  value={form.valorFipe}
                  onChange={handleChange}
                  placeholder="Ex.: 85000"
                />

                <Field
                  label="% abaixo da FIPE"
                  name="percentualAbaixoFipe"
                  value={form.percentualAbaixoFipe}
                  onChange={handleChange}
                  placeholder="Ex.: 12,5"
                />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-900">
                  Faixas rápidas para agilizar
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {quickDiscountOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => aplicarDescontoRapido(option)}
                      className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-100"
                    >
                      {option}% abaixo da FIPE
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  O vendedor pode usar uma faixa rápida ou digitar livremente o
                  percentual que deseja. Isso deixa a negociação mais flexível e
                  mais forte para o giro real do veículo.
                </p>
              </div>

              <div className="mt-4 rounded-3xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  Valor sugerido automático
                </p>
                <div className="mt-2 text-3xl font-black text-slate-900">
                  {formatCurrency(valorSugerido)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  O sistema calcula automaticamente o valor sugerido com base na
                  FIPE e no percentual informado livremente pelo vendedor.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Tipo de venda
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tipo
                  </label>
                  <select
                    name="tipoVenda"
                    value={form.tipoVenda}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="unidade">Unidade</option>
                    <option value="frota">Frota</option>
                  </select>
                </div>

                <Field
                  label="Preço da unidade"
                  name="valorUnidadeManual"
                  value={form.valorUnidadeManual}
                  onChange={handleChange}
                  placeholder="Ex.: 79000"
                />

                <Field
                  label="Preço para frota"
                  name="valorFrota"
                  value={form.valorFrota}
                  onChange={handleChange}
                  placeholder="Ex.: 75000"
                />
              </div>

              {form.tipoVenda === 'frota' && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Quantidade na frota"
                    name="quantidadeFrota"
                    value={form.quantidadeFrota}
                    onChange={handleChange}
                    placeholder="Ex.: 18"
                  />

                  <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
                    <p className="text-sm font-bold text-cyan-800">
                      Venda em lote / frota ativada
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Ideal para locadoras e grandes operações que desejam vender
                      várias unidades com preço comercial diferenciado.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Observações comerciais
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={5}
                placeholder="Ex.: veículo revisado, único dono da operação, disponível para visita, documentação pronta..."
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01]"
              >
                Salvar cadastro do veículo
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Simular integração FIPE
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Fotos do anúncio
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Nesta primeira fase vamos deixar claro o modelo comercial:
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    5 fotos grátis
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Base gratuita para subir o anúncio rapidamente.
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    Fotos extras: R$ 1,00 por foto
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Monetização simples e escalável para anúncios mais fortes.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Evoluções já planejadas
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• puxar dados por RENAVAN e chassi</li>
                <li>• integrar FIPE real</li>
                <li>• upload de fotos</li>
                <li>• logo da locadora, revenda ou concessionária</li>
                <li>• página pública da empresa</li>
                <li>• bancos para crédito</li>
                <li>• contratos para download e devolução assinada</li>
                <li>• alertas de novos veículos para compradores</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                Visão do app
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                O maior marketplace de seminovos de locadoras do Brasil
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Estrutura pensada para locadoras, compradores, revendas,
                concessionárias, lojistas e bancos dentro de um fluxo simples e
                forte.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
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