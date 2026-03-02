import { lib, ui, get } from "../../../noname.js";

export function ensureDialogCompat() {
	if (ui.create && typeof ui.create.dialog == "function" && typeof ui.create.newdialog != "function") {
		ui.create.newdialog = function () {
			const args = Array.from(arguments);
			const dialogArgs = [];
			let dialogId;

			for (const arg of args) {
				if (typeof arg == "string" && arg.indexOf("#") == 0 && arg.indexOf(">") == -1) {
					dialogId = arg.slice(1);
				} else {
					dialogArgs.push(arg);
				}
			}

			const dialog = ui.create.dialog.apply(ui.create, dialogArgs);
			dialog.classList.add("noupdate");
			if (dialogId) dialog.id = dialogId;
			return dialog;
		};
	}

	if (!lib.element || !lib.element.dialog) return;

	const newadd = function (item, noclick, zoom, ac) {
		if (typeof item == "string") {
			if (item.indexOf("###") == 0) {
				var items = item.slice(3).split("###");
				this.add(items[0], noclick, zoom);
				this.addText(items[1], items[1].length <= 20, zoom);
			} else if (noclick) {
				var strstr = item;
				item = ui.create.div("", this.content);
				item.innerHTML = strstr;
			} else {
				item = ui.create.caption(item, this.content);
			}
		} else if (["div", "fragment"].includes(get.objtype(item))) {
			this.content.appendChild(item);
		} else if (get.itemtype(item) == "cards") {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) buttons.classList.add("smallzoom");
			if (ac) ac.appendChild(buttons);
			this.buttons = this.buttons.concat(ui.create.buttons(item, "card", buttons, noclick));
		} else if (get.itemtype(item) == "players") {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) buttons.classList.add("smallzoom");
			if (ac) ac.appendChild(buttons);
			this.buttons = this.buttons.concat(ui.create.buttons(item, "player", buttons, noclick));
		} else if (item && item[1] == "textbutton") {
			ui.create.textbuttons(item[0], this, noclick);
		} else {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) buttons.classList.add("smallzoom");
			if (ac) ac.appendChild(buttons);
			this.buttons = this.buttons.concat(ui.create.buttons(item[0], item[1], buttons, noclick));
		}
		if (this.buttons.length) {
			if (this.forcebutton !== false) this.forcebutton = true;
			if (this.buttons.length > 3 || (zoom && this.buttons.length > 5)) {
				this.classList.remove("forcebutton-auto");
			} else if (!this.noforcebutton) {
				this.classList.add("forcebutton-auto");
			}
		}
		ui.update();
		return item;
	};

	if (typeof lib.element.dialog.newadd != "function") {
		lib.element.dialog.newadd = newadd;
	}
	if (lib.element.Dialog && lib.element.Dialog.prototype && typeof lib.element.Dialog.prototype.newadd != "function") {
		lib.element.Dialog.prototype.newadd = newadd;
	}
}
