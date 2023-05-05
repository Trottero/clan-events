/* eslint-disable */

module.exports = {
  extends: [
    "./node_modules/gts/",
    'plugin:@angular-eslint/base',
    'plugin:@angular-eslint/template/process-inline-templates'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['tsconfig.app.json']
  },
  rules: {
    // ==================================================================================================================================
    // ESLint base rules: Possible logic errors
    // ==================================================================================================================================
    'array-callback-return': ['warn', { 'checkForEach': true }],
    // 'constructor-super': 'warn', // Already handled by TypeScript.
    // 'for-direction': 'warn', // Heuristics can lead to false positives, e.g.: `for (let x = 0; x < 10; x -= 1-2) {}`
    // 'getter-return': 'warn', // Already handled by TypeScript.
    'no-async-promise-executor': 'warn',
    'no-await-in-loop': 'warn',
    'no-class-assign': 'warn',
    'no-compare-neg-zero': 'warn',
    'no-cond-assign': 'warn',
    // 'no-const-assign': 'warn', // Already handled by TypeScript.
    'no-constant-binary-expression': 'warn',
    'no-constant-condition': 'warn',
    'no-constructor-return': 'warn',
    'no-control-regex': 'warn',
    'no-debugger': 'warn',
    // 'no-dupe-args': 'warn', // Already handled by TypeScript.
    // 'no-dupe-class-members': 'warn', // Already handled by TypeScript.
    'no-dupe-else-if': 'warn',
    // 'no-dupe-keys': 'warn', // Already handled by TypeScript.
    'no-duplicate-case': 'warn',
    // 'no-duplicate-imports': 'warn', // Use @typescript-eslint/no-duplicate-imports instead.
    'no-empty-character-class': 'warn',
    'no-empty-pattern': 'warn',
    'no-ex-assign': 'warn',
    'no-fallthrough': 'warn',
    // 'no-func-assign': 'warn', // Already handled by TypeScript.
    // 'no-import-assign': 'warn', // Already handled by TypeScript.
    'no-inner-declarations': 'warn',
    'no-invalid-regexp': 'warn',
    'no-irregular-whitespace': ['warn', { 'skipStrings': false }],
    // 'no-loss-of-precision': 'warn', // Use @typescript-eslint/no-loss-of-precision instead.
    'no-misleading-character-class': 'warn',
    // 'no-new-symbol': 'warn', // Already handled by TypeScript.
    // 'no-obj-calls': 'warn', // Already handled by TypeScript.
    'no-promise-executor-return': 'warn',
    'no-prototype-builtins': 'warn',
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    // 'no-setter-return': 'warn', // Already handled by TypeScript.
    'no-sparse-arrays': 'warn',
    'no-template-curly-in-string': 'warn',
    // 'no-this-before-super': 'warn', // Already handled by TypeScript.
    // 'no-undef': 'warn', // Already handled by TypeScript.
    // 'no-unexpected-multiline': 'warn', // Already handled by TypeScript.
    'no-unmodified-loop-condition': 'warn',
    'no-unreachable': 'warn',
    'no-unreachable-loop': 'warn',
    'no-unsafe-finally': 'warn',
    // 'no-unsafe-negation': 'warn', // Already handled by TypeScript.
    // 'no-unsafe-optional-chaining': 'warn', // Already handled by TypeScript.
    'no-unused-private-class-members': 'warn',
    // 'no-unused-vars': 'warn', // Results in false positives for overloaded function signatures.
    // 'no-use-before-define': 'warn' // Not always desirable, e.g. when you write higher abstractions first followed by lower levels.
    'no-useless-backreference': 'warn',
    'require-atomic-updates': 'warn',
    'use-isnan': ['warn', { 'enforceForIndexOf': true }],
    // 'valid-typeof': 'warn', // Already handled by TypeScript.

    // ==================================================================================================================================
    // ESLint base rules: Suggestions
    // ==================================================================================================================================
    'arrow-body-style': ['warn', 'as-needed'],
    'camelcase': 'warn',
    'complexity': ['warn', 20],
    'curly': 'warn',
    'default-case-last': 'warn',
    // 'dot-notation': 'warn', // Use @typescript-eslint/dot-notation instead.
    'eqeqeq': 'warn',
    'grouped-accessor-pairs': ['warn', 'getBeforeSet'],
    'guard-for-in': 'warn',
    'max-classes-per-file': ['warn', { 'ignoreExpressions': true, 'max': 2 }],
    'max-depth': ['warn', 4],
    // 'no-array-constructor': 'warn', // Use @typescript-eslint/no-array-constructor instead.
    'no-bitwise': ['warn', { 'int32Hint': true }],
    'no-caller': 'warn',
    'no-case-declarations': 'warn',
    'no-console': 'warn',
    'no-else-return': 'warn',
    'no-empty': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',
    // 'no-extra-semi': 'warn', // Use @typescript-eslint/no-extra-semi instead.
    // 'no-implied-eval': 'warn', // Use @typescript-eslint/no-implied-eval instead.
    'no-iterator': 'warn',
    'no-labels': 'warn',
    'no-lone-blocks': 'warn',
    'no-lonely-if': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-wrappers': 'warn',
    'no-octal': 'warn',
    'no-octal-escape': 'warn',
    'no-param-reassign': 'warn',
    'no-proto': 'warn',
    'no-return-assign': 'warn',
    // 'no-return-await': 'warn', // Use @typescript-eslint/return-await instead.
    'no-sequences': 'warn',
    // 'no-shadow': 'warn', // Use @typescript-eslint/no-shadow instead.
    'no-shadow-restricted-names': 'warn',
    // 'no-throw-literal': 'warn', // Use @typescript-eslint/no-throw-literal instead.
    'no-undef-init': 'warn',
    'no-unneeded-ternary': 'warn',
    // 'no-unused-expressions': 'warn', // Use @typescript-eslint/no-unused-expressions instead.
    'no-useless-call': 'warn',
    'no-useless-catch': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    // 'no-useless-constructor': 'warn', // Used @typescript-eslint/no-useless-constructor instead.
    'no-useless-escape': 'warn',
    'no-useless-rename': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'warn',
    'no-void': 'warn',
    'no-with': 'warn',
    'object-shorthand': 'warn',
    'one-var': ['warn', 'never'],
    'prefer-const': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'prefer-numeric-literals': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-regex-literals': 'warn',
    'prefer-spread': 'warn',
    'prefer-template': 'warn',
    'quote-props': ['warn', 'as-needed'],
    // 'require-await': 'warn', // Use @typescript-eslint/require-await instead.
    'require-yield': 'warn',
    'sort-imports': ['warn', { 'ignoreDeclarationSort': true }],
    'spaced-comment': ['warn', 'always', { 'exceptions': ['*'] }],


    // ==================================================================================================================================
    // ESLint base rules: Layout & Formatting
    // ==================================================================================================================================
    'array-bracket-spacing': 'warn',
    'array-element-newline': ['warn', 'consistent'],
    // 'arrow-parens': 'warn',
    'arrow-spacing': 'warn',
    'block-spacing': 'warn',
    // 'brace-style': 'warn', // Use @typescript-eslint/brace-style instead
    // 'comma-dangle': ['warn', 'always-multiline'], // Use @typescript-eslint/comma-dangle instead
    // 'comma-spacing': 'warn', // Use @typescript-eslint/comma-spacing instead
    'comma-style': 'warn',
    'computed-property-spacing': 'warn',
    'dot-location': ['warn', 'property'],
    'eol-last': 'warn',
    // 'func-call-spacing': 'warn', // Use @typescript-eslint/func-call-spacing instead
    'function-call-argument-newline': ['warn', 'consistent'],
    'generator-star-spacing': ['warn', { 'before': false, 'after': true }],
    // 'indent': ['warn', 2], // Broken for TypeScript, see https://github.com/typescript-eslint/typescript-eslint/issues/1824
    'key-spacing': 'warn',
    // 'keyword-spacing': 'warn', // Use @typescript-eslint/keyword-spacing instead
    'linebreak-style': 'warn',
    'max-len': ['warn', { 'code': 140, 'ignoreTemplateLiterals': true, 'ignoreRegExpLiterals': true }],
    'max-statements-per-line': ['warn', { 'max': 2 }],
    'new-parens': 'warn',
    'no-multi-spaces': 'warn',
    'no-multiple-empty-lines': ['warn', { 'max': 1, 'maxBOF': 0, 'maxEOF': 0 }],
    'no-tabs': 'warn',
    'no-trailing-spaces': 'warn',
    'no-whitespace-before-property': 'warn',
    'object-curly-newline': ['warn', { 'consistent': true }],
    // 'object-curly-spacing': ['warn', 'always', { 'objectsInObjects': false }], // Use @typescript-eslint/object-curly-spacing instead.
    // 'padding-line-between-statements': [
    //   'warn',
    //   { 'blankLine': 'always', 'prev': '*', 'next': 'return' }
    // ], // Use @typescript-eslint/padding-line-between-statements instead.
    // 'quotes': ['warn', 'single'], // Use @typescript-eslint/quotes instead.
    'rest-spread-spacing': 'warn',
    // 'semi': 'warn', // Use @typescript-eslint/semi instead.
    'semi-spacing': 'warn',
    // 'space-before-blocks': 'warn', // Use @typescript-eslint/space-before-blocks instead.
    // 'space-before-function-paren': ['warn', {
    //   'anonymous': 'never',
    //   'named': 'never',
    //   'asyncArrow': 'always'
    // }], // Use @typescript-eslint/space-before-function-paren instead.
    'space-in-parens': 'warn',
    // 'space-infix-ops': ['warn', { 'int32Hint': true }], // Use @typescript-eslint/space-infix-ops instead.
    'space-unary-ops': 'warn',
    'switch-colon-spacing': 'warn',
    'template-curly-spacing': 'warn',
    'template-tag-spacing': 'warn',
    'yield-star-spacing': 'warn',

    // ==================================================================================================================================
    // TypeScript ESLint
    // ==================================================================================================================================
    '@typescript-eslint/adjacent-overload-signatures': 'warn',
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/await-thenable': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-tslint-comment': 'warn',
    '@typescript-eslint/brace-style': ['warn', '1tbs', { 'allowSingleLine': true }],
    // '@typescript-eslint/comma-dangle': ['warn', 'always-multiline'],
    '@typescript-eslint/comma-spacing': 'warn',
    '@typescript-eslint/consistent-generic-constructors': 'warn',
    '@typescript-eslint/consistent-type-assertions': ['warn', { 'assertionStyle': 'as', 'objectLiteralTypeAssertions': 'allow-as-parameter' }],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/default-param-last': ['warn'],
    '@typescript-eslint/dot-notation': 'warn',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      'allowExpressions': true,
      'allowTypedFunctionExpressions': true,
      'allowHigherOrderFunctions': true
    }],
    '@typescript-eslint/explicit-member-accessibility': ['warn', {
      'accessibility': 'explicit',
      'overrides': {
        'constructors': 'no-public',
        'methods': 'no-public',
        'properties': 'no-public',
        'accessors': 'no-public',
        'parameterProperties': 'no-public'
      }
    }],
    '@typescript-eslint/func-call-spacing': 'warn',
    '@typescript-eslint/keyword-spacing': 'warn',
    '@typescript-eslint/member-delimiter-style': 'warn',
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        'default': [
          'private-static-field',
          'protected-static-field',
          'public-static-field',
          'private-instance-field',
          'protected-instance-field',
          'public-instance-field',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
          'public-static-method',
          'protected-static-method',
          'private-static-method'
        ]
      }
    ],
    '@typescript-eslint/method-signature-style': ['warn', 'method'],
    '@typescript-eslint/naming-convention': ['warn',
      {
        'selector': ['class', 'interface', 'typeAlias', 'enum', 'typeParameter'],
        'format': ['PascalCase'],
        'leadingUnderscore': 'forbid',
        'trailingUnderscore': 'forbid'
      },
      {
        'selector': ['variable'],
        'format': ['UPPER_CASE'],
        'leadingUnderscore': 'forbid',
        'trailingUnderscore': 'forbid',
        'modifiers': ['const', 'global']
      },
      {
        'selector': ['parameter'],
        'format': ['camelCase'],
        'leadingUnderscore': 'allow',
        'trailingUnderscore': 'forbid'
      }
    ],
    '@typescript-eslint/no-array-constructor': 'warn',
    '@typescript-eslint/no-duplicate-enum-values': 'warn',
    '@typescript-eslint/no-duplicate-imports': 'warn',
    '@typescript-eslint/no-dynamic-delete': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-extra-non-null-assertion': 'warn',
    '@typescript-eslint/no-extra-semi': 'warn',
    '@typescript-eslint/no-extraneous-class': ['warn', { 'allowWithDecorator': true }],
    '@typescript-eslint/no-for-in-array': 'warn',
    '@typescript-eslint/no-implied-eval': 'warn',
    '@typescript-eslint/no-invalid-void-type': 'warn',
    '@typescript-eslint/no-loss-of-precision': 'warn',
    '@typescript-eslint/no-misused-new': 'warn',
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-redundant-type-constituents': 'warn',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-throw-literal': 'warn',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/no-useless-empty-export': 'warn',
    '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
    '@typescript-eslint/object-curly-spacing': ['warn', 'always'],
    '@typescript-eslint/padding-line-between-statements': [
      'warn',
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' }
    ],
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
    '@typescript-eslint/quotes': ['warn', 'single'],
    '@typescript-eslint/require-array-sort-compare': ['warn', { 'ignoreStringArrays': true }],
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/return-await': 'warn',
    '@typescript-eslint/semi': 'warn',
    '@typescript-eslint/space-before-blocks': 'warn',
    '@typescript-eslint/space-before-function-paren': ['warn', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    '@typescript-eslint/space-infix-ops': ['warn', { 'int32Hint': true }],
    '@typescript-eslint/triple-slash-reference': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/unbound-method': ['warn', { 'ignoreStatic': true }],

    // ==================================================================================================================================
    // Angular ESLint
    // ==================================================================================================================================
    '@angular-eslint/component-class-suffix': 'warn',
    '@angular-eslint/component-selector': [
      'warn',
      {
        'type': 'element',
        'prefix': 'app',
        'style': 'kebab-case'
      }
    ],
    '@angular-eslint/contextual-decorator': 'warn',
    '@angular-eslint/contextual-lifecycle': 'warn',
    '@angular-eslint/directive-class-suffix': 'warn',
    '@angular-eslint/directive-selector': [
      'warn',
      {
        'type': 'attribute',
        'prefix': 'app',
        'style': 'camelCase'
      }
    ],
    '@angular-eslint/no-attribute-decorator': 'warn',
    '@angular-eslint/no-empty-lifecycle-method': 'warn',
    '@angular-eslint/no-host-metadata-property': 'warn',
    '@angular-eslint/no-input-rename': 'warn',
    '@angular-eslint/no-inputs-metadata-property': 'warn',
    '@angular-eslint/no-lifecycle-call': 'warn',
    '@angular-eslint/no-output-native': 'warn',
    '@angular-eslint/no-output-on-prefix': 'warn',
    '@angular-eslint/no-output-rename': 'warn',
    '@angular-eslint/no-pipe-impure': 'warn',
    '@angular-eslint/no-queries-metadata-property': 'warn',
    '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
    '@angular-eslint/prefer-output-readonly': 'warn',
    '@angular-eslint/relative-url-prefix': 'warn',
    '@angular-eslint/use-component-selector': 'warn',
    '@angular-eslint/use-component-view-encapsulation': 'warn',
    '@angular-eslint/use-lifecycle-interface': 'warn',
    '@angular-eslint/use-pipe-transform-interface': 'warn',

    // ==================================================================================================================================
    // ESLint Prettier
    // ==================================================================================================================================
    'prettier/prettier': [
      'warn',
      {
        'bracketSpacing': true,
      }
    ],
  }
};
