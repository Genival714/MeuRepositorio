# Pokédex Completa

Uma Pokédex interativa com informações detalhadas sobre todos os Pokémon.

## Funcionalidades

- **Pesquisa por Nome ou ID**: Busque qualquer Pokémon pelo nome ou número da Pokédex.
- **Informações Detalhadas**:
  - Imagens oficiais e pixel art
  - Modelos 3D
  - Estatísticas básicas e máximas
  - Tipos e relações de dano
  - Habilidades e descrições
  - Grupos de ovos
  - Cadeia evolutiva
  - Movimentos com detalhes (nível, força, precisão, PP)
  - Localizações por versão de jogo
  - Formas alternativas (Alolan, Galarian, Mega, etc.)

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS, flexbox e grid)
- JavaScript (ES6+, Fetch API, async/await)
- API: [PokéAPI](https://pokeapi.co/)

## Como Usar

1. Clone este repositório:
   ```
   git clone https://github.com/seu-usuario/pokedex-completa.git
   ```

2. Abra o arquivo `index.html` em seu navegador ou utilize um servidor local.

3. Digite o nome ou ID de um Pokémon na barra de pesquisa e pressione "Buscar".

4. Explore as informações detalhadas do Pokémon pesquisado.

## Recursos Adicionais

- **Modo Escuro**: Clique no botão no canto inferior direito para alternar entre os temas claro e escuro.
- **Interface Responsiva**: A aplicação funciona bem em dispositivos móveis, tablets e desktops.

## Notas de Implementação

- A aplicação utiliza a PokéAPI para obter os dados de todos os Pokémon.
- Os dados são carregados dinamicamente para reduzir o tempo de carregamento inicial.
- A preferência de tema é salva localmente para manter a consistência entre sessões.

## Atribuições

- Todos os dados dos Pokémon são obtidos através da [PokéAPI](https://pokeapi.co/).
- Pokémon e todos os nomes relacionados são propriedade de Nintendo/Creatures Inc./GAME FREAK Inc.

## Screenshots

![Screenshot da aplicação](img/screenshot.png)

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 