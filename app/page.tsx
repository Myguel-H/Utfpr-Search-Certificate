"use client"

import { useState } from "react"
import { Download, FolderOpen, Play, ShieldCheck, Square, Terminal, CircleHelp } from "lucide-react"

const etapas = ["Configuração", "Busca", "Download"]

export default function Page() {
  const [rodando, setRodando] = useState(false)
  const [nome, setNome] = useState("SEU NOME AQUI")
  const [campus, setCampus] = useState("Francisco Beltrão")
  const [anos, setAnos] = useState("2023, 2024, 2025, 2026")
  const [pasta, setPasta] = useState("./certificados")

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <header className="border-b border-[#e4e9f1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#123b66] text-white">
              <Download className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#123b66]">UTFPR CERTIFICADOS</p>
              <p className="text-xs text-[#718096]">Automação local para downloads</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#edf8f1] px-3 py-1.5 text-xs font-medium text-[#247344]">
            <ShieldCheck className="size-4" /> Execução local
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1.4fr_0.8fr]">
        <section>
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold text-[#3574ad]">BUSCA DE CERTIFICADOS</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[#172033]">Encontre e baixe seus certificados sem repetir o processo.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#667085]">O bot acessa a lista pública da UTFPR, percorre os anos e eventos informados e salva os PDFs automaticamente no seu computador.</p>
          </div>

          <div className="rounded-2xl border border-[#e1e7ef] bg-white p-6 shadow-[0_12px_35px_rgba(24,48,80,0.06)]">
            <div className="mb-6 flex items-center justify-between border-b border-[#edf0f5] pb-5">
              <div>
                <h2 className="font-semibold">Configuração da busca</h2>
                <p className="mt-1 text-sm text-[#718096]">Use o mesmo nome exibido no certificado.</p>
              </div>
              <CircleHelp className="size-5 text-[#9aa7b8]" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Nome para buscar<input value={nome} onChange={(e) => setNome(e.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3ec] bg-[#fbfcfe] px-3.5 py-3 font-normal outline-none transition focus:border-[#3574ad] focus:ring-2 focus:ring-[#dcebf8]" /></label>
              <label className="text-sm font-medium">Campus<select value={campus} onChange={(e) => setCampus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3ec] bg-[#fbfcfe] px-3.5 py-3 font-normal outline-none transition focus:border-[#3574ad] focus:ring-2 focus:ring-[#dcebf8]"><option>Francisco Beltrão</option><option>Curitiba</option><option>Pato Branco</option><option>Todos</option></select></label>
              <label className="text-sm font-medium sm:col-span-2">Anos <span className="font-normal text-[#8a96a6]">(separados por vírgula)</span><input value={anos} onChange={(e) => setAnos(e.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3ec] bg-[#fbfcfe] px-3.5 py-3 font-normal outline-none transition focus:border-[#3574ad] focus:ring-2 focus:ring-[#dcebf8]" /></label>
              <label className="text-sm font-medium sm:col-span-2">Pasta de destino<input value={pasta} onChange={(e) => setPasta(e.target.value)} className="mt-2 w-full rounded-xl border border-[#dce3ec] bg-[#fbfcfe] px-3.5 py-3 font-mono text-sm font-normal outline-none transition focus:border-[#3574ad] focus:ring-2 focus:ring-[#dcebf8]" /></label>
            </div>
            <button onClick={() => setRodando(!rodando)} className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white transition ${rodando ? "bg-[#bd3d48] hover:bg-[#a9313b]" : "bg-[#123b66] hover:bg-[#0e3155]"}`}>
              {rodando ? <><Square className="size-4" /> Parar bot</> : <><Play className="size-4" /> Iniciar busca</>}
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#e1e7ef] bg-white p-6">
            <div className="mb-6 flex items-center gap-3"><Terminal className="size-5 text-[#3574ad]" /><h2 className="font-semibold">Status da execução</h2></div>
            <div className="mb-6 flex items-center justify-between text-sm"><span className="text-[#718096]">Estado atual</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rodando ? "bg-[#fff4df] text-[#9a6500]" : "bg-[#f0f2f5] text-[#6b7788]"}`}>{rodando ? "Em execução" : "Aguardando"}</span></div>
            <div className="space-y-4">{etapas.map((etapa, index) => <div key={etapa} className="flex items-center gap-3"><div className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${rodando && index === 1 ? "bg-[#dcecf8] text-[#236191]" : "bg-[#f0f2f5] text-[#8995a5]"}`}>{index + 1}</div><span className={`text-sm ${rodando && index === 1 ? "font-semibold text-[#172033]" : "text-[#718096]"}`}>{etapa}</span>{index < 2 && <div className="ml-auto h-px w-6 bg-[#e4e9f1]" />}</div>)}</div>
          </div>
          <div className="rounded-2xl border border-[#dcebf8] bg-[#eef7fd] p-6"><div className="mb-3 flex items-center gap-2 text-[#236191]"><FolderOpen className="size-5" /><h2 className="font-semibold">Como usar localmente</h2></div><ol className="space-y-2 text-sm leading-6 text-[#45627c]"><li>1. Baixe o projeto e instale as dependências.</li><li>2. Execute o comando do bot no terminal.</li><li>3. Permita downloads múltiplos quando o navegador solicitar.</li></ol></div>
          <div className="rounded-2xl border border-[#f0dfb7] bg-[#fffaf0] p-5 text-sm leading-6 text-[#7e6735]">O bot usa somente a página pública da UTFPR e não precisa de login ou captcha. Se a página começar a recarregar sem parar, interrompa a execução.</div>
        </aside>
      </div>
    </main>
  )
}
