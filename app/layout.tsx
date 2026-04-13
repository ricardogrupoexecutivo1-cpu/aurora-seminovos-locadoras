import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aurora IA | Seminovos Locadoras',
  description:
    'Marketplace exclusivo para compra e venda de veículos com toda a infraestrutura da Aurora IA.',
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/buscar-veiculos', label: 'Buscar veículos' },
  { href: '/area-comprador', label: 'Compradores' },
  { href: '/cadastrar-empresa', label: 'Empresas' },
  { href: '/bancos', label: 'Bancos' },
  { href: '/planos', label: 'Planos' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
                Aurora IA
              </p>
              <h1 className="text-lg font-black">
                Seminovos Locadoras
              </h1>
            </div>

            <nav className="flex gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-600">
            Sistema em constante atualização — pode haver momentos de instabilidade.
          </div>
        </footer>
      </body>
    </html>
  )
}