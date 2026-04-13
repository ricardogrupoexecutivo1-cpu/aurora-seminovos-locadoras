export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Seminovos Locadoras
      </h1>

      <p className="text-lg text-center max-w-xl mb-6">
        Plataforma profissional para compra, venda e gestão de veículos entre locadoras,
        concessionárias e compradores.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <a href="/buscar-veiculos" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Buscar veículos
        </a>

        <a href="/compradores" className="bg-gray-200 px-6 py-3 rounded-lg">
          Compradores
        </a>

        <a href="/cadastrar-empresa" className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Cadastrar empresa
        </a>
      </div>

      <p className="text-sm mt-8 text-gray-500">
        Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.
      </p>
    </main>
  );
}