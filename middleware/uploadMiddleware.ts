import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // O diretório onde os arquivos serão armazenados
	},
	filename: (req, file, cb) => {
		const fileName = Date.now() + "-" + file.originalname;
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage });

export default upload;
