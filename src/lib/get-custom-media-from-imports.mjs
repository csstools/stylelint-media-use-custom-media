import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import getCustomMediaFromRoot from './get-custom-media-from-root.mjs';

/* Get Custom Media from CSS File
/* ========================================================================== */

async function getCustomMediaFromCSSFile(from) {
	const css = await readFile(from);
	const root = postcss.parse(css, { from });

	return getCustomMediaFromRoot(root);
}

/* Get Custom Media from Object
/* ========================================================================== */

function getCustomMediaFromObject(object) {
	const customMedia = Object.assign(
		{},
		Object(object).customMedia,
		Object(object)['custom-media']
	);

	return customMedia;
}

/* Get Custom Media from JSON file
/* ========================================================================== */

async function getCustomMediaFromJSONFile(from) {
	const object = await readJSON(from);

	return getCustomMediaFromObject(object);
}

/* Get Custom Media from JS file
/* ========================================================================== */

async function getCustomMediaFromJSFile(from) {
	const object = await import(from);

	return getCustomMediaFromObject(object);
}

/* Get Custom Media from Imports
/* ========================================================================== */

export default function getCustomMediaFromImports(sources) {
	return sources.map(source => {
		if (source instanceof Promise) {
			return source;
		} else if (source instanceof Function) {
			return source();
		}

		// read the source as an object
		const opts = source === Object(source) ? source : { from: String(source) };

		// skip objects with Custom Media
		if (opts.customMedia || opts['custom-media']) {
			return opts
		}

		// source pathname
		const from = path.resolve(String(opts.from || ''));

		// type of file being read from
		const type = (opts.type || path.extname(from).slice(1)).toLowerCase();

		return { type, from };
	}).reduce(async (customMedia, source) => {
		const { type, from } = await source;

		if (type === 'css') {
			return Object.assign(await customMedia, await getCustomMediaFromCSSFile(from));
		}

		if (type === 'js') {
			return Object.assign(await customMedia, await getCustomMediaFromJSFile(from));
		}

		if (type === 'json') {
			return Object.assign(await customMedia, await getCustomMediaFromJSONFile(from));
		}

		return Object.assign(await customMedia, await getCustomMediaFromObject(await source));
	}, {});
}

/* Promise-ified utilities
/* ========================================================================== */

const readFile = from => new Promise((resolve, reject) => {
	fs.readFile(from, 'utf8', (error, result) => {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
});

const readJSON = async from => JSON.parse(await readFile(from));
