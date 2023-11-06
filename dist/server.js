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
var import_express8 = __toESM(require("express"));
var import_body_parser = __toESM(require("body-parser"));
var import_cors = __toESM(require("cors"));

// routes/posts.ts
var import_express = __toESM(require("express"));
var import_multer = __toESM(require("multer"));

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
    slug: {
      type: import_sequelize2.DataTypes.STRING
    },
    titulo: {
      type: import_sequelize2.DataTypes.STRING
    },
    conteudo: {
      type: import_sequelize2.DataTypes.TEXT
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

// controllers/PostController.ts
var import_remove_accents = require("remove-accents");
var import_basic_ftp = require("basic-ftp");
var import_sharp = __toESM(require("sharp"));
var createPost = (req, res) => __async(void 0, null, function* () {
  try {
    const { titulo, conteudo } = req.body;
    if (typeof titulo !== "string") {
      return res.status(400).json({ error: "O t\xEDtulo deve ser uma string v\xE1lida." });
    }
    const existingPost = yield Post_default.findOne({ where: { titulo } });
    if (existingPost) {
      return res.status(400).json({ error: "J\xE1 existe um post com o mesmo t\xEDtulo." });
    }
    const slug = (0, import_remove_accents.remove)(titulo).toLowerCase().replace(/\s+/g, "-");
    console.log(req.file);
    if (req.file) {
      const imagePath = req.file.path;
      const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");
      yield (0, import_sharp.default)(imagePath).webp({ quality: 90 }).toFile(webpPath);
      const client = new import_basic_ftp.Client();
      yield client.access({
        host: "ftp.ibtec.org.br",
        user: "dev@dev.ibtec.org.br",
        password: "Dev04121996"
      });
      yield client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));
      yield client.close();
    }
    const newPost = yield Post_default.create({
      titulo,
      slug,
      conteudo,
      imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var deletePost = (req, res) => __async(void 0, null, function* () {
  try {
    const postId = Number(req.params.id);
    const post = yield Post_default.findByPk(postId);
    if (!post) {
      res.status(404).json({ error: "Not\xEDcia n\xE3o encontrada" });
      return;
    }
    yield post.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var getPosts = (req, res) => __async(void 0, null, function* () {
  try {
    const limit = req.query.limit;
    const parsedLimit = limit ? parseInt(limit, 10) : void 0;
    const posts = yield Post_default.findAll({
      limit: typeof parsedLimit === "number" ? parsedLimit : void 0,
      order: [["id", "DESC"]]
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// routes/posts.ts
var router = import_express.default.Router();
var storage = import_multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});
var upload = (0, import_multer.default)({ storage });
router.post("/criar-post", upload.single("imagem"), createPost);
router.get("/ultimos-posts", getPosts);
router.delete("/deletar/:id", deletePost);
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

// routes/auth.ts
var import_express6 = require("express");

// models/User.ts
var import_sequelize6 = require("sequelize");
var User = class extends import_sequelize6.Model {
};
User.init(
  {
    id: {
      type: import_sequelize6.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: new import_sequelize6.DataTypes.STRING(128),
      allowNull: false
    },
    name: {
      type: new import_sequelize6.DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: new import_sequelize6.DataTypes.STRING(128),
      allowNull: false
    },
    password: {
      type: new import_sequelize6.DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    sequelize: db_default,
    tableName: "users",
    timestamps: false
  }
);

// controllers/AuthController.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var secretKey = "Wszwe94q@@dSa$%a15Z";
var AuthController = class {
  static login(req, res) {
    return __async(this, null, function* () {
      const { email, password } = req.body;
      try {
        const user = yield User.findOne({ where: { email } });
        if (!user) {
          res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
          return;
        }
        if (!import_bcrypt.default.compareSync(password, user.password)) {
          res.status(401).json({ message: "Senha incorreta" });
          return;
        }
        const token = import_jsonwebtoken.default.sign({ id: user.id, email: user.email }, secretKey);
        res.json({ token, user });
      } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no servidor" });
      }
    });
  }
};

// routes/auth.ts
var authRouter = (0, import_express6.Router)();
authRouter.post("/login", AuthController.login);

// routes/user.ts
var import_express7 = require("express");

// controllers/UserController.ts
var UserController = class {
  static getUserById(req, res) {
    return __async(this, null, function* () {
      const { id } = req.params;
      try {
        const user = yield User.findOne({ where: { id } });
        if (!user) {
          res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
          return;
        }
        res.json({ user }.user);
      } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro no servidor" });
      }
    });
  }
};

// routes/user.ts
var userRouter = (0, import_express7.Router)();
userRouter.get("/usuario-por-id/:id", UserController.getUserById);

// server.ts
var import_sequelize7 = require("sequelize");
var app = (0, import_express8.default)();
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
app.use("/api/auth", authRouter);
app.use("/api/cities", cities_default);
app.use("/api/segments", segments_default);
app.use("/api/contact", contactForm_default);
app.use("/api/associates", associates_default);
app.use("/api/user", userRouter);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
