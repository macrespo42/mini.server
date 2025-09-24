import type { Request, Response } from "express";

function censorBadWord(text: string, badWords: string[]) {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (badWords.includes(words[i].toLowerCase())) {
      words[i] = "****";
    }
  }
  return words.join(" ");
}

export async function handlerValidateChirp(req: Request, res: Response) {
  type Parameter = {
    body: string;
  };

  try {
    const params: Parameter = req.body;
    res.set("Content-Type", "application/json");

    if (params.body.length > 140) {
      res.status(400).send(
        JSON.stringify({
          error: "Chirp is too long",
        }),
      );
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
    res.status(400).send("Invalid JSON");
  }
}
