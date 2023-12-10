import { testRule } from 'stylelint-test-rule-node';
import plugin from './src/index.mjs';

const rule = plugin.rule;
const messages = plugin.rule.messages;

let accept = [], reject = [];

/* Test basic checks
/* ========================================================================== */

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'ignore', accept: [''] });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: null, accept: [''] });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'always', accept: [''] });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: true, accept: [''] });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'never', accept: [''] });

// /* Test "ignore"
// /* ========================================================================== */

accept = [
	{ code: '@media (--sm) {}', description: 'valid custom media' },
	{ code: '@media (min-width: 40rem) {}', description: 'invalid custom media' }
];

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'ignore', accept: accept });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: null, accept: accept });

// /* Test "always"
// /* ========================================================================== */

accept = [
	{ code: '@media (--sm) {}', description: 'valid custom media' },
	{ code: '@media screen and (--sm) {}', description: 'valid custom media' },
	{ code: '@media not print and (--sm) {}', description: 'valid custom media' },
	{ code: '@media screen and (--sm), (--md) {}', description: 'valid custom media' },
	{ code: '@media not print and (--sm), (--md) {}', description: 'valid custom media' }
];

reject = [
	{
		code: '@media (min-width: 40rem) {}',
		description: 'invalid custom media',
		message: messages.expected('(min-width: 40rem)'),
	},
	{
		code: '@media screen and (min-width: 40rem) {}',
		description: 'invalid custom media',
		message: messages.expected('screen and (min-width: 40rem)'),
	},
	{
		code: '@media not print and (min-width: 40rem) {}',
		description: 'invalid custom media',
		message: messages.expected('not print and (min-width: 40rem)'),
	},
	{
		code: '@media screen and (min-width: 40rem), (--md) {}',
		description: 'invalid custom media',
		message: messages.expected('screen and (min-width: 40rem), (--md)'),
	},
	{
		code: '@media not print and (min-width: 40rem), (--md) {}',
		description: 'invalid custom media',
		message: messages.expected('not print and (min-width: 40rem), (--md)'),
	},
	{
		code: '@media (--md), screen and (min-width: 40rem) {}',
		description: 'invalid custom media',
		message: messages.expected('(--md), screen and (min-width: 40rem)'),
	},
	{
		code: '@media (--md), not print and (min-width: 40rem) {}',
		description: 'invalid custom media',
		message: messages.expected('(--md), not print and (min-width: 40rem)'),
	 }
];

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'always', accept: accept, reject: reject });
testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: true, accept: accept, reject: reject });

// /* Test "never"
// /* ========================================================================== */

accept = [
	{ code: '@media (min-width: 40rem) {}', description: 'valid custom media' }
];

reject = [
	{ code: '@media (--sm) {}', description: 'invalid custom media', message: messages.unexpected('(--sm)') }
];

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'never', accept: accept, reject: reject });

// /* Test "known", [ "known", { importFrom } ] functionality
// /* ========================================================================== */

accept = [
	{ code: '@custom-media --sm (min-width: 40rem); @media (--sm) {} @media (min-width: 40em) {}', description: 'known media' }
];

reject = [
	{ code: '@media (--md) {}', description: 'unknown media', message: messages.expected('(--md)') },
];

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'known', accept: accept, reject: reject });

accept = [
	{ code: '@media (--sm) {} @media (min-width: 40em) {}', description: 'known media' }
];

testRule({
	plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: [
		'known',
		{ importFrom: { customMedia: { '--sm': '(min-width: 40em)' } } }
	], accept: accept, reject: reject });

// /* Test "always-known", [ "always-known", { importFrom } ] functionality
// /* ========================================================================== */

accept = [
	{ code: '@custom-media --sm (min-width: 40rem); @media (--sm) {}', description: 'known custom media' }
];

reject = [
	{ code: '@media (--md) {}', description: 'unknown custom media', message: messages.expected('(--md)') },
	{ code: '@media (min-width: 40em) {}', description: 'not custom media', message: messages.expected('(min-width: 40em)') }
];

testRule({ plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: 'always-known', accept: accept, reject: reject });

accept = [
	{ code: '@media (--sm) {}', description: 'known custom media' }
];

testRule({
	plugins: ['./src/index.mjs'], ruleName: rule.ruleName, config: [
		'always-known',
		{ importFrom: { customMedia: { '--sm': '(min-width: 40em)' } } }
	], accept: accept, reject: reject
});
