"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export default function AreaEmpresaPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function verificarSessao() {
      if (!supabase) {
        if (ativo) {
          setErro(
            "Supabase não configurado no front. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
          );
          setVerificandoSessao(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        const session = data.session;

        if (session?.user) {
          try {
            window.localStorage.setItem("empresa_autorizada", "true");
            window.localStorage.setItem(
              "empresa_email",
              session.user.email || ""
            );
          } catch {}

          window.location.href = "/cadastrar-empresa";
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar sessão da empresa:", error);
      } finally {
        if (ativo) {
          setVerificandoSessao(false);
        }
      }
    }

    verificarSessao();

    return () => {
      ativo = false;
    };
  }, []);

  async function entrar() {
    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro(
        "Supabase não configurado no front. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (senha.trim().length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setEntrando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha.trim(),
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Não foi possível identificar o usuário após o login.");
      }

      try {
        window.localStorage.setItem("empresa_autorizada", "true");
        window.localStorage.setItem("empresa_email", data.user.email || "");
      } catch {}

      setMensagem("Login realizado com sucesso. Redirecionando para a área empresarial...");

      setTimeout(() => {
        window.location.href = "/cadastrar-empresa";
      }, 900);
    } catch (error) {
      console.error("Erro ao autenticar empresa:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar neste momento.";

      if (
        message.toLowerCase().includes("invalid login credentials") ||
        message.toLowerCase().includes("invalid")
      ) {
        setErro("E-mail ou senha inválidos.");
      } else {
        setErro(message);
      }
    } finally {
      setEntrando(false);
    }
  }

  async function sairDaSessaoAtual() {
    setErro("");
    setMensagem("");

    if (!supabase) {
      setErro(
        "Supabase não configurado no front. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    try {
      await supabase.auth.signOut();

      try {
        window.localStorage.removeItem("empresa_autorizada");
        window.localStorage.removeItem("empresa_email");
      } catch {}

      setMensagem("Sessão anterior encerrada. Agora você pode entrar com outro acesso.");
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
      setErro("Não foi possível encerrar a sessão atual.");
    }
  }

  if (verificandoSessao) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full rounded-[32px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur">
                Seminovos Locadoras • Área da empresa
              </div>

              <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Verificando sessão empresarial
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Conferindo se já existe um acesso válido da locadora, vendedor ou parceiro autorizado.
              </p>

              <div className="mt-8 rounded-3xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf4_0%,#ffffff_100%)] p-4 text-sm text-slate-600 shadow-sm">
                <span className="font-semibold text-amber-700">Sistema em constante atualização:</span>{" "}
                pode haver momentos de instabilidade durante melhorias, blindagens e integrações da área empresarial.
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eef8ff_0%,#f6fbff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-300/25 blur-3xl" />
          <div className="absolute right-[-80px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute bottom-[-120px] left-[18%] h-[260px] w-[260px] rounded-full bg-blue-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm backdrop-blur">
                Seminovos Locadoras • Área da empresa
              </div>

              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
                Entrada restrita para
                <span className="block bg-[linear-gradient(90deg,#0f172a_0%,#0369a1_45%,#06b6d4_100%)] bg-clip-text text-transparent">
                  locadoras, vendedores e parceiros
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Esta área protege comissão, aceite comercial, cadastro empresarial e informações
                internas da operação. O acesso deve ser feito apenas por empresas autorizadas.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                    Proteção comercial
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Comissão resguardada
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    A política comercial da plataforma permanece em ambiente restrito para evitar
                    desintermediação, vazamento de regras internas e negociação por fora.
                  </p>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                    Login real
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Autenticação empresarial
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Agora a entrada já usa autenticação real por e-mail e senha. Na próxima etapa,
                    vamos aplicar perfis por tipo de empresa e blindagem completa do painel.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-amber-100 bg-[linear-gradient(135deg,#fffdf4_0%,#ffffff_100%)] p-4 text-sm text-slate-600 shadow-sm">
                <span className="font-semibold text-amber-700">Sistema em constante atualização:</span>{" "}
                pode haver momentos de instabilidade durante melhorias, blindagens e integrações da área empresarial.
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Acesso empresarial
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.02em] text-slate-950">
                Entrar na área restrita
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use o e-mail e a senha da empresa ou do vendedor autorizado para acessar a área interna.
              </p>

              <div className="mt-8 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    E-mail de acesso
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
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
                  onClick={entrar}
                  disabled={entrando}
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0284c7_0%,#06b6d4_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(2,132,199,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {entrando ? "Entrando..." : "Entrar"}
                </button>

                <button
                  type="button"
                  onClick={sairDaSessaoAtual}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Encerrar sessão
                </button>

                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Voltar para a home
                </a>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-sm leading-7 text-slate-600">
                  <span className="font-semibold text-slate-950">Próxima evolução:</span>{" "}
                  recuperação de senha, criação guiada de acesso para empresas, perfis por tipo de usuário
                  e validação real de permissão para o cadastro empresarial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}