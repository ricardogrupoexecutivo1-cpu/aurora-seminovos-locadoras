'use client'

import { useMemo, useState } from 'react'

type ProposalStatus =
  | 'em_analise'
  | 'pre_aprovada'
  | 'aprovada'
  | 'recusada'
  | 'pendente_documentos'

export default function BancosPage() {
  const [form, setForm] = useState({
    bancoParceiro: 'Banco Aurora Frotas',
    compradorNome: '',
    compradorCpf: '',
    compradorWhatsapp: '',
    compradorEmail: '',
    empresaVendedora: '',
    tipoEmpresa: 'locadora',
    veiculo: '',
    marca: '',
    modelo: '',
    ano: '',
    valorVeiculo: '',
    valorEntrada: '',
    prazoMeses: '48',
    taxaJuros: '',
    rendaMensal: '',
    observacoes: '',
    statusProposta: 'em_analise' as ProposalStatus,
    comissaoPlataforma: '',
  })

  const valorVeiculoNumero = Number(form.valorVeiculo || 0)
  const valorEntradaNumero = Number(form.valorEntrada || 0)

  const valorFinanciado = useMemo(() => {
    const resultado = valorVeiculoNumero - valorEntradaNumero
    return resultado > 0 ? resultado : 0
  }, [valorVeiculoNumero, valorEntradaNumero])

  const statusLabel = useMemo(() => {
    const map: Record<ProposalStatus, string> = {
      em_analise: 'Em análise',
      pre_aprovada: 'Pré-aprovada',
      aprovada: 'Aprovada',
      recusada: 'Recusada',
      pendente_documentos: 'Pendente de documentos',
    }

    return map[form.statusProposta]
  }, [form.statusProposta])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
            Crédito e financiamento
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
            Área de bancos e crédito
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
            Estrutura inicial para bancos parceiros, envio de propostas,
            análise de crédito, aprovação, recusas, pendências documentais e
            futura comissão da plataforma dentro do fluxo comercial.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-black text-slate-900">
              Dados da proposta
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Base para o parceiro financeiro avaliar a operação com clareza.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Banco parceiro
                </label>
                <select
                  name="bancoParceiro"
                  value={form.bancoParceiro}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option>Banco Aurora Frotas</option>
                  <option>Banco Comercial Brasil</option>
                  <option>Financeira Auto Cred</option>
                  <option>Parceiro Premium Motors</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status da proposta
                </label>
                <select
                  name="statusProposta"
                  value={form.statusProposta}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                >
                  <option value="em_analise">Em análise</option>
                  <option value="pre_aprovada">Pré-aprovada</option>
                  <option value="aprovada">Aprovada</option>
                  <option value="recusada">Recusada</option>
                  <option value="pendente_documentos">
                    Pendente de documentos
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Dados do comprador
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Nome do comprador"
                  name="compradorNome"
                  value={form.compradorNome}
                  onChange={handleChange}
                  placeholder="Ex.: Ricardo Leonardo Moreira"
                />
                <Field
                  label="CPF"
                  name="compradorCpf"
                  value={form.compradorCpf}
                  onChange={handleChange}
                  placeholder="Ex.: 000.000.000-00"
                />
                <Field
                  label="WhatsApp"
                  name="compradorWhatsapp"
                  value={form.compradorWhatsapp}
                  onChange={handleChange}
                  placeholder="Ex.: (31) 99999-9999"
                />
                <Field
                  label="E-mail"
                  name="compradorEmail"
                  value={form.compradorEmail}
                  onChange={handleChange}
                  placeholder="Ex.: comprador@email.com"
                />
                <Field
                  label="Renda mensal"
                  name="rendaMensal"
                  value={form.rendaMensal}
                  onChange={handleChange}
                  placeholder="Ex.: 12000"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-black text-slate-900">
                Empresa vendedora
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Empresa"
                  name="empresaVendedora"
                  value={form.empresaVendedora}
                  onChange={handleChange}
                  placeholder="Ex.: Aurora Frotas Premium"
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tipo de empresa
                  </label>
                  <select
                    name="tipoEmpresa"
                    value={form.tipoEmpresa}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
                  >
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
                Dados do veículo e financiamento
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field
                  label="Veículo"
                  name="veiculo"
                  value={form.veiculo}
                  onChange={handleChange}
                  placeholder="Ex.: Toyota Corolla XEi"
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
                  label="Valor do veículo"
                  name="valorVeiculo"
                  value={form.valorVeiculo}
                  onChange={handleChange}
                  placeholder="Ex.: 95000"
                />
                <Field
                  label="Valor de entrada"
                  name="valorEntrada"
                  value={form.valorEntrada}
                  onChange={handleChange}
                  placeholder="Ex.: 20000"
                />
                <Field
                  label="Prazo em meses"
                  name="prazoMeses"
                  value={form.prazoMeses}
                  onChange={handleChange}
                  placeholder="Ex.: 48"
                />
                <Field
                  label="Taxa de juros"
                  name="taxaJuros"
                  value={form.taxaJuros}
                  onChange={handleChange}
                  placeholder="Ex.: 1.89"
                />
                <Field
                  label="Comissão da plataforma"
                  name="comissaoPlataforma"
                  value={form.comissaoPlataforma}
                  onChange={handleChange}
                  placeholder="Ex.: 1500"
                />
              </div>

              <div className="mt-5 rounded-[2rem] border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                  Valor financiado estimado
                </p>
                <div className="mt-2 text-3xl font-black text-slate-900">
                  {formatCurrency(valorFinanciado)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Cálculo simples com base no valor do veículo menos o valor de
                  entrada informado.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Observações da análise
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={5}
                placeholder="Ex.: cliente com boa renda, aguardando comprovantes, proposta com chance alta de aprovação..."
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:scale-[1.01]"
              >
                Salvar proposta de crédito
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Simular análise bancária
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                Status atual
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {statusLabel}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A proposta pode caminhar entre análise, pré-aprovação,
                pendência, aprovação ou recusa, dando visão clara para todos os
                envolvidos.
              </p>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-orange-50 p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Valor estratégico desse módulo
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• aproxima bancos do fluxo de venda</li>
                <li>• acelera fechamento comercial</li>
                <li>• evita perder negócio fora da plataforma</li>
                <li>• abre espaço para comissão futura</li>
                <li>• fortalece operação B2B e B2C</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">
                Evoluções futuras
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• upload de documentos</li>
                <li>• aprovação por banco parceiro</li>
                <li>• trilha completa da proposta</li>
                <li>• comissão automática da plataforma</li>
                <li>• alertas por e-mail e WhatsApp</li>
              </ul>
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