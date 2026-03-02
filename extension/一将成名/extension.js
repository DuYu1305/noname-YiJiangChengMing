import { lib, game, ui, get, ai, _status } from "../../noname.js";
import "./utils/api.js";
import { content, precontent, prepare, arenaReady } from "./main/index.js";
import { EXTENSION_NAME, baseUrl, getFloders } from "./utils/index.js";
import { config } from "./config/index.js";
import { help, _package, files } from "./config/other.js";

export const type = "extension";
export default async function () {
	window.yjcm = {};
	const extensionInfo = await lib.init.promises.json(`${baseUrl}info.json`);
	return {
		name: EXTENSION_NAME,
		arenaReady,
		content,
		prepare,
		precontent,
		config: config(),
		help,
		package: _package(extensionInfo),
		files,
		connect: false,
	};
}
