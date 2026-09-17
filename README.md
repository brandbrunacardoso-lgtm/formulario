# Briefing de Criação de Sites

Aplicação web pública (sem login) para coleta de briefing de clientes, em 5
etapas, com upload de arquivos, conectada ao Supabase já existente do projeto
"Formulário".

## O que foi encontrado e feito no Supabase existente

Antes de escrever qualquer código, o projeto Supabase (`psjpkdybsextocmgavvy`)
foi inspecionado diretamente (sem apagar ou recriar nada):

- **Tabela usada: `briefings`** — já existia com as colunas `id` (uuid),
  `created_at`, `respostas` (jsonb), `arquivos` (jsonb), `status` (com check
  `novo | em análise | em produção | finalizado`) e `updated_at`. É a tabela
  correta para este formulário, por já ter espaço para respostas e arquivos
  estruturados.
- **Tabela `respostas` não foi usada nem alterada** — já existia no banco com
  uma estrutura mais genérica (`dados` jsonb + `arquivo` texto único). Ela foi
  deixada intacta, conforme instruído, para não criar duplicidade nem
  interferir em algo que já possa estar em uso.
- **Bucket de Storage usado: `Anexos`** — já existia, é privado. Nenhum bucket
  novo foi criado.
- **Ajuste necessário e já aplicado:** a política de INSERT do bucket
  `Anexos` para o papel `anon` comparava `bucket_id = 'anexos'` (minúsculo),
  mas o bucket real se chama `Anexos` (maiúsculo). Isso bloquearia **todos**
  os uploads públicos. A política foi corrigida para comparar com `'Anexos'`
  (mesmo texto, sem apagar dados — o bucket estava vazio). Nenhuma outra
  alteração estrutural foi feita.
- As políticas de RLS existentes já permitiam `INSERT` anônimo em `briefings`
  e em `storage.objects` (bucket `Anexos`), então o fluxo público de envio
  funciona sem exigir login.

Você acessa as respostas diretamente pelo painel do Supabase (Table Editor →
`briefings`) e os arquivos pelo Storage → bucket `Anexos`.

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Já preenchidas em `.env.local.example` com a URL e a chave **publishable**
(pública) do Supabase — nunca a `service_role`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Publicando na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Em "Environment Variables", adicione as duas variáveis acima.
4. Deploy. O link gerado pela Vercel é o link público a ser enviado aos
   clientes.

## Estrutura do projeto

```
app/                 Rotas e layout do Next.js (App Router)
components/          Componentes de UI (formulário, campos, sucesso)
data/questions.ts    As 5 etapas e todas as perguntas/opções, texto fiel ao briefing
lib/supabaseClient.ts   Cliente Supabase (chave pública)
lib/uploadFiles.ts      Upload de arquivos para o Storage
lib/submitBriefing.ts   Orquestra upload + insert final (1 envio = 1 registro)
types/briefing.ts       Tipos TypeScript do domínio do formulário
```

## Como o envio funciona

1. O cliente preenche as 5 etapas; as respostas ficam em memória (estado do
   React) e não se perdem ao clicar em "Voltar".
2. Nenhum campo é obrigatório; é possível enviar o briefing totalmente vazio.
3. Arquivos selecionados só são enviados ao Supabase quando o cliente clica
   em **"Enviar Briefing"** — antes disso ficam apenas na memória do
   navegador, podendo ser removidos livremente.
4. Ao clicar em "Enviar Briefing":
   - o botão é desabilitado (evita duplo envio);
   - é gerado um ID único para o envio;
   - os arquivos são enviados ao bucket `Anexos`, organizados em
     `ID-do-envio/campo/arquivo`;
   - um único registro é inserido na tabela `briefings`, com `respostas`
     (agrupadas por etapa, preservando arrays de múltipla seleção e textos
     vazios) e `arquivos` (caminhos no Storage agrupados por campo);
   - a tela de sucesso só aparece após a confirmação do Supabase.
5. Se algo falhar (upload ou inserção), nada é marcado como sucesso, uma
   mensagem de erro aparece e as respostas preenchidas continuam lá para nova
   tentativa.

## Design

Paleta preto/bege/neutros, tipografia com hierarquia clara entre título
principal, título da etapa, perguntas, textos de apoio e mensagens, bastante
espaço em branco, um único cartão por etapa e navegação por etapas com barra
de progresso. Totalmente responsivo, com atenção especial à experiência em
celular (inclusive para os campos de upload).
