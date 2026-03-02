import { lib, game, ui } from "../../../noname.js";

import { createApp } from "../lib/vue.esm-browser.js";
import { EXTENSION_NAME, baseUrl, loadScript } from "../utils/index.js";

import OnloadSplash from "./OnloadSplash.js";

import { DefaultSplash } from "../../../noname/init/onload/default-splash.js";
export class YJCM extends DefaultSplash {
	id = "style-yjcm";
	name = "一将成名";
	resolve;
	app;
	clicked;
	rootNode;
	async init(node, resolve) {
		this.resolve = resolve;
		this.yjcmCon = ui.create.div(".yjcmCon", document.body);
		this.app = createApp(OnloadSplash, {
			node,
			click: this.click.bind(this),
		});
		this.app.mount(this.yjcmCon);
	}
	preview(node) {
		node.className = "button character";
		node.style.width = "200px";
		node.style.height = `${(node.offsetWidth * 1080) / 2400}px`;
		node.style.display = "flex";
		node.style.flexDirection = "column";
		node.style.alignItems = "center";
		node.style.backgroundSize = "100% 100%";
		node.setBackgroundImage(`${baseUrl}resource/image/splash/${this.id}.png`);
	}
	async dispose(node) {
		this.app.unmount();
		document.body.removeChild(this.yjcmCon);
		let yjpixi = document.querySelector(`script[src="${baseUrl}lib/pixi6.min.js"]`);
		let yjgasp = document.querySelector(`script[src="${baseUrl}lib/gsap.min.js"]`);
		document.head.removeChild(yjpixi);
		document.head.removeChild(yjgasp);
		return true;
	}
}
