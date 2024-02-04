import { error } from "itty-router";
import { RouteBases, Routes, Snowflake } from 'discord-api-types/v10';
import { isPatreonRequest } from "./verify";
import type { Env } from "../index";


export async function handlePatreonRequest(
	request: Request,
	env: Env,
): Promise<Response> {
	const { content, isValid } = await isPatreonRequest(request, env);

	if (!content || !isValid) return error(401);

	const postTitle = 'Patreon: ' + content.data.attributes.title as String
	const postLink = 'https://www.patreon.com' + content.data.attributes.url as String

	const channelId = "1196157901954355242" as Snowflake
	await fetch(`${RouteBases.api}${Routes.channelMessages(channelId)}`, {
		method: 'POST',
		headers: { Authorization: `Bot ${env.DISCORD_TOKEN}`, 'content-type': 'application/json' },
		body: JSON.stringify({
			content: `${postTitle}\n${postLink}`
		})
	})

	return error(200);
}
