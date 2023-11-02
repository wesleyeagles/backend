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
var import_express6 = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));

// routes/posts.ts
var import_express = __toESM(require("express"));

// config/db.ts
var import_mysql = require("mysql");
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
var db_default = db;

// controllers/postsController.ts
var getAllPosts = (req, res) => {
  const query = "SELECT * FROM posts";
  db_default.query(query, (error, results) => {
    if (error) {
      console.error("Erro ao obter os posts:", error);
      res.status(500).json({ error: "Erro ao obter os posts" });
    } else {
      res.status(200).json(results);
    }
  });
};
var createPost = (titulo, conteudo, imagem) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO posts (titulo, conteudo, imagem) VALUES (?, ?, ?)";
    db_default.query(sql, [titulo, conteudo, imagem], (error, result) => {
      if (error) {
        console.error("Erro ao inserir o post:", error);
        reject({ error: "Erro ao inserir o post" });
      } else {
        const postId = result.insertId;
        resolve({ message: "Post criado com sucesso", postId });
      }
    });
  });
};
var postsController_default = {
  getAllPosts,
  createPost
};

// middleware/uploadMiddleware.ts
var import_multer = __toESM(require("multer"));
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  }
});
var upload = (0, import_multer.default)({ storage });
var uploadMiddleware_default = upload;

// routes/posts.ts
var router = import_express.default.Router();
router.get("/todos-posts", postsController_default.getAllPosts);
router.post("/criar-post", uploadMiddleware_default.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada" });
  }
  const { titulo, conteudo } = req.body;
  const imagem = req.file.filename;
  postsController_default.createPost(titulo, conteudo, imagem).then((result) => {
    res.status(201).json(result);
  }).catch((error) => {
    res.status(500).json(error);
  });
});
var posts_default = router;

// routes/cities.ts
var import_express2 = __toESM(require("express"));

// controllers/citiesController.ts
var getAllCities = (req, res) => {
  const query = "SELECT * FROM cities";
  db_default.query(query, (error, results) => {
    if (error) {
      console.error("Erro ao obter as cidades:", error);
      res.status(500).json({ error: "Erro ao obter as cidades" });
    } else {
      res.status(200).json(results);
    }
  });
};
var citiesController_default = {
  getAllCities
};

// routes/cities.ts
var router2 = import_express2.default.Router();
router2.get("/todas-cidades", citiesController_default.getAllCities);
var cities_default = router2;

// routes/segments.ts
var import_express3 = __toESM(require("express"));

// controllers/segmentsController.ts
var getAllSegments = (req, res) => {
  const query = "SELECT * FROM segments WHERE active = 1";
  db_default.query(query, (error, results) => {
    if (error) {
      console.error("Erro ao obter os segmentos:", error);
      res.status(500).json({ error: "Erro ao obter os segmentos" });
    } else {
      res.status(200).json(results);
    }
  });
};
var segmentsController_default = {
  getAllSegments
};

// routes/segments.ts
var router3 = import_express3.default.Router();
router3.get("/todos-segmentos", segmentsController_default.getAllSegments);
var segments_default = router3;

// routes/contactForm.ts
var import_express4 = __toESM(require("express"));

// controllers/contactFormController.ts
var import_nodemailer = __toESM(require("nodemailer"));
var transporter = import_nodemailer.default.createTransport({
  host: "mail.ibtec.org.br",
  port: 465,
  auth: {
    user: "dev@ibtec.org.br",
    pass: "Dev110591"
  }
});
var sendContactForm = (req, res) => {
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
};
var contactFormController_default = {
  sendContactForm
};

// routes/contactForm.ts
var router4 = import_express4.default.Router();
router4.post("/enviar-formulario", contactFormController_default.sendContactForm);
var contactForm_default = router4;

// routes/associates.ts
var import_express5 = __toESM(require("express"));

// controllers/associatesController.ts
var getAllAssociates = (req, res) => {
  const query = "SELECT * FROM `associates` WHERE active = 1";
  db_default.query(query, (error, results) => {
    if (error) {
      console.error("Erro ao obter os associados:", error);
      res.status(500).json({ error: "Erro ao obter os associados" });
    } else {
      res.status(200).json(results);
    }
  });
};
var associatesController_default = {
  getAllAssociates
};

// routes/associates.ts
var router5 = import_express5.default.Router();
router5.get("/todos-associados", associatesController_default.getAllAssociates);
var associates_default = router5;

// server.ts
var import_mysql2 = require("mysql");
var app = (0, import_express6.default)();
var port = process.env.PORT || 3e3;
app.use(import_body_parser.default.urlencoded({ extended: false }));
app.use(import_body_parser.default.json());
app.use(
  (0, import_cors.default)({
    origin: ["http://localhost:5173", "https://dev.ibtec.org.br"]
  })
);
var db2 = (0, import_mysql2.createConnection)({
  host: "server01.ibtec.org.br",
  user: "ctcca_dev",
  password: "Eagles110591",
  database: "ctcca_ibtec"
});
db2.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conex\xE3o bem-sucedida ao banco de dados");
  }
});
var keepDBConnectionAlive = () => {
  const query = "SELECT 1";
  db2.query(query, (error) => {
    if (error) {
      console.error("Erro na consulta de manuten\xE7\xE3o da conex\xE3o:", error);
    } else {
      console.log("Consulta de manuten\xE7\xE3o da conex\xE3o bem-sucedida");
    }
  });
};
setInterval(keepDBConnectionAlive, 25e4);
app.use("/api/posts", posts_default);
app.use("/api/cities", cities_default);
app.use("/api/segments", segments_default);
app.use("/api/contact", contactForm_default);
app.use("/api/associates", associates_default);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
