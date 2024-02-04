import { Router, error, json } from "itty-router";
import { handleDiscordRequest } from "./client/discord";
import { handlePatreonRequest } from "./client/patreon";

export interface Env {
	DISCORD_APPLICATION_ID: string;
	DISCORD_PUBLIC_KEY: string;
	DISCORD_TOKEN: string;
	DISCORD_WEBHOOK_SECRET: string;
	DISCORD_WEBHOOK_ID: string;
	PATREON_WEBHOOK_SECRET: string;
}

const router = Router();
router
	.post("/patreon", (request: Request, env: Env) =>
		handlePatreonRequest(request, env),
	)
	.post("/interactions", (request: Request, env: Env) =>
		handleDiscordRequest(request, env),
	)
	.all("*", () => "👋🌍");

export default {
	fetch: (req: Request, env: Env, ctx: ExecutionContext) =>
		router.handle(req, env, ctx).then(json).catch(error),
};
