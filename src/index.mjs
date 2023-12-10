import stylelint from "stylelint";
import parseMedia from './lib/parse-media.mjs';
import getCustomMediaFromImports from './lib/get-custom-media-from-imports.mjs';
import getCustomMediaFromRoot from './lib/get-custom-media-from-root.mjs';

const ruleName = 'csstools/media-use-custom-media';

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected(expression) {
		return `Expected a custom media query instead of "${expression}".`;
	},
	unexpected(expression) {
		return `Expected no custom media query instead of "${expression}".`;
	}
});

const ruleFunction = (method, opts) => {
	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// conditionally promise any custom selectors are imported
	const customMediaPromise = isMethodAlwaysKnown(method) || isMethodKnown(method)
		? getCustomMediaFromImports(importFrom)
		: {};

	return async (root, result) => {
		// valid methods are: "always" || "always-known" || "never" || "known" || true || null
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodAlways(method) || isMethodAlwaysKnown(method) || isMethodIndifferent(method) || isMethodKnown(method) || isMethodNever(method);
			}
		});

		// conditionally enforce the use of custom media
		if (validOptions && !isMethodIndifferent(method)) {
			// all custom properties from the file and imports
			const customMedia = isMethodAlwaysKnown(method) || isMethodKnown(method)
				? Object.assign(await customMediaPromise, getCustomMediaFromRoot(root))
				: {};

			// check every @media at-rule
			root.walkAtRules(mediaAtRuleNameRegExp, atrule => {
				const mediaAST = parseMedia(atrule.params);
				let word = `@${atrule.name}`;

				// check whether media queries are using custom media references
				const isCorrectlyUsingMedia = mediaAST.nodes.every(
					node => node.nodes.every(
						child => {
							// whether the expression is like @media (--foo)
							const isCustomExpression = checkCustomExpression(child);

							const returnValue = isCustomExpression
								? isMethodKnown(method) || isMethodAlwaysKnown(method)
									// @media (--foo) && ("always-known" || "known") && @custom-media --foo bar;
									? child.value.slice(1, -1) in customMedia
									// @media (--foo) && "always"
									: isMethodAlways(method)
								// !@media (--foo) && ("known" || "never")
								: isMethodKnown(method) || isMethodNever(method);

							if (!returnValue) {
								word = String(child);
							}

							return returnValue;
						}
					)
				);

				// conditionally report media queries not using custom media references
				if (!isCorrectlyUsingMedia) {
					stylelint.utils.report({
						message: isMethodNever(method)
							? messages.unexpected(atrule.params)
							: messages.expected(atrule.params),
						node: atrule,
						result,
						ruleName,
						word
					});
				}
			});
		}
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);

const mediaAtRuleNameRegExp = /^media$/i;
const customMediaExpressionRegExp = /\(--[\w-]+\)/i;

const checkCustomExpression = node => node.nodeType === 'expression' && customMediaExpressionRegExp.test(node.value)

const isMethodIndifferent = method => method === 'ignore' || method === null;
const isMethodAlways = method => method === 'always' || method === true;
const isMethodAlwaysKnown = method => method === 'always-known';
const isMethodKnown = method => method === 'known';
const isMethodNever = method => method === 'never';
