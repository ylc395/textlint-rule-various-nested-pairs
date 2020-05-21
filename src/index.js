import {RuleHelper} from 'textlint-rule-helper';
const DEFAULT_PAIRS = ['()', '（）', '[]', '【】', '〔〕'];
const DEFAULT_ORDERED_PAIRS = [['""', "''"], ['“”', '‘’'], ['「」', '『』']];
const DEFAULT_IGNORED_HTML_TAGS = ['code', 'pre'];

function checkNestedPairs(pairs, text, ordered = false) {
    const stack = [];
    const errors = [];
    const pairMap = pairs.reduce((map, [leftPart, rightPart]) => (map[rightPart] = leftPart, map), {});
    const leftParts = pairs.map(([leftPart]) => leftPart);

    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        const isMatched = pairMap.hasOwnProperty(char) && stack.length > 0 && stack[stack.length - 1].char === pairMap[char];

        if (isMatched) {
            stack.pop();
            continue;
        }

        if (leftParts.includes(char)) {
            const priorityOfChar = leftParts.indexOf(char);
            const priorChar = stack.find(({priority}) => priority >= priorityOfChar);

            if (priorChar) {
                let msg;

                if (priorChar.priority === priorityOfChar) {
                    msg = `Found duplicated nested pair: ${char}.`;
                } else if (ordered) {
                    msg = `Wrong order of nested pairs: ${char} must appear outside ${priorChar.char}.`;
                }

                if (msg) {
                    errors.push({index, msg});
                }
            }

            if (ordered && stack.length === 0 && priorityOfChar > 0) {
                errors.push({index, msg: `Can't use ${char} outside ${leftParts[priorityOfChar - 1]}.`})
            }

            stack.push({char, priority: priorityOfChar});
        }
    }

    return errors;
}

function checkOrderedNestedPairs(pairGroups, text) {
    return pairGroups.flatMap(pairs => checkNestedPairs(pairs, text, true));
}

export default function reporter(context, options = {}) {
    const {Syntax, RuleError, report, getSource} = context;
    const helper = new RuleHelper(context);

    const validPairs = options.pairs || DEFAULT_PAIRS;
    const validOrderedPairs = options.orderedPairs || DEFAULT_ORDERED_PAIRS;
    const ignoredHtmlTags = options.ignoredHtmlTags || DEFAULT_IGNORED_HTML_TAGS;

    return {
        [Syntax.Str](node){
            const shouldSkip = helper.getParents(node).some(node => node.tagName && ignoredHtmlTags.includes(node.tagName));
            if (shouldSkip) {
                return;
            }
            const text = getSource(node);
            const errorIndexes = [
                ...checkNestedPairs(validPairs, text),
                ...checkOrderedNestedPairs(validOrderedPairs, text),
            ];

            errorIndexes.forEach(({index, msg}) => {
                report(node, new RuleError(msg, {index}));
            });
        }
    };
}