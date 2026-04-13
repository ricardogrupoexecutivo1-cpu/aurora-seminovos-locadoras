export default function HomePage() {
  const stats = [
    { label: "Entrada comercial", value: "24h", detail: "Base pronta para captar empresas e compradores" },
    { label: "Operação", value: "Premium", detail: "Visual comercial claro, elegante e confiável" },
    { label: "Expansão", value: "Escalável", detail: "Estrutura pronta para locadoras, revendas e bancos" },
  ];

  const pilares = [
    {
      title: "Locadoras e frotas",
      text: "Base profissional para locadoras anunciarem veículos com presença comercial forte, navegação clara e espaço para evolução contínua.",
    },
    {
      title: "Compradores qualificados",
      text: "Área preparada para atrair compradores reais, organizar interesse de compra e sustentar relacionamento comercial com padrão premium.",
    },
    {
      title: "Concessionárias e revendas",
      text: "Estrutura pronta para captar empresas, consolidar vitrines, fortalecer confiança e ampliar geração de negócios no ecossistema.",
    },
  ];

  const acessos = [
    { href: "/buscar-veiculos", title: "Buscar veículos", text: "Explore o marketplace e veja a base de veículos disponível para expansão." },
    { href: "/compradores", title: "Compradores", text: "Cadastre, organize e acompanhe a base comercial de compradores." },
    { href: "/seminovos-locadoras/empresas", title: "Empresas", text: "Visualize a base empresarial e a vitrine das operações cadastradas." },
    { href: "/bancos", title: "Bancos", text: "Área preparada para integração comercial e financeira do ecossistema." },
    { href: "/planos", title: "Planos", text: "Apresente valor, escale a operação e organize a monetização da plataforma." },
    { href: "/cadastrar-empresa", title: "Cadastrar empresa", text: "Entrada oficial para novas empresas, locadoras, revendas e parceiros." },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-sky-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur">
                Aurora IA • Seminovos Locadoras
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
                Plataforma premium para
                <span className="block bg-[linear-gradient(90deg,#0f172a_0%,#0369a1_45%,#06b6d4_100%)] bg-clip-text text-transparent">
                  compra, venda e gestão de veículos
                </span>
                entre locadoras, concessionárias e compradores.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Estrutura comercial clara, premium e escalável para transformar o seminovoslocadoras.com.br
                em um ambiente forte de captação, relacionamento e geração de negócios reais.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/buscar-veiculos"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,132,199,0.28)] transition hover:scale-[1.01]"
                >
                  Buscar veículos
                </a>

                <a
                  href="/cadastrar-empresa"
                  className="inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-white px-6 py-3 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
                >
                  Cadastrar empresa
                </a>

                <a
                  href="/compradores"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Área de compradores
                </a>
              </div>

              <div className="mt-8 rounded-3xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf4_0%,#ffffff_100%)] p-4 text-sm text-slate-600 shadow-sm">
                <span className="font-semibold text-amber-700">Sistema em constante atualização:</span>{" "}
                pode haver momentos de instabilidade durante melhorias, evoluções comerciais e novas integrações.
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      Visão comercial
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      Base pronta para crescer
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700">
                    Online
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                        <span className="text-lg font-black text-slate-950">{item.value}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_100%)] p-6 shadow-[0_20px_60px_rgba(6,182,212,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Posicionamento
                </p>
                <h3 className="mt-2 text-xl font-black text-slate-950">
                  Presença séria para o mercado automotivo
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Um ambiente pensado para passar confiança, organizar a entrada de empresas e abrir espaço
                  para integrações com bancos, compradores e operações de seminovos com padrão premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {pilares.map((item) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-4 h-1.5 w-16 rounded-full bg-[linear-gradient(90deg,#06b6d4_0%,#0284c7_100%)]" />
              <h2 className="text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Acessos principais
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
              Navegação pronta para operação real
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Estrutura organizada para lançamento, validação comercial e evolução progressiva do projeto sem perder a elegância visual.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {acessos.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_20px_50px_rgba(6,182,212,0.12)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e0f2fe_0%,#ecfeff_100%)] text-lg font-black text-cyan-700">
                →
              </div>
              <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-cyan-700 transition group-hover:translate-x-1">
                Acessar
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#082f49_50%,#0f172a_100%)] px-6 py-8 text-white shadow-[0_28px_80px_rgba(8,47,73,0.30)] sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Lançamento em evolução
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
                Seminovos Locadoras já está no ar e pronto para crescer com segurança.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Agora que a base está publicada, seguimos com melhorias finas, integrações comerciais,
                cadastro empresarial, compradores, empresas e evolução visual no padrão premium do projeto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href="/planos"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Ver planos
              </a>

              <a
                href="/seminovos-locadoras/empresas"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Ver empresas
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}