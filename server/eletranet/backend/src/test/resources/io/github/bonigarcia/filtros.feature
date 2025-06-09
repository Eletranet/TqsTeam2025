Feature: Filtragem de postos de carregamento
  Como utilizador autenticado
  Quero poder filtrar postos de carregamento por tipo de conector
  Para encontrar apenas os que me interessam

  Scenario: Filtrar postos por tipo CCS
    Given que estou autenticado
    When filtro por tipo CCS e TIPO2
    Then deve ver o texto Mostrando 12 de 20 estações na página
