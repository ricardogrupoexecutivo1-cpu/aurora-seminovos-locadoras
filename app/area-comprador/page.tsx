'use client'

import { useMemo, useState } from 'react'

type SellerPreference = 'todos' | 'locadora' | 'revenda' | 'concessionaria' | 'lojista'
type SalePreference = 'todos' | 'unidade' | 'frota'

export default function AreaCompradorPage() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    whatsapp: '',
    email: '',
    marcaDesejada: '',
    modeloDesejado: '',
    anoDesejado: '',
    precoMinimo: '',
    precoMaximo: '',
    regiao: '',
    cidade: '',
    estado: '',
    vendedorPreferido: 'todos' as SellerPreference,
    tipoCompra: 'todos' as SalePreference,
    percentualAbaixoFipe: '',
    receberNovosVeiculos: 'sim',
    aceitaWhatsApp: 'sim',
    observacoes: '',
  })

  const resumoInteresse = useMemo(() => {
    const partes: string[] = []

    if (form.marcaDesejada) partes.push(form.marcaDesejada)
    if (form.modeloDesejado) partes.push(form.modeloDesejado)
    if (form.anoDesejado) partes.push(`ano ${form.anoDesejado}`)
    if (form.regiao) partes.push(`região ${form.regiao}`)
    if (form.percentualAbaixoFipe) {
      partes.push(`mínimo ${form.percentualAbaixoFipe}% abaixo da FIPE`)
    }

    return partes.length > 0
      ? partes.join(' • ')
      : 'Defina os filtros para gerar um perfil comercial forte do comprador.'
  }, [
    form.marcaDesejada,
    form.modeloDesejado,
    form.anoDesejado,
    form.regiao,
    form.percentualAbaixoFipe,
  ])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-cyan-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-700">
            Área do comprador
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Cadastro de interesse do comprador
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
            Estrutura para captar compradores reais, montar perfil de interesse,
            enviar novos veículos por região, faixa de preço e percentual abaixo
            da FIPE, e facilitar a conexão com locadoras, revendas,
            concessionárias e lojistas.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-slate-900">
              Dados do comprador
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Base inicial preparada para futura busca automática por CPF e para
              o envio de alertas de novos veículos.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field
                label="Nome completo"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Ricardo Leonardo Moreira"
              />
              <Field
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="Ex.: 000.000.000-00"
              />
              <Field
                label="WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ex.: (31) 99999-9999"
              />
              <Field
                label="E-mail"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ex.: comprador@email.com"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Veículo de interesse
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Marca desejada"
                  name="marcaDesejada"
                  value={form.marcaDesejada}
                  onChange={handleChange}
                  placeholder="Ex.: Toyota"
                />
                <Field
                  label="Modelo desejado"
                  name="modeloDesejado"
                  value={form.modeloDesejado}
                  onChange={handleChange}
                  placeholder="Ex.: Corolla"
                />
                <Field
                  label="Ano desejado"
                  name="anoDesejado"
                  value={form.anoDesejado}
                  onChange={handleChange}
                  placeholder="Ex.: 2023"
                />
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tipo de compra
                  </label>
                  <select
                    name="tipoCompra"
                    value={form.tipoCompra}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="todos">Todos</option>
                    <option value="unidade">Unidade</option>
                    <option value="frota">Frota</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Faixa de preço e oportunidade
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field
                  label="Preço mínimo"
                  name="precoMinimo"
                  value={form.precoMinimo}
                  onChange={handleChange}
                  placeholder="Ex.: 50000"
                />
                <Field
                  label="Preço máximo"
                  name="precoMaximo"
                  value={form.precoMaximo}
                  onChange={handleChange}
                  placeholder="Ex.: 120000"
                />
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    % abaixo da FIPE
                  </label>
                  <select
                    name="percentualAbaixoFipe"
                    value={form.percentualAbaixoFipe}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="">Sem preferência</option>
                    <option value="10">10% abaixo da FIPE</option>
                    <option value="15">15% abaixo da FIPE</option>
                    <option value="20">20% abaixo da FIPE</option>
                    <option value="30">30% abaixo da FIPE</option>
                    <option value="40">40% abaixo da FIPE</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-orange-100 bg-orange-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  Estratégia comercial do comprador
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  O percentual abaixo da FIPE ajuda o comprador a encontrar
                  oportunidades mais agressivas e ajuda a plataforma a entregar
                  anúncios mais alinhados com o perfil desejado.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Região e preferência de vendedor
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Região
                  </label>
                  <select
                    name="regiao"
                    value={form.regiao}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="">Selecione</option>
                    <option value="Sudeste">Sudeste</option>
                    <option value="Sul">Sul</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Centro-Oeste">Centro-Oeste</option>
                    <option value="Norte">Norte</option>
                  </select>
                </div>

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

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tipo de vendedor preferido
                  </label>
                  <select
                    name="vendedorPreferido"
                    value={form.vendedorPreferido}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="todos">Todos</option>
                    <option value="locadora">Locadora</option>
                    <option value="revenda">Revenda</option>
                    <option value="concessionaria">Concessionária</option>
                    <option value="lojista">Lojista</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Alertas e comunicação
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Receber novos veículos?
                  </label>
                  <select
                    name="receberNovosVeiculos"
                    value={form.receberNovosVeiculos}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Aceita contato por WhatsApp?
                  </label>
                  <select
                    name="aceitaWhatsApp"
                    value={form.aceitaWhatsApp}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Observações do comprador
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={5}
                placeholder="Ex.: precisa de veículo com documentação pronta, prefere baixa km, busca oportunidade para compra imediata..."
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01]"
              >
                Salvar interesse do comprador
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Simular busca de oportunidades
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                Resumo do interesse
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Perfil comercial
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {resumoInteresse}
              </p>
            </div>

            <div className="rounded-[2rem] border border-cyan-100 bg-cyan-50 p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Benefícios para o comprador
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• recebe novos veículos automaticamente</li>
                <li>• encontra ofertas por região</li>
                <li>• filtra por oportunidade abaixo da FIPE</li>
                <li>• escolhe unidade ou frota</li>
                <li>• entra em contato mais rápido</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Visão estratégica
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Essa tela fecha o ciclo do marketplace porque cria uma base real
                de compradores interessados, pronta para futuros alertas por
                e-mail, WhatsApp e campanhas segmentadas.
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