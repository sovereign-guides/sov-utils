import crypto from "node:crypto";
import {
	APIApplicationCommandInteraction,
	APIPingInteraction,
} from "discord-api-types/v10";
import { verifyKey } from "discord-interactions";
import type { Env } from "../index";

export async function isDiscordRequest(request: Request, env: Env) {
	const signature = request.headers.get("x-signature-ed25519");
	const timestamp = request.headers.get("x-signature-timestamp");
	const body = await request.text();

	const isValidRequest =
		signature &&
		timestamp &&
		verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);

	if (!isValidRequest) return { isValid: false };

	return {
		interaction: JSON.parse(body) as
			| APIPingInteraction
			| APIApplicationCommandInteraction,
		isValid: true,
	};
}

// Not a fan... Patreon get off MD5 NOW 😤
export async function isPatreonRequest(request: Request, env: Env) {
	const signature = request.headers.get("x-patreon-signature");
	const body = await request.text();

	const md5Hasher = crypto.createHmac("MD5", env.PATREON_WEBHOOK_SECRET);
	const hash = md5Hasher.update(body).digest("hex");

	if (hash !== signature) return { isValid: false };

	return {
		content: JSON.parse(body),
		isValid: true,
	};
}
