# Poké Search

Pokédex com as nove gerações e o jogo **Quem é esse Pokémon?**, em **português e inglês**
(`?lang=pt` ou `?lang=en` na URL).

**Acesse:** [pokesearch.coaladev.com.br](https://pokesearch.coaladev.com.br)

- **Pokédex:** busca por nome ou número, filtros por tipo e geração, e detalhe com tipos,
  altura, peso, habilidades e atributos base. Busca, filtros e Pokémon aberto ficam na URL.
- **Quem é esse Pokémon?:** adivinhe pela silhueta, escolhendo entre quatro nomes ou digitando.
  Três vidas, pontos maiores com sequências de acertos, dica opcional e recorde por regras.

## Como funciona

Os dados vêm da [PokéAPI](https://pokeapi.co), guardados em `src/data/pokemon.json` por
`npm run snapshot` (uma consulta GraphQL), então o app não depende da API em tempo real. As
imagens passam por `/sprites/`, que em produção o servidor guarda em cache.

## Stack

- [Vue 3](https://vuejs.org), TypeScript, [Vue Router](https://router.vuejs.org) e [Pinia](https://pinia.vuejs.org)
- [Vite](https://vite.dev)
- CSS próprio, sem biblioteca de componentes

## Rodando

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
```

Com Docker (em produção, as imagens em `/sprites/` são servidas por um proxy na frente do
container):

```bash
docker build -t poke-search .
docker run -p 4704:80 poke-search
```
