// return custom selectors from the css root
export default root => {
	// initialize custom selectors
	const customMedias = {};

	// for each @custom-media at-rule
	root.nodes.forEach(node => {
		if (isCustomMedia(node)) {
			// extract the name and selectors from the params of the custom selector
			const [, name, selectors] = node.params.match(customMediaParamsRegExp);

			// write the parsed selectors to the custom selector
			customMedias[name] = selectors;
		}
	});

	// return all custom medias
	return customMedias;
};

// match the custom selector name
const customMediaNameRegExp = /^custom-media$/i;

// match the custom selector params
const customMediaParamsRegExp = /^(--[A-z][\w-]*)\s+([\W\w]+)\s*$/;

// whether the atrule is a custom selector
const isCustomMedia = node => node.type === 'atrule' && customMediaNameRegExp.test(node.name) && customMediaParamsRegExp.test(node.params);
