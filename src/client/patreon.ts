import { error } from "itty-router";
import type { Env } from "../index";
import { isPatreonRequest } from "./verify";

export async function handlePatreonRequest(
	request: Request,
	env: Env,
): Promise<Response> {
	const { content, isValid } = await isPatreonRequest(request, env);

	if (!content || !isValid) return error(401);

	return error(200);
}
