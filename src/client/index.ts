import { Router, error, json } from "itty-router";
import { handleRequest } from "./bot";

export interface Env {
	DISCORD_APPLICATION_ID: string;
	DISCORD_PUBLIC_KEY: string;
	DISCORD_TOKEN: string;
}

const router = Router();
router
	.post("/interactions", (request, env: Env) => handleRequest(request, env))
	.all("*", () => "👋🌍");

export default {
	fetch: (req: Request, env: Env, ctx: ExecutionContext) =>
		router.handle(req, env, ctx).then(json).catch(error),
};
