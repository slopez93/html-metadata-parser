"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.parse = void 0;
const axios_1 = require("axios");
const node_html_parser_1 = require("node-html-parser");
const readMT = (el, name) => {
    var prop = el.getAttribute('name') || el.getAttribute('property');
    return prop == name ? el.getAttribute('content') : null;
};
const parse = async (url, config) => {
    if (!/(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(url))
        return {};
    const { data } = await axios_1.default(url, config);
    const $ = node_html_parser_1.parse(data);
    const og = {}, meta = {}, images = [];
    const title = $.querySelector('title');
    if (title)
        meta.title = title.text;
    const canonical = $.querySelector('link[rel=canonical]');
    if (canonical) {
        meta.url = canonical.getAttribute('href');
    }
    const icon = $.querySelector('link[rel=icon]');
    const shortCoutIcon = $.querySelector('link[rel="shortcut icon"]');
    if (icon) {
        meta.favicon = icon.getAttribute('href');
    }
    else if (shortCoutIcon) {
        meta.favicon = shortCoutIcon.getAttribute('href');
    }
    const metas = $.querySelectorAll('meta');
    for (let i = 0; i < metas.length; i++) {
        const el = metas[i];
        ['title', 'description', 'image'].forEach(s => {
            const val = readMT(el, s);
            if (val)
                meta[s] = val;
        });
        ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach(s => {
            const val = readMT(el, s);
            if (val)
                og[s.split(':')[1]] = val;
        });
    }
    $.querySelectorAll('img').forEach(el => {
        let src = el.getAttribute('src');
        if (src) {
            src = new URL(src, url).href;
            images.push({ src });
        }
    });
    return { meta, og, images };
};
exports.parse = parse;
const parser = parse;
exports.parser = parser;
exports.default = parser;
//# sourceMappingURL=index.js.map