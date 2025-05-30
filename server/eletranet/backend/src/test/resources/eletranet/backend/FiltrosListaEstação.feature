# language: pt

Funcionalidade: Filtrar a lista de estações
  Contexto: Lista de estações
    Dado que tenho sessão iniciada
       E acabo de abrir a lista de estações

  Cenário: Filtrar por estado
    Quando seleciono o estado "Ativa"
    Então só vejo estações cujo estado é "Ativa"

  # Cenário: Filtrar por tipo de conector
  #   Quando seleciono o conector "CCS"
  #   Então só vejo estações com conector "CCS"
  #
  # Cenário: Não filtrar por tipo de conector
  #   Quando a opção "Todos" está selecionada
  #   Então vejo estações com todo o tipo de conectores
  #
  # Cenário: Sem filtro de conector selecionado
  #   Quando não seleciono nenhum conector
  #   Então vejo estações com todo o tipo de conectores
  #   E a opção "Todos" está selecionada
