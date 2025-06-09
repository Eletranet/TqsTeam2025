Feature: Login do utilizador Para Ver Suas Reservas

  Como utilizador da aplicação
  Quero autenticar-me com nome de utilizador e palavra-passe válidos
  Para poder aceder conseguir ver as minhas reservas

  Scenario: Login com credenciais válidas
    Given o utilizador abre a página de login
    When o utilizador insere o nome de utilizador "dovas123dovas"
    And o utilizador insere a palavra-passe "123456"
    And o utilizador clica no botão de login
    And o utilizador deve ser redirecionado para a homepage
    And o utilizador clica no botão de minhas reservas
    And o utilizador deve ser redirecionado para a a pagina de suas reservas
    Then deve ver o texto "Minhas Reservas" na página


