import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../middlewares/errorHandler.js";

function censorBadWord(text: string, badWords: string[]) {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }
  return words.join(" ");
}

export async function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type Parameter = {
    body: string;
  };

  try {
    const params: Parameter = req.body;
    res.set("Content-Type", "application/json");

    if (params.body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    } else {
      res.status(200).send(
        JSON.stringify({
          cleanedBody: censorBadWord(params.body, [
            "kerfuffle",
            "sharbert",
            "fornax",
          ]),
        }),
      );
    }
  } catch (error) {
    next(error);
  }
}
