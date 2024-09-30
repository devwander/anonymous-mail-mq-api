# API de Mensageria

Esta API utiliza Express e Stompit para enviar e consumir mensagens de um broker ActiveMQ. A seguir, estão as funcionalidades principais e como utilizá-las.

## Pré-requisitos

- Node.js
- ActiveMQ em funcionamento
- Variáveis de ambiente configuradas no arquivo `.env`:

BROKER_URL=seu_broker_url

BROKER_PORT=porta_do_broker

CONNECTHOST=host_de_conexao

CONNECTLOGIN=login_do_broker

CONNECTPASS=senha_do_broker

QUEUE_NAME=nome_da_fila

## Funcionalidades

### Enviar Mensagem

**Endpoint:** `POST /send`

- **Descrição:** Envia uma mensagem para a fila definida.
- **Corpo da Requisição:**
  ```json
  {
    "message": "Sua mensagem aqui"
  }
  ```

### Consumir Mensagem

**Endpoint:** `GET /consume`

- **Descrição:** Consume a próxima mensagem disponível na fila.
- **Corpo da Resposta:**
  ```json
  {
    "status": "Mensagem consumida",
    "message": "Sua mensagem aqui"
  }
  ```

### Como Executar

1. Clone o repositório
2. Instale as dependências com npm install.
3. Configure o arquivo .env conforme necessário.
4. Inicie o servidor com `node ./src/index.js`
5. Acesse a API em http://localhost:3000.
