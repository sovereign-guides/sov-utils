import {
	APIApplicationCommandInteraction,
	APIPingInteraction,
} from "discord-api-types/v10";
import { verifyKey } from "discord-interactions";
import type { Env } from "./index";

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


export async function isPatreonRequest(request: Request, env: Env) {

}
