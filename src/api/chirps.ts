import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../middlewares/errorHandler.js";
import { createChirp } from "../lib/db/queries/chirps.js";

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
    userId: string;
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

  const chirp = await createChirp({
    body: cleanedBody,
    userId: params.userId,
  });

  res.status(201).json(chirp);
}
