import { chromium } from "playwright"
import fs from "node:fs/promises"
import path from "node:path"

const config = {
  nome: process.env.UTFPR_NOME || "SEU NOME AQUI",
  campus: process.env.UTFPR_CAMPUS || "Francisco Beltrão",
  anos: (process.env.UTFPR_ANOS || "2023,2024,2025,2026").split(",").map((ano) => ano.trim()).filter(Boolean),
  pasta: process.env.UTFPR_PASTA || "./certificados",
}

const url = "https://apl.utfpr.edu.br/extensao/certificados/listaPublica"
await fs.mkdir(config.pasta, { recursive: true })

const browser = await chromium.launch({ headless: false })
const context = await browser.newContext({ acceptDownloads: true })
const page = await context.newPage()

async function selecionar(select, valor) {
  await select.waitFor({ state: "visible" })
  const option = await select.locator("option").evaluateAll((options, esperado) => {
    const normalizar = (texto) => texto.replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR")
    const alvo = normalizar(esperado)
    const encontrada = options.find((item) => normalizar(item.textContent || "") === alvo)
    return encontrada ? { value: encontrada.value, label: encontrada.textContent?.trim() || "" } : null
  }, valor)
  if (!option?.value) throw new Error(`Opção exata não encontrada: ${valor}`)
  console.log(`Selecionando ${option.label}`)
  const value = option.value

  await Promise.all([
    page.waitForLoadState("domcontentloaded").catch(() => {}),
    select.selectOption(value),
  ])
  await page.waitForTimeout(900)
}

async function abrirSelecao(campus, ano) {
  await page.goto(url, { waitUntil: "domcontentloaded" })
  const selects = page.locator("select")
  await selecionar(selects.nth(0), campus)
  await selecionar(page.locator("select").nth(1), ano)
  return page.locator("select").nth(2).locator("option").evaluateAll((options) =>
    options
      .map((option) => ({ value: option.value, label: option.textContent?.trim() || "" }))
      .filter((option) => option.value && option.label && !/^selecione/i.test(option.label)),
  )
}

async function baixarCertificado(ano, evento) {
  await abrirSelecao(config.campus, ano)
  const eventoSelect = page.locator("select").nth(2)
  await eventoSelect.selectOption(evento.value)
  await page.waitForLoadState("domcontentloaded").catch(() => {})
  await page.waitForTimeout(1100)

  const campo = page.locator('input[type="text"]').first()
  await campo.fill(config.nome)
  const pesquisar = page.getByRole("button", { name: /pesquisar|buscar/i }).first()
  await pesquisar.click()
  await page.waitForLoadState("domcontentloaded").catch(() => {})
  await page.waitForTimeout(900)

  const linha = page.locator("tr").filter({ hasText: new RegExp(config.nome, "i") }).first()
  const emitir = linha.locator("a").first()
  if (!(await emitir.count())) return false

  await emitir.click()
  await page.waitForLoadState("domcontentloaded").catch(() => {})
  await page.waitForTimeout(700)

  const linkPdf = page.locator("a").filter({ hasText: /clique aqui|gerar|certificado|pdf/i }).first()
  if (!(await linkPdf.count())) return false

  const nomeArquivo = `${ano}-${evento.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    linkPdf.click(),
  ])
  await download.saveAs(path.join(config.pasta, nomeArquivo))
  console.log(`Salvo: ${nomeArquivo}`)
  return true
}

try {
  for (const ano of config.anos) {
    console.log(`\nBuscando eventos de ${ano}...`)
    const eventos = await abrirSelecao(config.campus, ano)

    for (const evento of eventos) {
      console.log(`Evento: ${evento.label}`)
      try {
        const encontrou = await baixarCertificado(ano, evento)
        if (!encontrou) console.log(`Nenhum certificado encontrado para ${config.nome}.`)
      } catch (error) {
        console.warn(`Não foi possível processar ${evento.label}: ${error.message}`)
      }
    }
  }
  console.log(`\nConcluído. Arquivos em: ${path.resolve(config.pasta)}`)
} finally {
  await browser.close()
}
