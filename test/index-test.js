const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("../lib/index").default;
// ruleName, rule, { valid, invalid }
tester.run("various-nested-pairs", rule, {
    valid: [
        {text: "text(dsa【aaaaaadf】)"},
        {text: "tex【t(dsaaaaaaadf)】"},
        {text: "text(dsa【aaaa〔dddaaaa〕aadf】)"},
        {text: "(dsa【aaaa〔dddaaaa〕aadf】)"},
        {text: `"df'ffff'das"`},
        {text: `“df‘ffff’das”`},
        {text: `“fdasdf”, “dafdsa”`},
    ],
    invalid: [
        {
            text: "text(ddd(dddd)dd)",
            errors: [
                {
                    message: "Found duplicated nested pair: (.",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            text: "te【xt（dd【d】dd）】",
            errors: [
                {
                    message: "Found duplicated nested pair: 【.",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            text: "text“dasfdf\“dsfggg\”\”",
            errors: [
                {
                    message: "Found duplicated nested pair: “.",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            text: "text'dasfdfdsfggg'",
            errors: [
                {
                    message: `Can't use ' outside ".`,
                    line: 1,
                    column: 5
                },
            ]
        },
        {
            text: `text'dasfdfdsfggg', ff'ggg'`,
            errors: [
                {
                    message: `Can't use ' outside ".`,
                    line: 1,
                    column: 5
                },
                {
                    message: `Can't use ' outside ".`,
                    line: 1,
                    column: 23
                },
            ]
        },
        {
            text: `text"dasfdfdsfggg", ff'ggg'`,
            errors: [
                {
                    message: `Can't use ' outside ".`,
                    line: 1,
                    column: 23
                },
            ]
        },
        {
            text: `text'dasfdf"dsfggg"\'`,
            errors: [
                {
                    message: `Can't use ' outside ".`,
                    line: 1,
                    column: 5
                },
                {
                    message: `Wrong order of nested pairs: " must appear outside '.`,
                    line: 1,
                    column: 12,
                }
            ]
        },
    ]
});