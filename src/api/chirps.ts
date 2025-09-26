import type { Request, Response } from "express";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/errorHandler.js";
import {
  createChirp,
  deleteChirp,
  getAllChirps,
  getChirp,
} from "../lib/db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

function censorBadWord(text: string, badWords: string[]) {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }
  return words.join(" ");
}

export async function handlerCreateChirp(req: Request, res: Response) {
  type Params = {
    body: string;
  };

  const params: Params = req.body;

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = censorBadWord(params.body, [
    "kerfuffle",
    "sharbert",
    "fornax",
  ]);

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.secret);

  if (!userId) {
    throw new Error("Invalid jwt");
  }

  const chirp = await createChirp({
    body: cleanedBody,
    userId: userId,
  });

  res.status(201).json(chirp);
}

export async function handlerGetAllChirps(_: Request, res: Response) {
  const chirps = await getAllChirps();
  res.status(200).json(chirps);
}

export async function handleGetChirp(req: Request, res: Response) {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new NotFoundError("Chirp Not Found");
  }
  const chirp = await getChirp(id);
  if (!chirp) {
    throw new NotFoundError("Not Found");
  }
  res.status(200).json(chirp);
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const chirpId = req.params.chirpId;

  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);

    const chirp = await getChirp(chirpId);
    console.log(`CHIRP: ${JSON.stringify(chirp)}`);
    if (chirp.userId !== userId) {
      throw new ForbiddenError("Unauthorized");
    }

    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
      throw new NotFoundError("Not Found");
    } else {
      res.status(204).send("Deleted");
    }
  } catch (err) {
    throw err;
  }
}
