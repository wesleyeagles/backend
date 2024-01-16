"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var import_express9 = __toESM(require("express"));
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
    tipo: {
      type: import_sequelize2.DataTypes.STRING
    },
    conteudo: {
      type: import_sequelize2.DataTypes.TEXT
    },
    imagem: {
      type: import_sequelize2.DataTypes.BLOB
    },
    destaque: {
      type: import_sequelize2.DataTypes.TINYINT
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
var import_axios = __toESM(require("axios"));
var import_basic_ftp = require("basic-ftp");
var import_sharp = __toESM(require("sharp"));
var createPost = (req, res) => __async(void 0, null, function* () {
  try {
    const { titulo, conteudo, destaque, tipo } = req.body;
    if (typeof titulo !== "string") {
      return res.status(400).json({ error: "O t\xEDtulo deve ser uma string v\xE1lida." });
    }
    const existingPost = yield Post_default.findOne({ where: { titulo } });
    if (existingPost) {
      return res.status(400).json({ error: "J\xE1 existe um post com o mesmo t\xEDtulo." });
    }
    const slug = (0, import_remove_accents.remove)(titulo).toLowerCase().replace(/\s+/g, "-");
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
      tipo,
      conteudo,
      destaque,
      imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var getPostById = (req, res) => __async(void 0, null, function* () {
  try {
    const postId = Number(req.params.id);
    const post = yield Post_default.findByPk(postId);
    if (!post) {
      res.status(404).json({ error: "Postagem n\xE3o encontrada" });
      return;
    }
    const remoteFileUrl = `https://dev.ibtec.org.br/dev/blog/${post.imagem}`;
    const response = yield import_axios.default.get(remoteFileUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);
    const originalImageBuffer = yield (0, import_sharp.default)(imageBuffer).toBuffer();
    res.json(__spreadProps(__spreadValues({}, post.toJSON()), {
      originalImageBuffer
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var editPost = (req, res) => __async(void 0, null, function* () {
  try {
    const postId = Number(req.params.id);
    const post = yield Post_default.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Postagem n\xE3o encontrada" });
    }
    const { titulo, conteudo, destaque, tipo } = req.body;
    const slug = (0, import_remove_accents.remove)(titulo).toLowerCase().replace(/\s+/g, "-");
    if (titulo === post.titulo && tipo === post.tipo && slug === post.slug && conteudo === post.conteudo && destaque === post.destaque && !req.file) {
      return res.status(200).json({ message: "Nenhum dado foi modificado." });
    }
    post.titulo = titulo;
    post.tipo = tipo;
    post.slug = slug;
    post.conteudo = conteudo;
    post.destaque = destaque;
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
      post.imagem = req.file.filename.replace(/\.[^.]+$/, ".webp");
    }
    yield post.save();
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
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
var getPostsDestaques = (req, res) => __async(void 0, null, function* () {
  try {
    const posts = yield Post_default.findAll({
      where: {
        destaque: 1
        // Filtra os posts que têm destaque igual a 1
      },
      limit: 2,
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
router.get("/ultimos-destaques", getPostsDestaques);
router.delete("/deletar/:id", deletePost);
router.get("/post/:id", getPostById);
router.put("/post/editar/:id", upload.single("imagem"), editPost);
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

// models/Contact.ts
var import_sequelize5 = require("sequelize");
var Contato = class extends import_sequelize5.Model {
};
Contato.init(
  {
    nome: {
      type: import_sequelize5.DataTypes.STRING
    },
    email: {
      type: import_sequelize5.DataTypes.STRING
    },
    assunto: {
      type: import_sequelize5.DataTypes.STRING
    },
    mensagem: {
      type: import_sequelize5.DataTypes.STRING
    },
    telefone: {
      type: import_sequelize5.DataTypes.STRING
    }
  },
  {
    sequelize: db_default,
    modelName: "contato"
    // Nome da tabela no banco de dados
  }
);
var Contact_default = Contato;

// controllers/contactFormController.ts
var transporter = import_nodemailer.default.createTransport({
  host: "mail.ibtec.org.br",
  port: 465,
  auth: {
    user: "dev@ibtec.org.br",
    pass: "Dev110591"
  }
});
var getAllContatos = (req, res) => __async(void 0, null, function* () {
  try {
    const contatos = yield Contact_default.findAll();
    res.status(200).json(contatos);
  } catch (error) {
    console.error("Erro ao obter os contatos:", error);
    res.status(500).json({ error: "Erro ao obter os contatos" });
  }
});
var deletaContato = (req, res) => __async(void 0, null, function* () {
  try {
    const contatoId = Number(req.params.id);
    const contato = yield Contact_default.findByPk(contatoId);
    if (!contato) {
      res.status(404).json({ error: "Contato n\xE3o encontrada" });
      return;
    }
    yield contato.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var sendContactForm = (req, res) => __async(void 0, null, function* () {
  const { nome, email, telefone, assunto, empresa, mensagem } = req.body;
  const existingContact = yield Contact_default.findOne({ where: { email } });
  if (existingContact) {
    return res.status(400).json({ error: "J\xE1 existe um registro com esse email, por favor aguarde o contato." });
  }
  const mailOptions = {
    from: "ibtec@ibtec.org.br",
    sender: "ibtec@ibtec.org.br",
    to: "ibtec@ibtec.org.br",
    subject: "Mensagem do formul\xE1rio de contato",
    html: `
      <html>
      <body>
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h1 style="font-size: 24px; color: #333;">Detalhes do Contato</h1>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
			<p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
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
  const newContato = yield Contact_default.create({
    nome,
    assunto,
    empresa,
    telefone,
    mensagem,
    email
  });
  res.status(201).json(newContato);
});
var contactFormController_default = {
  sendContactForm
};

// routes/contactForm.ts
var router4 = import_express4.default.Router();
router4.post("/enviar-formulario", contactFormController_default.sendContactForm);
router4.delete("/deletar/:id", deletaContato);
router4.get("/contatos", getAllContatos);
var contactForm_default = router4;

// routes/associates.ts
var import_express5 = __toESM(require("express"));

// models/Associate.ts
var import_sequelize6 = require("sequelize");
var Associate = class extends import_sequelize6.Model {
};
Associate.init(
  {
    segment_id: {
      type: import_sequelize6.DataTypes.NUMBER,
      allowNull: false
    },
    city_id: {
      type: import_sequelize6.DataTypes.NUMBER,
      allowNull: false
    },
    fantasy_name: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    neighborhood: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    zip_code: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    website: {
      type: import_sequelize6.DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: import_sequelize6.DataTypes.BLOB,
      allowNull: false
    },
    // Outros campos do modelo Associate
    active: {
      type: import_sequelize6.DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize: db_default,
    modelName: "associate",
    // Nome da tabela no banco de dados
    timestamps: false
  }
);
var Associate_default = Associate;

// controllers/associatesController.ts
var import_basic_ftp2 = require("basic-ftp");
var import_sharp2 = __toESM(require("sharp"));
var createAssociate = (req, res) => __async(void 0, null, function* () {
  try {
    const { segment_id, city_id, fantasy_name, state, address, neighborhood, zip_code, phone, website } = req.body;
    console.log(req.body);
    const existingPost = yield Associate_default.findOne({ where: { fantasy_name } });
    if (existingPost) {
      return res.status(400).json({ error: "J\xE1 existe um associado com o mesmo nome." });
    }
    if (req.file) {
      const imagePath = req.file.path;
      const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");
      yield (0, import_sharp2.default)(imagePath).webp({ quality: 90 }).toFile(webpPath);
      const client = new import_basic_ftp2.Client();
      yield client.access({
        host: "ftp.ibtec.org.br",
        user: "dev@dev.ibtec.org.br",
        password: "Dev04121996"
      });
      yield client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));
      yield client.close();
    }
    const newPost = yield Associate_default.create({
      segment_id,
      city_id,
      state,
      address,
      neighborhood,
      zip_code,
      phone,
      website,
      image: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
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
var import_multer2 = __toESM(require("multer"));
var router5 = import_express5.default.Router();
var storage2 = import_multer2.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});
var upload2 = (0, import_multer2.default)({ storage: storage2 });
router5.get("/todos-associados", associatesController_default.getAllAssociates);
router5.post("/criar-associado", upload2.single("imagem"), createAssociate);
var associates_default = router5;

// routes/auth.ts
var import_express6 = require("express");

// models/User.ts
var import_sequelize7 = require("sequelize");
var User = class extends import_sequelize7.Model {
};
User.init(
  {
    id: {
      type: import_sequelize7.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: new import_sequelize7.DataTypes.STRING(128),
      allowNull: false
    },
    name: {
      type: new import_sequelize7.DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: new import_sequelize7.DataTypes.STRING(128),
      allowNull: false
    },
    password: {
      type: new import_sequelize7.DataTypes.STRING(128),
      allowNull: false
    },
    image: {
      type: import_sequelize7.DataTypes.BLOB
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
var import_sharp3 = __toESM(require("sharp"));
var import_basic_ftp3 = require("basic-ftp");
var import_bcrypt2 = require("bcrypt");
var getAllUsers = (req, res) => __async(void 0, null, function* () {
  try {
    const users = yield User.findAll();
    res.json({ users });
  } catch (error) {
    console.error("Erro ao obter todos os usu\xE1rios:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
var getUserById = (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  try {
    const user = yield User.findOne({ where: { id } });
    if (!user) {
      res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
var createUser = (req, res) => __async(void 0, null, function* () {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = yield User.findOne({ where: { email } });
    if (existingUser) {
      res.status(404).json({ error: "J\xE1 existe um usu\xE1rio com este e-mail" });
      return;
    }
    if (req.file) {
      const imagePath = req.file.path;
      const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");
      yield (0, import_sharp3.default)(imagePath).webp({ quality: 90 }).toFile(webpPath);
      const client = new import_basic_ftp3.Client();
      yield client.access({
        host: "ftp.ibtec.org.br",
        user: "dev@dev.ibtec.org.br",
        password: "Dev04121996"
      });
      yield client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));
      yield client.close();
    }
    const hashedPassword = yield (0, import_bcrypt2.hash)(password, 10);
    const newUser = yield User.create({ name, email, password: hashedPassword, role, image: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null });
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Erro ao criar usu\xE1rio:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
var deleteUser = (req, res) => __async(void 0, null, function* () {
  try {
    const userId = Number(req.params.id);
    const user = yield User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: "Usu\xE1rio n\xE3o encontrada" });
      return;
    }
    yield user.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// middleware/uploadMiddleware.ts
var import_multer3 = __toESM(require("multer"));
var storage3 = import_multer3.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  }
});
var upload3 = (0, import_multer3.default)({ storage: storage3 });
var uploadMiddleware_default = upload3;

// routes/user.ts
var userRouter = (0, import_express7.Router)();
userRouter.get("/usuario-por-id/:id", getUserById);
userRouter.post("/criar-usuario", uploadMiddleware_default.single("image"), createUser);
userRouter.get("/todos-usuarios", getAllUsers);
userRouter.delete("/deletar/:id", deleteUser);

// routes/events.ts
var import_express8 = __toESM(require("express"));

// models/Event.ts
var import_sequelize8 = require("sequelize");
var Event = class extends import_sequelize8.Model {
};
Event.init(
  {
    nome: {
      type: import_sequelize8.DataTypes.STRING
    },
    slug: {
      type: import_sequelize8.DataTypes.STRING
    },
    sobre: {
      type: import_sequelize8.DataTypes.STRING
    },
    imagem: {
      type: import_sequelize8.DataTypes.BLOB
    },
    publicoAlvo: {
      type: import_sequelize8.DataTypes.STRING
    },
    objetivos: {
      type: import_sequelize8.DataTypes.STRING
    },
    tematicas: {
      type: import_sequelize8.DataTypes.STRING
    },
    cargaHoraria: {
      type: import_sequelize8.DataTypes.STRING
    },
    horario: {
      type: import_sequelize8.DataTypes.STRING
    },
    modalidade: {
      type: import_sequelize8.DataTypes.STRING
    },
    local: {
      type: import_sequelize8.DataTypes.STRING
    },
    data: {
      type: import_sequelize8.DataTypes.DATE
    },
    link: {
      type: import_sequelize8.DataTypes.STRING
    },
    facebook: {
      type: import_sequelize8.DataTypes.STRING
    },
    instagram: {
      type: import_sequelize8.DataTypes.STRING
    },
    linkedin: {
      type: import_sequelize8.DataTypes.STRING
    },
    youtube: {
      type: import_sequelize8.DataTypes.STRING
    }
  },
  {
    sequelize: db_default,
    modelName: "evento"
    // Nome da tabela no banco de dados
  }
);
var Event_default = Event;

// controllers/EventController.ts
var import_remove_accents2 = require("remove-accents");
var import_axios2 = __toESM(require("axios"));
var import_basic_ftp4 = require("basic-ftp");
var import_sharp4 = __toESM(require("sharp"));
var createEvent = (req, res) => __async(void 0, null, function* () {
  try {
    const { nome, sobre, data, publicoAlvo, objetivos, cargaHoraria, horario, modalidade, local, link, facebook, instagram, linkedin, youtube, tematicas } = req.body;
    const publicoAlvoString = publicoAlvo.join(", ");
    const objetivosString = objetivos.join(", ");
    const tematicasString = tematicas.join(", ");
    if (typeof nome !== "string") {
      return res.status(400).json({ error: "O t\xEDtulo deve ser uma string v\xE1lida." });
    }
    const existingPost = yield Event_default.findOne({ where: { nome } });
    if (existingPost) {
      return res.status(400).json({ error: "J\xE1 existe um evento com o mesmo titulo." });
    }
    const slug = (0, import_remove_accents2.remove)(nome).toLowerCase().replace(/\s+/g, "-");
    if (req.file) {
      const imagePath = req.file.path;
      const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");
      if (!imagePath.includes("webp")) {
        yield (0, import_sharp4.default)(imagePath).webp({ quality: 90 }).toFile(webpPath);
      }
      const client = new import_basic_ftp4.Client();
      yield client.access({
        host: "ftp.ibtec.org.br",
        user: "dev@dev.ibtec.org.br",
        password: "Dev04121996"
      });
      yield client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));
      yield client.close();
    }
    const newEvent = yield Event_default.create({
      nome,
      sobre,
      data,
      slug,
      publicoAlvo: publicoAlvoString,
      objetivos: objetivosString,
      tematicas: tematicasString,
      cargaHoraria,
      horario,
      modalidade,
      local,
      link,
      facebook,
      instagram,
      linkedin,
      youtube,
      imagem: req.file ? req.file.filename.replace(/\.[^.]+$/, ".webp") : null
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var editEvent = (req, res) => __async(void 0, null, function* () {
  try {
    const eventId = Number(req.params.id);
    const event = yield Event_default.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Evento n\xE3o encontrada" });
    }
    const { nome, sobre, data, publicoAlvo, objetivos, cargaHoraria, horario, modalidade, local, link, facebook, instagram, linkedin, youtube } = req.body;
    const publicoAlvoString = publicoAlvo.join(", ");
    const objetivosString = objetivos.join(", ");
    console.log(req.body);
    const slug = (0, import_remove_accents2.remove)(nome).toLowerCase().replace(/\s+/g, "-");
    if (nome === event.nome && slug === event.slug && sobre === event.sobre && data === event.data && publicoAlvo === event.publicoAlvo && objetivos === event.objetivos && cargaHoraria === event.cargaHoraria && horario === event.horario && modalidade === event.modalidade && local === event.local && link === event.link && facebook === event.facebook && instagram === event.instagram && linkedin === event.linkedin && youtube === event.youtube && !req.file) {
      return res.status(200).json({ message: "Nenhum dado foi modificado." });
    }
    event.nome = nome;
    event.slug = slug;
    event.data = data;
    event.publicoAlvo = publicoAlvoString;
    event.objetivos = objetivosString;
    event.cargaHoraria = cargaHoraria;
    event.horario = horario;
    event.modalidade = modalidade;
    event.local = local;
    event.link = link;
    event.facebook = facebook;
    event.instagram = instagram;
    event.linkedin = linkedin;
    event.youtube = youtube;
    if (req.file) {
      const imagePath = req.file.path;
      const webpPath = imagePath.replace(/\.[^.]+$/, ".webp");
      yield (0, import_sharp4.default)(imagePath).webp({ quality: 90 }).toFile(webpPath);
      const client = new import_basic_ftp4.Client();
      yield client.access({
        host: "ftp.ibtec.org.br",
        user: "dev@dev.ibtec.org.br",
        password: "Dev04121996"
      });
      yield client.uploadFrom(webpPath, "/blog/" + req.file.filename.replace(/\.[^.]+$/, ".webp"));
      yield client.close();
      event.imagem = req.file.filename.replace(/\.[^.]+$/, ".webp");
    }
    yield event.save();
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var deleteEvento = (req, res) => __async(void 0, null, function* () {
  try {
    const eventId = Number(req.params.id);
    const event = yield Event_default.findByPk(eventId);
    if (!event) {
      res.status(404).json({ error: "Evento n\xE3o encontrada" });
      return;
    }
    yield event.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var getEventBySlug = (req, res) => __async(void 0, null, function* () {
  try {
    const eventSlug = req.params.slug;
    const event = yield Event_default.findOne({ where: { slug: eventSlug } });
    if (!event) {
      res.status(404).json({ error: "Evento n\xE3o encontrado" });
      return;
    }
    const remoteFileUrl = `https://dev.ibtec.org.br/dev/blog/${event.imagem}`;
    const response = yield import_axios2.default.get(remoteFileUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);
    const originalImageBuffer = yield (0, import_sharp4.default)(imageBuffer).toBuffer();
    res.json(__spreadProps(__spreadValues({}, event.toJSON()), {
      originalImageBuffer
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
var getEvents = (req, res) => __async(void 0, null, function* () {
  try {
    const limit = req.query.limit;
    const parsedLimit = limit ? parseInt(limit, 10) : void 0;
    const events = yield Event_default.findAll({
      limit: typeof parsedLimit === "number" ? parsedLimit : void 0,
      order: [["id", "DESC"]]
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// routes/events.ts
var import_multer4 = __toESM(require("multer"));
var router6 = import_express8.default.Router();
var storage4 = import_multer4.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});
var upload4 = (0, import_multer4.default)({ storage: storage4 });
router6.get("/ultimos-events", getEvents);
router6.delete("/deletar/:id", deleteEvento);
router6.post("/criar-evento", upload4.single("imagem"), createEvent);
router6.put("/editar/:id", upload4.single("imagem"), editEvent);
router6.get("/:slug", getEventBySlug);
var events_default = router6;

// server.ts
var import_sequelize9 = require("sequelize");
var app = (0, import_express9.default)();
var port = process.env.PORT || 3e3;
app.use(import_body_parser.default.urlencoded({ extended: false }));
app.use(import_body_parser.default.json());
app.use(
  (0, import_cors.default)({
    origin: ["http://localhost:5173", "https://dev.ibtec.org.br", "https://ibtec.org.br", "https://www.ibtec.org.br", "https://ibtec.vercel.app"]
  })
);
var sequelize2 = new import_sequelize9.Sequelize({
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
app.use("/api/event", events_default);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
