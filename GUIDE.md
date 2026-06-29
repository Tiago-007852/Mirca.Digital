# 📘 GUIA DE UTILIZAÇÃO E GESTÃO: MIRCA CATALOG & E-COMMERCE

Este manual prático destina-se a orientar os **Administradores** e os **Usuários (Clientes)** no uso e gestão do novo portal de catálogo e-commerce da **MIRCA – Comércio e Prestação de Serviços, LDA**.

---

## 🔑 1. CREDENCIAIS DE ACESSO AO PAINEL ADMINISTRATIVO

Para gerir os produtos, categorias, banners e visualizar as solicitações de orçamento dos clientes, aceda ao endereço do portal seguido de `/admin` (exemplo: `https://mirca.digital/admin`) e introduza as seguintes credenciais de acesso oficiais:

*   **Email de Administrador:** `mirca_prestacaodeservico@outlook.com`
*   **Palavra-passe (Senha):** `Mirca#SegurancaPlanejada2026!`

---

## ⚙️ 2. GUIA COMPLETO PARA ADMINISTRADORES

O painel administrativo da MIRCA oferece controlo total sobre a vitrina digital. Abaixo, detalhamos as principais operações de gestão:

### A. Gestão de Categorias (Divisões de Venda)
As categorias organizam o catálogo e aparecem na página inicial.
1.  **Aceder às Categorias:** Clique no separador **"Categorias"** no menu do Painel Admin.
2.  **Adicionar Nova Categoria:**
    *   Clique em **"+ Adicionar Categoria"**.
    *   Defina o **Nome** (ex: *Informática*) e o **Slug** (link amigável em minúsculas e sem acentos, ex: *informatica*).
    *   Selecione um **Ícone** representativo (da biblioteca Lucide).
    *   Carregue uma **Imagem de Banner** de alta resolução (que será exibida nos cartões da página inicial e no cabeçalho).
    *   Defina a **Ordem de Exibição** (número que determina qual categoria aparece primeiro na grelha).
3.  **Editar/Eliminar:** Use os botões de edição rápida ou eliminação ao lado de cada categoria.

### B. Gestão de Produtos
1.  **Aceder aos Produtos:** Clique no separador **"Produtos"** no Painel Admin.
2.  **Adicionar Novo Produto:**
    *   Clique em **"+ Adicionar Produto"**.
    *   Preencha o **Nome**, selecione a **Categoria** correspondente e defina a **Marca** (ex: *Hikvision*, *Ajax*).
    *   Insira a **Descrição** comercial detalhada e as **Especificações Técnicas** (uma por linha para criar a lista organizada de pontos).
    *   Defina o **Preço** em Kwanzas (AOA) e marque a opção **"Preço Visível"** para exibir o preço real no catálogo. Caso desmarque, será exibida a etiqueta *"Sob Consulta"*.
    *   **Sinalizadores Promocionais (Novo!):**
        *   **Destaque:** Marque para exibir o produto na secção principal de Destaques.
        *   **Marcar como "Novidade":** Ativa a etiqueta verde "NOVO" e coloca o produto na secção *"Novidades"*.
        *   **Marcar como "Oferta Especial":** Ativa a etiqueta vermelha "PROMOÇÃO" e coloca o produto na secção de *"Ofertas Limitadas"*.
    *   **Carregar Imagem:** Adicione uma foto nítida do produto utilizando o componente de upload integrado.
    *   Clique em **"Guardar Produto"**.

### C. Visualização de Orçamentos Recebidos
*   No separador **"Orçamentos"**, os administradores têm um registo histórico de todas as consultas geradas no site.
*   Poderá verificar o nome do cliente, telefone, email, lista de produtos selecionados, e o estado do orçamento (Pendente, Contactado, Concluído).

### D. Gestão de Conteúdo Institucional (CMS)
*   No separador **"Conteúdo"** e **"Definições"**, pode atualizar dinamicamente o número de telefone da empresa, email, morada, e os textos e imagens institucionais sem necessidade de alterar código.

---

## 🛒 3. GUIA COMPLETO PARA USUÁRIOS (CLIENTES)

O website foi projetado com foco absoluto na facilidade de navegação e na rápida conversão de visitas em orçamentos reais.

### A. Pesquisa de Produtos e Navegação
1.  **Página Inicial (Vitrina Digital):**
    *   O cliente depara-se com um motor de busca na secção de topo (Hero). Pode digitar palavras-chave como *"câmara"*, *"switch"* ou *"cabo"* para encontrar artigos instantaneamente.
    *   Logo abaixo, encontra a grelha de categorias com imagens e ícones. Um clique em qualquer categoria direciona o usuário para ver os produtos correspondentes.
2.  **Secções Temáticas:** O cliente pode navegar pelas novidades do mercado, ofertas de desconto e produtos recomendados em destaque na página inicial.
3.  **Página de Categorias dedicada (`/categorias`):** Exibe todas as divisões comerciais da MIRCA em cartões limpos e responsivos.

### B. Construção do Pedido de Orçamento (Carrinho de Compras)
1.  **Adicionar ao Carrinho:** Em cada cartão de produto, o usuário pode clicar em **"Adicionar Orçamento"** para guardar o item na sua lista de interesse.
2.  **Visualizar Carrinho:** O ícone do carrinho no canto superior direito indica a quantidade de itens selecionados. Ao clicar, abre-se uma barra lateral intuitiva que lista todos os artigos escolhidos.
3.  **Ajustar Quantidades:** O cliente pode aumentar ou diminuir o número de unidades de cada produto para se adequar ao seu projeto.

### C. Envio Direto via WhatsApp e Sistema
1.  **Finalizar Pedido:** No carrinho lateral, o cliente clica em **"Solicitar Orçamento"** para ir para o formulário final.
2.  **Formulário de Identificação:** O usuário preenche os seus dados fundamentais (Nome Completo, Telefone, Email e Mensagem adicional).
3.  **Envio:** Ao clicar em **"Enviar Orçamento via WhatsApp"**:
    *   O sistema regista o pedido na base de dados administrativa da MIRCA para histórico de gestão.
    *   O portal gera um texto estruturado, profissional e limpo, direcionando o cliente para uma conversa direta de WhatsApp com a equipa de vendas da MIRCA através do número oficial da empresa.
    *   *Exemplo de mensagem enviada ao WhatsApp:*
        ```text
        Olá MIRCA, gostaria de solicitar um orçamento para os seguintes produtos:
        - 2x Câmara IP Speed Dome Hikvision Pro (AOA 370.000)
        - 1x Switch PoE Administrável 24 Portas (AOA 245.000)
        Total Estimado: AOA 615.000
        Solicitado por: António Miguel (antonio@gmail.com)
        *Solicitado via mirca.digital*
        ```

---

## 📌 4. CONSELHOS TÉCNICOS PARA CARREGAMENTO DE IMAGENS

Para assegurar uma velocidade de carregamento de topo para os clientes, siga estas diretrizes ao carregar imagens no Painel Admin:
*   **Formatos recomendados:** `.webp` ou `.jpg`.
*   **Dimensões para Produtos:** Quadradas ou retangulares moderadas (ex: `800x800` píxeis ou `800x600` píxeis).
*   **Tamanho máximo:** Prefira imagens com menos de `300 KB` para evitar lentidão em ligações móveis em Angola.
