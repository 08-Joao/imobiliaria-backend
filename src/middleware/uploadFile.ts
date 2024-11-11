import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { UPLOADS_DIR } from "../config/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para gerar um nome aleatório de 32 caracteres
function generateRandomName(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Função para obter a extensão do arquivo baseado no tipo MIME
function getExtension(mimetype: string): string {
  const mimeMap: { [key: string]: string } = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "video/mp4": ".mp4",
    "video/mpeg": ".mpeg",
    "video/mov": ".mov",
  };
  return mimeMap[mimetype] || "";
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storagePath = UPLOADS_DIR
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true });
    }

    cb(null, storagePath);
  },

  filename: function (req: Request, file, cb) {
    const userId = req.user?.id;
    if (!userId) {
      return cb(new Error("User ID not found"), "");
    }

    const randomName = generateRandomName();
    const extension = getExtension(file.mimetype);

    if (!extension) {
      console.log(`Tipo de arquivo inválido: ${file.mimetype}`);
      return cb(new Error("Invalid file type"), "");
    }

    const uniqueName = `${userId}-${randomName}${extension}`;
    cb(null, uniqueName);
  },
});

// Função `fileFilter` para validar o tipo do arquivo e o tipo de upload
function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const uploadType = req.headers.uploadtype;
  const allowedImageMimeTypes = ["image/jpeg", "image/png"];
  const allowedVideoMimeTypes = ["video/mp4", "video/mpeg", "video/mov"];

  // Verifica o uploadType e valida os tipos MIME permitidos
  if (uploadType === "profilePic") {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Permite apenas imagens
    } else {
      console.log(`Arquivo de tipo não permitido para profilePic: ${file.mimetype}`);
      cb(new Error("Apenas imagens são permitidas para profilePic"));
    }
  } else {
    // Para outros tipos de upload, permite imagens e vídeos
    if (allowedImageMimeTypes.includes(file.mimetype) || allowedVideoMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(`Arquivo de tipo não permitido: ${file.mimetype}`);
      cb(new Error("Tipo de arquivo não permitido"));
    }
  }
}

// Configuração do multer com `fileFilter`
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Função de middleware para o upload do arquivo
async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    const uploadType = req.headers.uploadtype;
    
    if (!uploadType) {
      return res.status(400).send({ error: "Upload type not provided" });
    }

    const uploadHandler = uploadType === "profilePic"
      ? upload.single("file")
      : upload.array("file", 10);

    uploadHandler(req, res, (err: any) => {
      if (err) {
        if (err.message === "Tipo de arquivo não permitido" || err.message === "Apenas imagens são permitidas para profilePic") {
          console.error("Erro de tipo de arquivo:", err.message);
          return res.status(400).send({ error: err.message });
        }

        console.error(`Erro no upload: ${err.message}`);
        return res.status(400).send({ error: err.message });
      }

      next();
    });
  } catch (error) {
    console.error("Erro no middleware de upload:", error);
    return res.status(500).send("Erro no processamento do arquivo");
  }
}

export default uploadFile;
