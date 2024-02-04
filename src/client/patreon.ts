import { RouteBases, Routes } from "discord-api-types/v10";
import { error, json } from "itty-router";
import type { Env } from "../index";
import { isPatreonRequest } from "./verify";

export async function handlePatreonRequest(request: Request, env: Env): Promise<Response> {
	const { content, isValid } = await isPatreonRequest(request, env);

	if (!content || !isValid) return error(401);

	const postTitle = content.data.attributes.title as string;
	const postLink = `https://www.patreon.com${content.data.attributes.url}` as string;

	await fetch(`${RouteBases.api}${Routes.webhook(env.DISCORD_WEBHOOK_ID, env.DISCORD_WEBHOOK_SECRET)}`, {
		method: "POST",
		headers: {
			Authorization: `Bot ${env.DISCORD_TOKEN}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			content: `# New Patreon Post: ${postTitle}\n${postLink}`,
		}),
	});

	// return json({
	// 	body: {
	// 		content: `# New Patreon Post: ${postTitle}\n${postLink}`,
	// 	},
	// });

	return error(200);
}
