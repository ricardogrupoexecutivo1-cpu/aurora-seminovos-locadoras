"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = {
  tipo_empresa: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  inscricao_estadual: string;
  responsavel_comercial: string;
  cpf_responsavel: string;
  whatsapp: string;
  email_principal: string;
  cidade: string;
  estado: string;
  aceite_nome: string;
  aceite_documento: string;
  aceite_concordo: boolean;
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

const COMISSOES = [
  { categoria: "Passeio", valor: "R$ 1.000,00" },
  { categoria: "Intermediário", valor: "R$ 1.500,00" },
  { categoria: "4x4", valor: "R$ 2.000,00" },
  { categoria: "Grande porte", valor: "R$ 3.000,00" },
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

function AreaRestritaBloqueada() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 shadow-sm">
              Área restrita
            </div>

            <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">
              Cadastro empresarial protegido
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Esta área é exclusiva para locadoras, vendedores, concessionárias, lojistas e empresas
              autorizadas pela plataforma. Informações de comissão, termo comercial e operação interna
              não ficam expostas publicamente.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Acesso restrito
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Login da empresa
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  O acesso definitivo será feito com login e senha da empresa ou do vendedor autorizado.
                  Nesta etapa, a área já está bloqueada para não expor comissão e regras comerciais ao público.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Proteção comercial
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Comissão resguardada
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A lógica comercial da plataforma permanece protegida em ambiente restrito para evitar
                  desintermediação e negociação por fora.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,132,199,0.28)] transition hover:scale-[1.01]"
              >
                Voltar para a home
              </a>

              <a
                href="/contato"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Solicitar liberação
              </a>
            </div>

            <div className="mt-8 rounded-3xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf4_0%,#ffffff_100%)] p-4 text-sm text-slate-600 shadow-sm">
              <span className="font-semibold text-amber-700">Sistema em constante atualização:</span>{" "}
              o login completo com senha, perfis de acesso e proteção por tipo de empresa será ativado na
              próxima etapa da área empresarial.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CadastrarEmpresaPage() {
  const [autorizado, setAutorizado] = useState(false);
  const [verificandoAcesso, setVerificandoAcesso] = useState(true);

  const [form, setForm] = useState<FormState>({
    tipo_empresa: "Locadora",
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    inscricao_estadual: "",
    responsavel_comercial: "",
    cpf_responsavel: "",
    whatsapp: "",
    email_principal: "",
    cidade: "",
    estado: "MG",
    aceite_nome: "",
    aceite_documento: "",
    aceite_concordo: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarTermo, setMostrarTermo] = useState(false);

  useEffect(() => {
    try {
      const acessoEmpresa = window.localStorage.getItem("empresa_autorizada");
      setAutorizado(acessoEmpresa === "true");
    } catch {
      setAutorizado(false);
    } finally {
      setVerificandoAcesso(false);
    }
  }, []);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const validacao = useMemo(() => {
    if (!form.nome_fantasia.trim()) return "Informe o nome fantasia / empresa.";
    if (onlyDigits(form.cnpj).length !== 14) return "Informe um CNPJ válido.";
    if (!form.responsavel_comercial.trim()) return "Informe o responsável comercial.";
    if (onlyDigits(form.whatsapp).length < 10) return "Informe um WhatsApp válido.";
    if (!isValidEmail(form.email_principal.trim())) return "Informe um e-mail válido.";
    if (!form.cidade.trim()) return "Informe a cidade.";
    if (!form.estado.trim()) return "Selecione o estado.";
    if (!form.aceite_nome.trim()) return "Informe o nome do responsável pelo aceite.";
    if (onlyDigits(form.aceite_documento).length < 11) return "Informe CPF ou CNPJ válido no aceite.";
    if (!form.aceite_concordo) return "É obrigatório aceitar os termos comerciais da plataforma.";
    return "";
  }, [form]);

  async function salvarEmpresa() {
    setErro("");
    setMensagem("");

    if (validacao) {
      setErro(validacao);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        tipo_empresa: form.tipo_empresa,
        cnpj: onlyDigits(form.cnpj),
        razao_social: form.razao_social.trim() || null,
        nome_fantasia: form.nome_fantasia.trim(),
        inscricao_estadual: form.inscricao_estadual.trim() || null,
        responsavel_comercial: form.responsavel_comercial.trim(),
        cpf_responsavel: onlyDigits(form.cpf_responsavel) || null,
        whatsapp: onlyDigits(form.whatsapp),
        email_principal: form.email_principal.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim(),
        accepted_terms: form.aceite_concordo,
        accepted_at: new Date().toISOString(),
        accepted_name: form.aceite_nome.trim(),
        accepted_document: onlyDigits(form.aceite_documento),
        accepted_term_version: "v1_comissao_plataforma",
      };

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Não foi possível salvar a empresa neste momento."
        );
      }

      setMensagem(
        "Empresa cadastrada com sucesso. O aceite comercial da plataforma foi registrado."
      );

      setForm({
        tipo_empresa: "Locadora",
        cnpj: "",
        razao_social: "",
        nome_fantasia: "",
        inscricao_estadual: "",
        responsavel_comercial: "",
        cpf_responsavel: "",
        whatsapp: "",
        email_principal: "",
        cidade: "",
        estado: "MG",
        aceite_nome: "",
        aceite_documento: "",
        aceite_concordo: false,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao salvar empresa.";
      setErro(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (verificandoAcesso) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
          <div className="rounded-[28px] border border-white/70 bg-white/90 px-8 py-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Verificando acesso
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-950">
              Carregando área empresarial
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Conferindo se esta sessão possui liberação para visualizar a área restrita.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!autorizado) {
    return <AreaRestritaBloqueada />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden border-b border-sky-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur">
            Seminovos Locadoras • Cadastro empresarial restrito
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">
                Cadastro empresarial com
                <span className="block bg-[linear-gradient(90deg,#0f172a_0%,#0369a1_45%,#06b6d4_100%)] bg-clip-text text-transparent">
                  aceite comercial protegido
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Área exclusiva para locadoras, vendedores, concessionárias, lojistas e empresas de repasse,
                com termo comercial e proteção da comissão da plataforma.
              </p>

              <div className="mt-8 rounded-3xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf4_0%,#ffffff_100%)] p-4 text-sm text-slate-600 shadow-sm">
                <span className="font-semibold text-amber-700">Sistema em constante atualização:</span>{" "}
                pode haver momentos de instabilidade durante melhorias, validações comerciais e novas integrações.
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Resguardo comercial
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Comissão protegida
              </h2>

              <div className="mt-5 space-y-3">
                {COMISSOES.map((item) => (
                  <div
                    key={item.categoria}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-600">
                        {item.categoria}
                      </span>
                      <span className="text-base font-black text-slate-950">
                        {item.valor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Este conteúdo é exibido apenas em ambiente restrito do vendedor/empresa para evitar
                desintermediação e exposição pública da política comercial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Dados da empresa
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
                Cadastro principal
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tipo de empresa
                </label>
                <select
                  value={form.tipo_empresa}
                  onChange={(e) => updateField("tipo_empresa", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                >
                  <option>Locadora</option>
                  <option>Concessionária</option>
                  <option>Lojista</option>
                  <option>Empresa de repasse</option>
                  <option>Revenda</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  CNPJ *
                </label>
                <input
                  value={form.cnpj}
                  onChange={(e) => updateField("cnpj", formatCnpj(e.target.value))}
                  placeholder="00.000.000/0001-00"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Razão social
                </label>
                <input
                  value={form.razao_social}
                  onChange={(e) => updateField("razao_social", e.target.value)}
                  placeholder="Razão social da empresa"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nome fantasia / empresa *
                </label>
                <input
                  value={form.nome_fantasia}
                  onChange={(e) => updateField("nome_fantasia", e.target.value)}
                  placeholder="Ex.: Aurora Frotas Premium"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Inscrição estadual
                </label>
                <input
                  value={form.inscricao_estadual}
                  onChange={(e) => updateField("inscricao_estadual", e.target.value)}
                  placeholder="Opcional"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Responsável comercial *
                </label>
                <input
                  value={form.responsavel_comercial}
                  onChange={(e) => updateField("responsavel_comercial", e.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  CPF do responsável
                </label>
                <input
                  value={form.cpf_responsavel}
                  onChange={(e) => updateField("cpf_responsavel", formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  WhatsApp *
                </label>
                <input
                  value={form.whatsapp}
                  onChange={(e) => updateField("whatsapp", formatPhone(e.target.value))}
                  placeholder="(31) 99999-9999"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  E-mail principal *
                </label>
                <input
                  value={form.email_principal}
                  onChange={(e) => updateField("email_principal", e.target.value)}
                  placeholder="contato@empresa.com.br"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Cidade *
                </label>
                <input
                  value={form.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                  placeholder="Ex.: Belo Horizonte"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estado *
                </label>
                <select
                  value={form.estado}
                  onChange={(e) => updateField("estado", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                >
                  {ESTADOS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {erro ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {erro}
              </div>
            ) : null}

            {mensagem ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {mensagem}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={salvarEmpresa}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,132,199,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Salvando..." : "Salvar empresa"}
              </button>

              <button
                type="button"
                onClick={() => setMostrarTermo(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Ver termos comerciais
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Aceite obrigatório
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
              Termo comercial digital
            </h2>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm leading-7 text-slate-700">
                Declaro que li, compreendi e estou de acordo com as regras comerciais da plataforma
                <span className="font-semibold text-slate-950"> seminovoslocadoras.com.br</span>,
                inclusive no que se refere à comissão sobre vendas originadas pela plataforma,
                vedação de fechamento por fora e possibilidade de bloqueio em caso de descumprimento.
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nome do responsável pelo aceite *
                </label>
                <input
                  value={form.aceite_nome}
                  onChange={(e) => updateField("aceite_nome", e.target.value)}
                  placeholder="Nome completo"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  CPF ou CNPJ do aceite *
                </label>
                <input
                  value={form.aceite_documento}
                  onChange={(e) => {
                    const digits = onlyDigits(e.target.value);
                    updateField(
                      "aceite_documento",
                      digits.length > 11 ? formatCnpj(digits) : formatCpf(digits)
                    );
                  }}
                  placeholder="CPF ou CNPJ"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                />
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                <input
                  type="checkbox"
                  checked={form.aceite_concordo}
                  onChange={(e) => updateField("aceite_concordo", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Li e aceito os termos comerciais da plataforma, reconheço a comissão sobre vendas
                  originadas pelo ambiente e concordo com a vedação de negociação direta para evitar
                  a comissão da plataforma.
                </span>
              </label>

              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Sem este aceite, o cadastro da empresa não pode ser concluído.
              </div>
            </div>
          </div>
        </div>
      </section>

      {mostrarTermo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/20 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Termos comerciais
                </p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
                  Aceite comercial da plataforma
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setMostrarTermo(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <strong className="text-slate-950">1. Origem dos negócios.</strong>{" "}
                Todas as vendas originadas por leads, contatos, anúncios, formulários, visitas ou
                interações realizadas por meio da plataforma seminovoslocadoras.com.br são consideradas
                vendas originadas pela plataforma.
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <strong className="text-slate-950">2. Comissão comercial.</strong>{" "}
                O vendedor reconhece que as vendas originadas pela plataforma estão sujeitas à comissão:
                <ul className="mt-3 list-disc pl-5">
                  <li>Passeio: R$ 1.000,00</li>
                  <li>Intermediário: R$ 1.500,00</li>
                  <li>4x4: R$ 2.000,00</li>
                  <li>Grande porte: R$ 3.000,00</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <strong className="text-slate-950">3. Vedação de desintermediação.</strong>{" "}
                É vedado negociar diretamente com clientes originados pela plataforma com o objetivo
                de evitar o pagamento da comissão.
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <strong className="text-slate-950">4. Consequências.</strong>{" "}
                Em caso de descumprimento, a plataforma poderá bloquear o cadastro, restringir o acesso
                e cobrar a comissão comercial devida, sem prejuízo de outras medidas cabíveis.
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                <strong className="text-slate-950">5. Aceite digital.</strong>{" "}
                O aceite eletrônico com nome e CPF/CNPJ do responsável passa a compor o registro
                comercial do cadastro empresarial.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}