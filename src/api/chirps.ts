import type { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
  type Parameter = {
    body: string;
  };

  try {
    const body: Parameter = req.body;
    res.set("Content-Type", "application/json");

    if (body.body.length > 140) {
      res.status(400).send(
        JSON.stringify({
          error: "Chirp is too long",
        }),
      );
    } else {
      res.status(200).send(
        JSON.stringify({
          valid: true,
        }),
      );
    }
  } catch (error) {
    res.status(400).send("Invalid JSON");
  }
}
