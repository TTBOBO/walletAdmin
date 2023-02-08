module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/standard",
        "@vue/typescript/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        // parser: "@babel/eslint-parser",
        parser: "@typescript-eslint/parser"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-multiple-empty-lines": [
            "error", {
                max: 1,
                maxBOF: 0
            }
        ], // 配置最大允许空行 1行
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "prefer-rest-params": "off",
        "camelcase": "off",
        "no-unused-vars": "off",
        "no-trailing-spaces": "off", // 行尾空格实际某些空行也会报错
        "padded-blocks": "off", // 不设定块内填充的一致性
        "prefer-const": "off", // 开发阶段无法完全确认某些变量是否真的不被更改
        "no-undef": "off", // 解决无法识别 BigInt 的问题
        "no-useless-return": "off",
        indent: [
            "error", 4, {
                SwitchCase: 1
            }
        ], // 缩进
        quotes: [
            "error", "double", {
                avoidEscape: false, // 禁止字符串可选引号类型
                allowTemplateLiterals: true // 允许字符串反撇号
            }
        ], // 引号设置
        semi: ["error", "always"], // 时候以分号结尾
        "jsx-quotes": ["error", "prefer-double"],
        "vue/html-quotes": ["error", "double", { avoidEscape: false }],
        "vue/no-unused-components": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",
        "vue/comment-directive": "off"
    }
};
