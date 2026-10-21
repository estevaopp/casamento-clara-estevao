# Chá de Panela — Estêvão & Clara

Site responsivo de lista de presentes com busca, filtros, reservas compartilhadas e cancelamento pelo próprio convidado. O projeto usa Node.js + Express e salva as reservas em `reservas.json`.

## Rodar no computador

1. Instale Node.js (versão LTS).
2. Extraia o ZIP.
3. Abra o terminal na pasta do projeto.
4. Execute:

   ```bash
   npm install
   npm start
   ```

5. Acesse http://localhost:3000

## Como adicionar ou trocar imagens

1. Coloque os arquivos de imagem em `public/images/`.
2. Abra `server.js` e localize a lista `initialGifts`.
3. Em cada presente, altere o campo `image`, por exemplo:

   ```js
   {
     id: 1,
     name: "Jogo de panelas inox",
     category: "Panelas e utensílios",
     emoji: "🍲",
     image: "/images/jogo-panelas.jpg",
     description: "Para preparar muitas receitas juntos."
   }
   ```

4. Salve e reinicie o servidor. Se não encontrar a imagem, o cartão mostra o emoji de reserva.

Os nomes dos arquivos devem corresponder exatamente, inclusive maiúsculas/minúsculas. São aceitos JPG, PNG, WEBP e outros formatos de imagem suportados pelo navegador. Você também pode usar uma URL pública no campo `image`, por exemplo `https://exemplo.com/imagem.jpg`.

## Alterar a lista de presentes

Edite `initialGifts` em `server.js`. Cada item deve ter um `id` numérico único, `name`, `category`, `image` e `description`. Depois, reinicie o servidor.

## Publicar na internet (exemplo: Render)

- Suba o projeto para um repositório Git.
- Crie um serviço Web no Render conectado ao repositório.
- Build command: `npm install`
- Start command: `npm start`
- Configure um disco persistente montado na pasta do projeto para manter `reservas.json` após reinicializações/deploys. Sem armazenamento persistente, as reservas podem ser perdidas conforme o ambiente de hospedagem.

## Sobre cancelamentos

O convidado clica em **Cancelar reserva** e informa o mesmo nome usado ao reservar. O sistema compara esse nome com o nome registrado. É uma solução simples para um chá de panela; não é autenticação forte, pois outra pessoa que saiba o nome exato poderá tentar cancelar a reserva.

## Estrutura

- `server.js` — API, lista de presentes e reservas.
- `public/index.html` — página principal.
- `public/styles.css` — visual e responsividade.
- `public/app.js` — busca, filtros, reservas e cancelamento.
- `public/images/` — coloque aqui as imagens dos presentes.
- `reservas.json` — criado automaticamente após a primeira reserva.
# casamento-clara-estevao
# casamento-clara-estevao
