const RULES = {
	OFF: "off",
	WARN: "warn",
	ERROR: "error",
};

module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["plugin:react/recommended", "airbnb", "prettier"],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react"],
	rules: {
		"react/react-in-jsx-scope": RULES.OFF,
		"react/prop-types": RULES.OFF,
		"react/jsx-filename-extension": RULES.OFF,
		"jsx-a11y/click-events-have-key-events": RULES.OFF,
		"jsx-a11y/no-noninteractive-element-interactions": RULES.OFF,
		"jsx-a11y/label-has-associated-control": RULES.OFF,
		"jsx-a11y/control-has-associated-label": RULES.OFF,
		"import/no-extraneous-dependencies": RULES.OFF,
		"react/jsx-props-no-spreading": RULES.OFF,
		"import/no-unresolved": RULES.OFF,
	},
};
