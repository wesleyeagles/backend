"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_nodemailer = __toESM(require("nodemailer"));
var import_cors = __toESM(require("cors"));
var import_mysql = require("mysql");
var app = (0, import_express.default)();
var port = process.env.PORT || 3e3;
app.use(import_body_parser.default.urlencoded({ extended: false }));
app.use(import_body_parser.default.json());
app.use(
  (0, import_cors.default)({
    origin: ["http://localhost:5173", "https://dev.ibtec.org.br"]
  })
);
var db = (0, import_mysql.createConnection)({
  host: "server01.ibtec.org.br",
  user: "ctcca_dev",
  password: "Eagles110591",
  database: "ctcca_ibtec"
});
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conex\xE3o bem-sucedida ao banco de dados");
  }
});
var transporter = import_nodemailer.default.createTransport({
  host: "mail.ibtec.org.br",
  port: 465,
  auth: {
    user: "dev@ibtec.org.br",
    pass: "Dev110591"
  }
});
db.query("select 1 + 1", (err, rows) => {
});
app.get("/consultar-dados", (req, res) => {
  const query = "SELECT * FROM `associates` WHERE active = 1";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Erro na consulta:", error);
      res.status(500).send("Erro na consulta ao banco de dados");
    } else {
      res.status(200).json(results);
    }
  });
});
app.get("/cities", (req, res) => {
  const query = "SELECT * FROM `cities`";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Erro na consulta:", error);
      res.status(500).send("Erro na consulta ao banco de dados");
    } else {
      res.status(200).json(results);
    }
  });
});
app.get("/segments", (req, res) => {
  const query = "SELECT * FROM `segments` WHERE active = 1";
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Erro na consulta:", error);
      res.status(500).send("Erro na consulta ao banco de dados");
    } else {
      res.status(200).json(results);
    }
  });
});
app.post("/enviar-formulario", (req, res) => {
  const { Nome, Email, Telefone, Assunto, Mensagem } = req.body;
  const mailOptions = {
    from: "seu-email@gmail.com",
    to: "crafael.wesley@gmail.com",
    subject: "Mensagem do formul\xE1rio de contato",
    html: `
    <html>
    <body>
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 24px; color: #333;">Detalhes do Contato</h1>
          <p><strong>Nome:</strong> ${Nome}</p>
          <p><strong>Email:</strong> ${Email}</p>
          <p><strong>Telefone:</strong> ${Telefone}</p>
          <p><strong>Assunto:</strong> ${Assunto}</p>
          <p><strong>Mensagem:</strong> ${Mensagem}</p>
        </div>
      </div>
    </body>
    </html>
  `
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Erro ao enviar o email");
    } else {
      console.log("Email enviado: " + info.response);
      res.status(200).send("Email enviado com sucesso");
    }
  });
});
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
