const express = require("express");
const stompit = require("stompit");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const connectOptions = {
  host: process.env.BROKER_URL,
  port: process.env.BROKER_PORT,
  connectHeaders: {
    host: process.env.CONNECTHOST,
    login: process.env.CONNECTLOGIN,
    passcode: process.env.CONNECTPASS,
    "heart-beat": "5000,5000",
  },
};

app.post("/send", (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: "Mensagem não fornecida" });
  }

  stompit.connect(connectOptions, (error, client) => {
    if (error) {
      console.error("Erro de conexão com o ActiveMQ:", error.message);
      return res.status(500).json({ error: "Erro de conexão com o ActiveMQ" });
    }

    const frame = client.send({
      destination: process.env.QUEUE_NAME,
    });

    frame.write(message);
    frame.end();

    client.disconnect();

    res.json({ status: "Mensagem enviada", message });
  });
});

app.get("/consume", (req, res) => {
  stompit.connect(connectOptions, (error, client) => {
    if (error) {
      console.error("Erro de conexão com o ActiveMQ:", error.message);
      return res.status(500).json({ error: "Erro de conexão com o ActiveMQ" });
    }

    client.subscribe(
      {
        destination: process.env.QUEUE_NAME,
        ack: "client-individual",
      },
      (error, message) => {
        if (error) {
          console.error("Erro ao consumir mensagem:", error.message);
          return res.status(500).json({ error: "Erro ao consumir mensagem" });
        }

        let body = "";
        message.readable &&
          message.on("data", (chunk) => {
            body += chunk.toString();
          });

        message.on("end", () => {
          console.log("Mensagem recebida:", body);
          res.json({ status: "Mensagem consumida", message: body });

          client.ack(message);

          client.disconnect();
        });
      }
    );
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API de mensageria rodando em http://localhost:${PORT}`);
});
