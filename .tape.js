const test = require('stylelint-test-rule-tape');
const { default: { rule }, ruleName } = require('.');
let accept = [], reject = [];

/* Test basic checks
/* ========================================================================== */

test(rule, { ruleName, config: 'ignore' });
test(rule, { ruleName, config: null });
test(rule, { ruleName, config: 'always' });
test(rule, { ruleName, config: true });
test(rule, { ruleName, config: 'never' });
test(rule, { ruleName, config: false });

/* Test "ignore"
/* ========================================================================== */

accept = [
	{ code: '@media (--sm) {}', description: 'valid custom media' },
	{ code: '@media (min-width: 40rem) {}', description: 'invalid custom media' }
];

test(rule, { ruleName, skipBasicChecks: true, config: 'ignore', accept });
test(rule, { ruleName, skipBasicChecks: true, config: null, accept });

/* Test "always"
/* ========================================================================== */

accept = [
	{ code: '@media (--sm) {}', description: 'valid custom media' },
	{ code: '@media screen and (--sm) {}', description: 'valid custom media' },
	{ code: '@media not print and (--sm) {}', description: 'valid custom media' },
	{ code: '@media screen and (--sm), (--md) {}', description: 'valid custom media' },
	{ code: '@media not print and (--sm), (--md) {}', description: 'valid custom media' }
];

reject = [
	{ code: '@media (min-width: 40rem) {}', description: 'invalid custom media' },
	{ code: '@media screen and (min-width: 40rem) {}', description: 'invalid custom media' },
	{ code: '@media not print and (min-width: 40rem) {}', description: 'invalid custom media' },
	{ code: '@media screen and (min-width: 40rem), (--md) {}', description: 'invalid custom media' },
	{ code: '@media not print and (min-width: 40rem), (--md) {}', description: 'invalid custom media' },
	{ code: '@media (--md), screen and (min-width: 40rem) {}', description: 'invalid custom media' },
	{ code: '@media (--md), not print and (min-width: 40rem) {}', description: 'invalid custom media' }
];

test(rule, { ruleName, skipBasicChecks: true, config: 'always', accept, reject });
test(rule, { ruleName, skipBasicChecks: true, config: true, accept, reject });

/* Test "never"
/* ========================================================================== */

accept = [
	{ code: '@media (min-width: 40rem) {}', description: 'valid custom media' }
];

reject = [
	{ code: '@media (--sm) {}', description: 'invalid custom media' }
];

test(rule, { ruleName, skipBasicChecks: true, config: 'never', accept, reject });
test(rule, { ruleName, skipBasicChecks: true, config: false, accept, reject });

/* Test "known", [ "known", { importFrom } ] functionality
/* ========================================================================== */

accept = [
	{ code: '@custom-media --sm (min-width: 40rem); @media (--sm) {} @media (min-width: 40em) {}', description: 'known media' }
];

reject = [
	{ code: '@media (--md) {}', description: 'unknown media' }
];

test(rule, { ruleName, skipBasicChecks: true, config: 'known', accept, reject });

accept = [
	{ code: '@media (--sm) {} @media (min-width: 40em) {}', description: 'known media' }
];

test(rule, { ruleName, skipBasicChecks: true, accept, reject, config: [
	'known',
	{ importFrom: { customMedia: { '--sm': '(min-width: 40em)' } } }
] });

/* Test "always-known", [ "always-known", { importFrom } ] functionality
/* ========================================================================== */

accept = [
	{ code: '@custom-media --sm (min-width: 40rem); @media (--sm) {}', description: 'known custom media' }
];

reject = [
	{ code: '@media (--md) {}', description: 'unknown custom media' },
	{ code: '@media (min-width: 40em) {}', description: 'not custom media' }
];

test(rule, { ruleName, skipBasicChecks: true, config: 'always-known', accept, reject });

accept = [
	{ code: '@media (--sm) {}', description: 'known custom media' }
];

test(rule, { ruleName, skipBasicChecks: true, accept, reject, config: [
	'always-known',
	{ importFrom: { customMedia: { '--sm': '(min-width: 40em)' } } }
] });
