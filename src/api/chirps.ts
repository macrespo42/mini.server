import type { Request, Response } from "express";

type Body = {
  body: string;
};

export async function handlerValidateChirp(req: Request, res: Response) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsedBody: Body = JSON.parse(body);
      res.set("Content-Type", "application/json");

      if (parsedBody.body.length > 140) {
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
  });
}
