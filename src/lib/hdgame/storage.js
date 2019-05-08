export function setCookie(f, g, e) {
		let h = new Date();
		h.setDate(h.getDate() + e);
		document.cookie = f + "=" + escape(g) + ((e == null) ? "" : ";expires=" + h.toGMTString())
}

export function getCookie(e) {
		if (document.cookie.length > 0) {
			let c_start = document.cookie.indexOf(e + "=");
			if (c_start != -1) {
				c_start = c_start + e.length + 1;
				let c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = document.cookie.length
				}
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return ""
}

export function getLocalStorage(f, e) {
		if (!localStorage) {
			if (e) {
				return getCookie(f)
			}
			//b.log("不支持localStorage");
			return ""
		}
		return localStorage.getItem(f)
}

export function removeLocalStorage(f, e) {
		if (!localStorage) {
			if (e) {
				setCookie(f, "", -1)
			}
			//b.log("不支持localStorage");
			return
		}
		localStorage.removeItem(f)
}

export function setLocalStorage(f, g, e) {
		if (!localStorage) {
			if (e) {
				setCookie(f, g, e)
			}
			//b.log("不支持localStorage");
			return
		}
		localStorage.setItem(f, g)
}
