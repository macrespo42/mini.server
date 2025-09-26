import type { Response, Request } from "express";
import { upgradeToRed } from "../lib/db/queries/users.js";
import {
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/errorHandler.js";
import { config } from "../config.js";
import { getAPIKey } from "../auth.js";

export async function handlerPolkaPayment(req: Request, res: Response) {
  type Params = {
    event: string;
    data: {
      userId: string;
    };
  };

  const apiKey = getAPIKey(req);
  if (apiKey !== config.polkaKey) {
    throw new UnauthorizedError("Unauthorized");
  }

  const params: Params = req.body;
  if (params.event === "user.upgraded") {
    const upgraded = await upgradeToRed(params.data.userId);
    if (!upgraded) {
      throw new NotFoundError("Not Found");
    }
    res.status(204).send();
  } else {
    res.status(204).send();
  }
}
