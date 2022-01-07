/* eslint-disable quote-props */
/* eslint-disable no-undef */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
		'react',
		'react-hooks'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
	settings: {
		react: {
			pragma: 'h',
			version: '16.0'
		}
	},

	rules: {

		// General Rules

		'@typescript-eslint/explicit-module-boundary-types': 0,
		'constructor-super': 2,
		'no-caller': 2,
		'no-const-assign': 2,
		'no-delete-var': 2,
		'no-dupe-class-members': 2,
		'no-dupe-keys': 2,
		'no-duplicate-imports': 2,
		'no-else-return': 1,
		'no-empty-pattern': 0,
		'no-empty': 0,
		'no-extra-parens': 0,
		'no-iterator': 2,
		'no-lonely-if': 2,
		'no-mixed-spaces-and-tabs': [ 1, 'smart-tabs' ],
		'no-multi-str': 1,
		'no-new-wrappers': 2,
		'no-proto': 2,
		'no-redeclare': 2,
		'no-shadow-restricted-names': 2,
		'no-shadow': 0,
		'no-spaced-func': 2,
		'no-this-before-super': 2,
		'no-undef-init': 2,
		'no-unneeded-ternary': 2,
		'no-useless-call': 1,
		'no-useless-computed-key': 1,
		'no-useless-concat': 1,
		'no-useless-constructor': 1,
		'no-useless-escape': 1,
		'no-useless-rename': 1,
		'no-var': 1,
		'strict': [ 2, 'never' ],
		'object-curly-spacing': [ 0, 'always' ],
		'rest-spread-spacing': 0,
		'space-before-function-paren': [ 0, 'always' ],
		'space-in-parens': [ 0, 'never' ],
		'object-shorthand': 1,
		'prefer-rest-params': 1,
		'prefer-spread': 1,
		'prefer-template': 1,
		'quote-props': [ 2, 'as-needed' ],
		'radix': 2,
		'unicode-bom': 2,
		'valid-jsdoc': 0,
		'prefer-arrow-callback': [ 2, { allowNamedFunctions: true }],
		'@typescript-eslint/no-unused-vars': [ 2, { argsIgnorePattern: '^_' } ],
		'@typescript-eslint/no-non-null-assertion': 0, // TODO: Enable this rule
		'@typescript-eslint/no-explicit-any': 0, // TODO: Enable this rule

		// Preact Specific Rules

		'react/no-deprecated': 2,
		'react/react-in-jsx-scope': 0,
		'react/display-name': [ 1, { ignoreTranspilerName: false } ],
		'react/jsx-no-bind': [ 1, {
			ignoreRefs: true,
			allowFunctions: true,
			allowArrowFunctions: true
		} ],
		'react/jsx-no-comment-textnodes': 2,
		'react/jsx-no-duplicate-props': 2,
		'react/jsx-no-target-blank': 2,
		'react/jsx-no-undef': 2,
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react/jsx-key': [ 2, { checkFragmentShorthand: true } ],
		'react/self-closing-comp': 2,
		'react/prefer-es6-class': 2,
		'react/prefer-stateless-function': 1,
		'react/require-render-return': 2,
		'react/no-did-mount-set-state': 2,
		'react/no-did-update-set-state': 2,
		'react/no-find-dom-node': 2,
		'react/no-is-mounted': 2,
		'react/no-string-refs': 2,
		'react-hooks/rules-of-hooks': 2,
		'react-hooks/exhaustive-deps': 1
	}
};
