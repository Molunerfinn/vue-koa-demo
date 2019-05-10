export function encodeHtml(html) {
  return html && html.replace ? (html.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>").replace(/\r/g, "")) : html
}

export function encodeHtmlAttr(html) {
  return html && html.replace ? (html.replace(/\"/g, "&#x22;").replace(/\'/g, "&#x27;").replace(/</g, "&#x3c;").replace(/>/g, "&#x3e;").replace(/&/g, "&#x26;")).replace(/\\/g, "&#5c;") : html
}

export function encodeUrl(url) {
  return typeof url === "undefined" ? "": encodeURIComponent(url)
}

export function decodeHtml(html) {
  return html && html.replace ? (html.replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/g, ">").replace(/&#92;/gi, "\\").replace(/&#39;/gi, "'").replace(/&quot;/gi, '"').replace(/\<br\/\>/gi, "\n").replace(/&amp;/gi, "&")) : html
}

export function decodeUrl(url) {
  return typeof url === "undefined" ? "": decodeURIComponent(url)
}
