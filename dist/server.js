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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// server.ts
var import_express6 = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));

// routes/posts.ts
var import_express = __toESM(require("express"));

// models/Post.ts
var import_sequelize2 = require("sequelize");

// config/db.ts
var import_sequelize = require("sequelize");
var sequelize = new import_sequelize.Sequelize("ctcca_ibtec", "ctcca_dev", "Eagles110591", {
  host: "server01.ibtec.org.br",
  dialect: "mysql",
  dialectOptions: {
    keepAlive: true
    // Ativar a consulta de manutenção
  }
});
sequelize.authenticate().then(() => {
  console.log("Conex\xE3o com o banco de dados estabelecida com sucesso.");
}).catch((error) => {
  console.error("Erro ao conectar ao banco de dados:", error);
});
var db_default = sequelize;

// models/Post.ts
var Post = class extends import_sequelize2.Model {
};
Post.init(
  {
    post_id: {
      type: import_sequelize2.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: import_sequelize2.DataTypes.STRING
    },
    conteudo: {
      type: import_sequelize2.DataTypes.STRING
    },
    imagem: {
      type: import_sequelize2.DataTypes.STRING
    }
  },
  {
    sequelize: db_default,
    modelName: "post"
    // Nome da tabela no banco de dados
  }
);
var Post_default = Post;

// controllers/postsController.ts
var getAllPosts = (req, res) => __async(void 0, null, function* () {
  try {
    const posts = yield Post_default.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao obter os posts:", error);
    res.status(500).json({ error: "Erro ao obter os posts" });
  }
});
var createPost = (titulo, conteudo, imagem) => __async(void 0, null, function* () {
  try {
    const post = yield Post_default.create({
      titulo,
      conteudo,
      imagem
    });
    return post.post_id;
  } catch (error) {
    console.error("Erro ao criar o post:", error);
    throw new Error("Erro ao criar o post");
  }
});
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

// models/City.ts
var import_sequelize3 = require("sequelize");
var City = db_default.define(
  "City",
  {
    id: {
      type: import_sequelize3.DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true
    },
    city: {
      type: import_sequelize3.DataTypes.STRING,
      allowNull: false
    },
    uf: {
      type: import_sequelize3.DataTypes.STRING,
      allowNull: false
    }
    // Outros campos do modelo City
  },
  {
    timestamps: false,
    tableName: "cities"
  }
);
var City_default = City;

// controllers/citiesController.ts
var getAllCities = (req, res) => __async(void 0, null, function* () {
  try {
    const cities = yield City_default.findAll();
    res.status(200).json(cities);
  } catch (error) {
    console.error("Erro ao obter as cidades:", error);
    res.status(500).json({ error: "Erro ao obter as cidades" });
  }
});
var citiesController_default = {
  getAllCities
};

// routes/cities.ts
var router2 = import_express2.default.Router();
router2.get("/todas-cidades", citiesController_default.getAllCities);
var cities_default = router2;

// routes/segments.ts
var import_express3 = __toESM(require("express"));

// models/Segment.ts
var import_sequelize4 = require("sequelize");
var Segment = db_default.define(
  "segment",
  {
    id: {
      type: import_sequelize4.DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: import_sequelize4.DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: import_sequelize4.DataTypes.BOOLEAN,
      defaultValue: true
    }
    // Outros campos do modelo Segment
  },
  {
    timestamps: false
  }
);
var Segment_default = Segment;

// controllers/segmentsController.ts
var getAllSegments = (req, res) => __async(void 0, null, function* () {
  try {
    const segments = yield Segment_default.findAll({
      where: {
        active: 1
      }
    });
    res.status(200).json(segments);
  } catch (error) {
    console.error("Erro ao obter os segmentos:", error);
    res.status(500).json({ error: "Erro ao obter os segmentos" });
  }
});
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

// models/Associate.ts
var import_sequelize5 = require("sequelize");
var Associate = db_default.define(
  "associate",
  {
    id: {
      type: import_sequelize5.DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true
    },
    segment_id: {
      type: import_sequelize5.DataTypes.NUMBER,
      allowNull: false
    },
    city_id: {
      type: import_sequelize5.DataTypes.NUMBER,
      allowNull: false
    },
    fantasy_name: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    neighborhood: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    zip_code: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    website: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: import_sequelize5.DataTypes.STRING,
      allowNull: false
    },
    // Outros campos do modelo Associate
    active: {
      type: import_sequelize5.DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: false
  }
);
var Associate_default = Associate;

// controllers/associatesController.ts
var getAllAssociates = (req, res) => __async(void 0, null, function* () {
  try {
    const associates = yield Associate_default.findAll({
      where: {
        active: 1
      }
    });
    res.status(200).json(associates);
  } catch (error) {
    console.error("Erro ao obter os associados:", error);
    res.status(500).json({ error: "Erro ao obter os associados" });
  }
});
var associatesController_default = {
  getAllAssociates
};

// routes/associates.ts
var router5 = import_express5.default.Router();
router5.get("/todos-associados", associatesController_default.getAllAssociates);
var associates_default = router5;

// server.ts
var import_sequelize7 = require("sequelize");
var import_axios = __toESM(require("axios"));

// models/AccessLog.ts
var import_sequelize6 = require("sequelize");
var AccessLog = db_default.define("AccessLog", {
  timestamp: {
    type: import_sequelize6.DataTypes.DATE,
    allowNull: false
  },
  ip_address: {
    type: import_sequelize6.DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: import_sequelize6.DataTypes.STRING,
    allowNull: true
  },
  referer: {
    type: import_sequelize6.DataTypes.STRING,
    allowNull: true
  }
});
var AccessLog_default = AccessLog;

// server.ts
var app = (0, import_express6.default)();
var port = process.env.PORT || 3e3;
app.use(import_body_parser.default.urlencoded({ extended: false }));
app.use(import_body_parser.default.json());
app.use(
  (0, import_cors.default)({
    origin: ["http://localhost:5173", "https://dev.ibtec.org.br"]
  })
);
var sequelize2 = new import_sequelize7.Sequelize({
  dialect: "mysql",
  host: "server01.ibtec.org.br",
  username: "ctcca_dev",
  password: "Eagles110591",
  database: "ctcca_ibtec",
  pool: {
    max: 5,
    // Número máximo de conexões no pool
    min: 0,
    // Número mínimo de conexões no pool
    acquire: 25e4,
    // Tempo máximo em milissegundos para adquirir uma conexão
    idle: 1e4
    // Tempo máximo em milissegundos que uma conexão pode ficar inativa
  }
});
sequelize2.authenticate().then(() => {
  console.log("Conex\xE3o bem-sucedida ao banco de dados");
}).catch((err) => {
  console.error("Erro ao conectar ao banco de dados:", err);
});
app.use("/api/posts", posts_default);
app.use("/api/cities", cities_default);
app.use("/api/segments", segments_default);
app.use("/api/contact", contactForm_default);
app.use("/api/associates", associates_default);
app.use((req, res, next) => __async(exports, null, function* () {
  const clientIP = req.ip;
  console.log(clientIP);
  try {
    const response = yield import_axios.default.get(`https://ipinfo.io/${clientIP}/json`);
    const data = response.data;
    const country = data.country;
    const referrer = req.get("referrer");
    try {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const existingVisit = yield AccessLog_default.findOne({
        where: {
          timestamp: {
            [import_sequelize7.Op.gte]: today
          }
        }
      });
      if (!existingVisit) {
        yield AccessLog_default.create({
          timestamp: /* @__PURE__ */ new Date(),
          country,
          referrer
        });
      }
    } catch (error) {
      console.error("Erro ao registrar a visita:", error);
    }
  } catch (error) {
    console.error("Erro ao obter informa\xE7\xF5es de geolocaliza\xE7\xE3o:", error);
  }
  next();
}));
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
