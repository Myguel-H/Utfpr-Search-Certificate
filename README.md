# UTFPR Certificados

Um app simples para **estudantes da UTFPR** que querem baixar os certificados de
palestras, cursos e eventos que já participaram — mas não lembram mais quais foram,
nem em que ano.

Você informa **quem é** (seu nome), **qual campus** e **quais anos** quer procurar.
O programa abre o navegador, percorre a lista pública da UTFPR, evento por evento,
e salva os PDFs dos seus certificados numa pasta do seu computador.

> Não precisa de login, senha ou captcha. O app usa **somente a página pública** de
> certificados da UTFPR.

---

## Como funciona

O projeto tem duas partes:

1. **Interface web** (pasta `app/`) — uma página visual, feita com Next.js, que
   mostra o formulário de configuração e explica o passo a passo. É só um guia
   bonito da ferramenta.

2. **O bot de verdade** (`scripts/utfpr-certificados.mjs`) — um script Node.js que
   usa o [Playwright](https://playwright.dev/) (um navegador automatizado) para:

   1. Abrir a página pública `https://apl.utfpr.edu.br/extensao/certificados/listaPublica`
   2. Escolher o **campus** e o **ano** nos menus da página
   3. Listar todos os **eventos** disponíveis naquele ano
   4. Para cada evento, digitar o **seu nome**, pesquisar e, se encontrar um
      certificado seu, baixar o PDF
   5. Salvar tudo numa pasta, com nomes do tipo `2024-nome-do-evento.pdf`

O bot é **local**: roda no seu próprio computador e só acessa a página pública da UTFPR.

---

## Requisitos

- **Node.js** 18 ou superior ([nodejs.org](https://nodejs.org/))
- **pnpm** (gerenciador de pacotes). Se ainda não tiver, instale com:
  ```bash
  npm install -g pnpm
  ```

---

## Instalação

1. Baixe ou clone este repositório:
   ```bash
   git clone <endereco-do-repositorio>
   cd Utfpr-Search-Certificate
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Instale o navegador que o bot controla (o Playwright precisa do Chromium):
   ```bash
   pnpm exec playwright install chromium
   ```

---

## Como configurar a busca

A configuração é feita por **variáveis de ambiente** antes de rodar o bot. Você
define quatro coisas:

| Variável      | O que é                                              | Exemplo                       | Padrão (se não definir)         |
| ------------- | ---------------------------------------------------- | ----------------------------- | ------------------------------- |
| `UTFPR_NOME`  | **Seu nome**, exatamente como aparece no certificado | `João da Silva`               | `SEU NOME AQUI`                 |
| `UTFPR_CAMPUS`| Campus onde você participou dos eventos              | `Francisco Beltrão`           | `Francisco Beltrão`             |
| `UTFPR_ANOS`  | Anos que quer procurar, separados por vírgula        | `2023,2024,2025`              | `2023,2024,2025,2026`           |
| `UTFPR_PASTA` | Pasta onde os PDFs serão salvos                      | `./certificados`              | `./certificados`                |

### Dicas importantes

- **Nome:** use o mesmo nome exibido no certificado oficial. Se o sistema encontrar
  um texto igual ao seu nome numa lista, ele baixa o certificado.
- **Campus:** digite o nome **exatamente** como ele aparece no menu da página da
  UTFPR (maiúsculas, acentos e tudo). Exemplos comuns: `Francisco Beltrão`,
  `Curitiba`, `Pato Branco`.
- **Anos:** liste só os anos que você quer, separados por vírgula, sem espaço
  obrigatório. Ex.: `2022,2023,2024`.

---

## Como rodar

### Opção 1 — definindo as variáveis no terminal (recomendado)

**No Linux ou macOS** (Terminal):
```bash
UTFPR_NOME="João da Silva" \
UTFPR_CAMPUS="Francisco Beltrão" \
UTFPR_ANOS="2023,2024,2025" \
UTFPR_PASTA="./certificados" \
pnpm run certificados
```

**No Windows (PowerShell):**
```powershell
$env:UTFPR_NOME="João da Silva"
$env:UTFPR_CAMPUS="Francisco Beltrão"
$env:UTFPR_ANOS="2023,2024,2025"
$env:UTFPR_PASTA="./certificados"
pnpm run certificados
```

### Opção 2 — usando um arquivo `.env`

Crie um arquivo chamado `.env` na pasta do projeto com este conteúdo:
```env
UTFPR_NOME=João da Silva
UTFPR_CAMPUS=Francisco Beltrão
UTFPR_ANOS=2023,2024,2025
UTFPR_PASTA=./certificados
```
> Se usar `.env`, o script lê as variáveis automaticamente. Não é preciso digitar
> elas no terminal.

Depois é só rodar:
```bash
pnpm run certificados
```

---

## O que acontece quando o bot roda

- Uma janela de navegador (Chromium) se abre e mostra cada etapa em tempo real.
- No terminal você vê o progresso: quais anos e eventos estão sendo verificados.
- Quando um certificado seu é encontrado, o PDF é salvo na pasta definida.
- Ao final, aparece a mensagem `Concluído` com o caminho completo da pasta.

Os arquivos ficam em:
```
certificados/
├── 2023-nome-do-evento.pdf
├── 2024-nome-do-evento.pdf
└── ...
```

Se o bot não encontrar nenhum certificado seu num evento, ele só avisa e continua
no próximo — nada é interrompido.

---

## Ver os resultados

No final da execução, o terminal mostra o caminho absoluto da pasta. Abra-a no
explorador de arquivos e veja seus certificados.

---

## Rodar a interface web (opcional)

Se quiser só visualizar a página explicativa do app:
```bash
pnpm run dev
```
Ela abre no navegador (geralmente em http://localhost:3000).

---

## Solução de problemas

- **"Opção exata não encontrada"** para o campus ou ano: o nome que você digitou
  não bate com o da página da UTFPR. Confira a grafia, acentos e maiúsculas.
- **Nenhum PDF baixado:** verifique se o **nome** está idêntico ao do certificado.
  Um erro de digitação impede o match.
- **O navegador recarrega sem parar:** interrompa a execução (Ctrl + C no terminal)
  e reduza a quantidade de anos/eventos de uma vez.
- **Erro ao rodar o bot:** confirme que executou `pnpm exec playwright install chromium`.

---

## Estrutura do projeto

```
Utfpr-Search-Certificate/
├── app/                      # Interface web (Next.js)
│   ├── page.tsx              # Página com o formulário e explicação
│   └── layout.tsx
├── scripts/
│   └── utfpr-certificados.mjs  # O bot: busca e baixa os certificados
├── certificados/             # Pasta onde os PDFs são salvos
├── package.json
└── ...
```

---

## Aviso

Este é um projeto de automação pessoal que acessa **exclusivamente a página pública**
de certificados da UTFPR. Use de forma responsável e apenas para baixar os seus
próprios certificados.
