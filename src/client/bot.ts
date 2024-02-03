import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { error, json } from "itty-router";
import type { Env } from "./index";
import { isDiscordRequest } from "./verify";

export async function handleRequest(
	request: Request,
	env: Env,
): Promise<Response> {
	if (
		!request.headers.get("x-signature-ed25519") ||
		!request.headers.get("x-signature-timestamp")
	)
		return error(401);

	const { isValid, interaction } = await isDiscordRequest(request, env);

	if (!isValid || !interaction) return error(401);

	if (interaction.type === InteractionType.Ping)
		return json({ type: InteractionResponseType.Pong });

	return error(400);
}
