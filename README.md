# 🛰️ MIRCA CONTROL — Plataforma Digital Integrada
### Gestão Inteligente de Marcenaria Residencial & Segurança Eletrónica Corporativa

Bem-vindo à plataforma digital oficial da **MIRCA Lda**. Este projeto foi desenvolvido para unificar duas divisões de negócio altamente estratégicas: **Mobiliário Customizado (Marcenaria)** de alto padrão e **Sistemas Integrados de Segurança Eletrónica** (CCTV, controle de acessos, automação). 

O sistema oferece uma experiência pública premium e elegante para os clientes descobrirem produtos e solicitarem orçamentos estimativos, aliada a um console administrativo completo e seguro (**MIRCA CONTROL**) para a equipa gerenciar todos os aspectos corporativos da empresa nos bastidores.

---

## 💎 Características do Design & Filosofia Visual

A interface do projeto foi desenvolvida sob uma filosofia de **alta fidelidade visual** e **clareza de fluxo**:
- **Aparência de Alto Nível**: Utilização refinada de tons escuros corporativos (`#202A50` Slate Deep Blue) pareados com acentos laranja energéticos (`#FF6B00`) para reforçar a agilidade técnica e o acabamento nobre de design de interiores.
- **Tipografia Esculpida**: Fontes limpas com proporções equilibradas de espaço em branco garantem ótima legibilidade e excelente densidade de informação, tanto em desktops de alta resolução quanto em ecrãs móveis de toque.
- **Ausência de Poluição Visual**: Sem elementos decorativos fantasiosos, dados de simulação desordenados ou telemetrias vazias. O layout exibe apenas o que é essencial e valioso para a jornada de negócios do operador e do cliente.

---

## 🚀 Módulos Funcionais e Recursos da Solução

O sistema divide-se em duas grandes frentes operacionais integradas em tempo de execução através do módulo de serviços do banco de dados:

### 1. Interface Pública do Cliente (Showroom & Orçamentos)
- **Slider Hero Rotativo**: Banners promocionais com transições dinâmicas, slogans editáveis de campanhas de segurança ou portfólios de marcenaria e links com chamadas para ação (CTA) parametrizáveis.
- **Catálogo de Produtos Inteligente**: Exposição de mobiliários prontos, kits de câmaras e alarmes com filtros em tempo real por divisões de negócio e pesquisa textual por termos de busca.
- **Carrinho de Pedidos Rápidos**: Permite aos clientes adicionarem itens do catálogo diretamente a uma sacola de compras virtual para envio de intenções de aquisição personalizadas.
- **Central de CRM de Orçamentos (Solicitações)**: Formulário interativo onde o utilizador escolhe serviços (ex: instalação de alarmes, planejamento de cozinhas), preenche os seus contactos e descreve a obra para receber uma simulação segura.

### 2. Painel MIRCA CONTROL (Console Administrativo)
- **Monitor Geral (Dashboard)**: Métricas instantâneas sobre negócios pendentes, tickets de carrinho ativos, contagem de produtos no inventário, taxa de conversão e timelines de atividades recentes.
- **CRM de Orçamentos**: Mesa para triagem manual de solicitações de clientes, permitindo aos profissionais aprovar, reprovar ou atualizar status, com botões dedicados de contacto por e-mail ou WhatsApp direto.
- **Pedidos do Carrinho**: Controle e despacho das intenções de compra de produtos enviadas pelos clientes do showroom público.
- **Gestão de Inventário (Catálogo & Divisões)**: CRUD completo para adicionar, editar ou remover itens do catálogo, alterar fotos, preços estimativos, categorias e visibilidade de stock.
- **Controle de Portfólio & Obras**: Mostruário para a equipa manter os projetos concluídos atualizados na página web, demonstrando credibilidade técnica aos novos visitantes.
- **Gestor de Conteúdo (CMS)**: Edição direta das diretrizes da empresa (Historial, Missão, Visão e Valores), contactos telefónicos oficiais, horários de atendimento e links para redes sociais (Facebook, Instagram, LinkedIn).
- **Slider de Campanhas**: Permite aos administradores alterarem as imagens de fundo do banner rotativo, slogans e posições de exibição sem tocar em código de desenvolvimento.
- **Segurança RBAC (Equipa & Portaria)**: Sistema de controlo de permissões integrado. Apenas utilizadores com a função de *Super-Administrador* (Coordenador) conseguem alterar variáveis fiscais, auditar logs ou alterar privilégios de outros membros da equipa.
- **Pistas de Auditoria (Logs do Sistema)**: Gravação detalhada de cada edição, criação ou remoção feita na base de dados, identificando o operador responsável com data e hora exata para prevenção de falhas e auditorias legais.

---

## 📖 Guia Total de Utilização do Site

Abaixo encontra-se o manual completo de etapas para navegação pública de demonstração ao cliente e controle administrativo.

### 🧭 Jornada de Demonstração para Clientes

Como conduzir um potencial cliente pelo showroom digital para fechar negócios:

1. **Impacto Inicial (Homepage)**: 
   - Mostre o **Slider Hero** no topo. Explique que esses painéis promovem as campanhas ativas da empresa (ex: *"Cozinhas Planeadas"* ou *"Alarmes Inteligentes"*).
2. **Navegando no Catálogo**: 
   - Vá ao menu de produtos. Filtre por "Segurança Eletrónica" para ver kits e equipamentos de videovigilância, ou por "Marcenaria" para visualizar roupeiros e balcões sob medida.
3. **Simulando um Envio de Carrinho**:
   - Clique em *"Adicionar ao Carrinho"* em dois ou três itens.
   - Abra o ícone do carrinho no cabeçalho. Preencha os campos básicos do cliente e finalize o pedido de simulação para gerar um código identificador automático.
4. **Solicitando um Orçamento Customizado**:
   - Navegue até à seção de *"Orçamentos"*.
   - Preencha os dados fictícios (Nome, WhatsApp, E-mail, Tipo de Serviço necessitado, e descrição).
   - Envie o formulário para demonstrar como o sinal verde de triagem é gerado.

---

### 🖥️ Jornada de Controle para Administradores

Como operar o Painel Administrativo de forma consistente passo a passo:

1. **Acessar o Terminal**:
   - Vá para a rota `/admin/login` no rodapé da página ou menu de operador.
   - Utilize as credenciais fornecidas para autenticação na central segura MIRCA CONTROL.
2. **Gerir Solicitações Pendentes (CRM)**:
   - Abra o menu **CRM Orçamentos**.
   - Veja o último orçamento gerado pelo cliente na seção anterior. O status estará como **Pendente (Por Triar)**.
   - Clique em *"Visualizar Detalhes"*, mude o status para **Em Análise** ou **Aprovado**, adicione notas do técnico e verifique como a mudança atualiza instantaneamente a linha do tempo.
   - Teste o atalho de WhatsApp para ver o pré-preenchimento da mensagem de abertura contendo os dados do orçamento.
3. **Controlar Inventários**:
   - Clique em **Catálogo Produtos** e selecione *"Novo Produto"*.
   - Adicione um item promocional com link de imagem direta do *Unsplash*, defina uma categoria e salve. O produto aparecerá imediatamente no showroom público dos clientes.
4. **Ajustar Campanhas do Slide Principal**:
   - Navegue em **Slider Hero Rotativo**.
   - Crie um novo slide de alta relevância ou ordene as prioridades de exibição dos existentes para testar a flexibilidade do CMS.
5. **Auditar Atividades e Logs**:
   - Se possuir login corporativo de **Coordenador/Administrador principal**, vá ao separador **Pistas de Auditoria**.
   - Visualize as linhas do histórico contendo os nomes de quem realizou cada alteração, as ações executadas e hora do evento.
6. **Redefinição Total de Demonstrações (Seed Reset)**:
   - Se necessitar demonstrar o sistema para outro cliente com o banco limpo e dados fictícios organizados, vá a **Configurações** e clique em **Re-Seed Bancos de Dados**. Isto restaurará o estado padrão perfeito em segundos de forma segura.

---

## 🛠️ Arquitetura Técnica & Tecnologias Usadas

O sistema foi concebido utilizando práticas modernas de desenvolvimento web focado em robustez, portabilidade e performance ponta a ponta:

```
┌────────────────────────────────────────────────────────┐
│                      APLICAÇÃO CLIENTE                 │
│                 React 18 + Vite (TypeScript)           │
└───────────────────────────┬────────────────────────────┘
                            │
              Chamadas de dados e controle
                            ▼
┌────────────────────────────────────────────────────────┐
│                    SERVIÇOS DE BANCO                   │
│         Camada Universal dbService + Firestore         │
└────────────────────────────────────────────────────────┘
```

- **Linguagem**: **TypeScript** garante tipagem estática rigorosa para todas as entidades fundamentais (`Product`, `Project`, `QuotationRequest`, `ActivityLog`, etc.), minimizando erros de tempo de execução no cliente.
- **Framework Base**: **React 18** com gestão de estados local e global escaláveis com alta performance de recarga baseada em componentes funcionais limpos.
- **Ferramenta de Build**: **Vite JS** para empacotamento ultrarápido, proporcionando tempos de resposta instantâneos durante o desenvolvimento e builds de produção compactos.
- **Estilização**: **Tailwind CSS** para estilização direta por meio de classes utilitárias modernas, garantindo responsividade flexível e facilidade de manutenção visual.
- **Biblioteca de Ícones**: **Lucide React** providencia um conjunto de pictogramas minimalistas com design uniforme e contemporâneo.
- **Análise & Gráficos**: **Recharts (D3-based)** para renderizar gráficos de fluxo interativos e relatórios analíticos dinâmicos de faturamento e prospecção de clientes no dashboard corporativo.
- **Mecanismo de Persistência**: Camada de persistência resiliente com integração direta a coleções em tempo real e fallback local automatizado para garantir alta disponibilidade mesmo sem sinal de rede persistente.

---

## 📁 Estrutura de Diretórios Críticos do Frontend

Para manutenção ou expansão das capacidades do sistema, os arquivos principais dividem-se na seguinte hierarquia simplificada:

* `/src/types.ts` — Contém as definições de tipos consolidadas utilizadas por toda a aplicação.
* `/src/services/dbService.ts` — Canal integrado de dados, CRUDs e lógicas de re-inicialização (Seed).
* `/src/pages/Admin.tsx` — Painel central MIRCA CONTROL de controle organizacional corporativo.
* `/src/components/admin/` — Componentes modulares reutilizáveis divididos por separadores de controlo ERP e CMS (Dashboard, Logs, Settings, CRM, etc).
* `/src/App.tsx` — Roteamento primário de rotas públicas e proteções de rotas sob token autenticado.

---

*MIRCA Lda — Inovação tecnológica em Segurança Eletrónica e requinte estético em Marcenaria Residencial.*
