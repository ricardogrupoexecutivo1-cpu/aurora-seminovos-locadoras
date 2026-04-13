export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <div className="rounded-[2rem] border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
            Aurora IA
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">
            Planos • Seminovos Locadoras
          </h1>
          <p className="mt-4 text-sm text-slate-600">
            Estrutura comercial completa para operação do marketplace com
            locadoras, revendas, concessionárias, lojistas e compradores.
          </p>
        </div>

        {/* PLANOS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border p-6">
            <h2 className="text-xl font-black">Start</h2>
            <p className="mt-2 text-sm">Grátis</p>
            <ul className="mt-4 text-sm space-y-2">
              <li>• Cadastro inicial</li>
              <li>• Entrada no marketplace</li>
              <li>• Até 5 fotos por veículo</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-orange-50 p-6">
            <h2 className="text-xl font-black">Locadora PRO</h2>
            <p className="mt-2 text-sm">R$ 49,90/mês</p>
            <ul className="mt-4 text-sm space-y-2">
              <li>• Veículos ilimitados</li>
              <li>• 5 fotos grátis por veículo</li>
              <li>• Destaque na busca</li>
              <li>• Página pública</li>
              <li>• Mais canais comerciais</li>
            </ul>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="text-xl font-black">Comprador Premium</h2>
            <p className="mt-2 text-sm">R$ 19,90/mês</p>
            <ul className="mt-4 text-sm space-y-2">
              <li>• Alertas de veículos</li>
              <li>• Filtro por oportunidade</li>
              <li>• Acesso prioritário</li>
            </ul>
          </div>

        </div>

        {/* REGRAS */}
        <div className="mt-10 rounded-2xl border border-slate-200 p-6 bg-slate-50">
          <h2 className="text-xl font-black">Regras comerciais</h2>

          <div className="mt-4 text-sm space-y-3">
            <p>• O plano mensal refere-se à manutenção e operação da plataforma.</p>
            <p>• O plano permite cadastro de veículos ilimitados.</p>
            <p>• Cada veículo possui até <b>5 fotos gratuitas</b>.</p>
            <p>• Fotos extras: <b>R$ 1,00 por foto</b>.</p>
          </div>
        </div>

        {/* COMISSÃO */}
        <div className="mt-8 rounded-2xl border border-orange-200 p-6 bg-orange-50">
          <h2 className="text-xl font-black">Comissão por venda</h2>

          <div className="mt-4 text-sm space-y-2">
            <p>• Passeio: R$ 1.000,00</p>
            <p>• Intermediário: R$ 1.500,00</p>
            <p>• 4x4: R$ 2.000,00</p>
            <p>• Grande porte: R$ 3.000,00</p>
          </div>

          <p className="mt-4 text-sm">
            A comissão é devida em vendas originadas pela plataforma.
          </p>
        </div>

        {/* CONTRATO PRINCIPAL */}
        <div className="mt-10 rounded-2xl border border-slate-200 p-6 bg-white">
          <h2 className="text-xl font-black">Responsabilidades e uso da plataforma</h2>

          <div className="mt-4 text-sm space-y-4 leading-6 text-slate-600">

            <p>
              A plataforma atua exclusivamente como meio de divulgação,
              conexão e negociação entre as partes.
            </p>

            <p>
              Não nos responsabilizamos por inadimplência, falta de pagamento,
              procedência dos veículos ou divergências comerciais.
            </p>

            <p>
              Comprador e vendedor são responsáveis por validar dados,
              documentos, condições e segurança da negociação.
            </p>

            <p>
              Toda negociação deve ser formalizada com segurança entre as partes.
            </p>

            <p>
              Fica eleito o foro da comarca de <b>Lagoa Santa - MG</b>.
            </p>

          </div>
        </div>

        {/* CONTRATOS TEMPORÁRIOS */}
        <div className="mt-8 rounded-2xl border border-cyan-100 p-6 bg-cyan-50">
          <h2 className="text-xl font-black">Contratos gerados pela plataforma</h2>

          <div className="mt-4 text-sm space-y-4 leading-6 text-slate-700">

            <p>
              Os contratos de compra e venda disponibilizados pela plataforma
              possuem caráter temporário e operacional.
            </p>

            <p>
              Os envolvidos na negociação devem obrigatoriamente realizar o
              download do contrato em seus próprios dispositivos para conferência,
              assinatura, impressão e armazenamento.
            </p>

            <p>
              Após o download e formalização entre as partes, a responsabilidade
              pela guarda, integridade e utilização do documento passa a ser
              exclusivamente dos envolvidos na negociação.
            </p>

            <p>
              A plataforma não realiza armazenamento permanente dos contratos e
              não se responsabiliza por perda, extravio, alterações posteriores
              ou uso indevido dos documentos após sua disponibilização.
            </p>

          </div>
        </div>

        {/* AVISO FINAL */}
        <div className="mt-10 text-sm text-slate-500">
          Sistema em constante atualização — pode haver momentos de instabilidade.
        </div>

      </section>
    </main>
  )
}