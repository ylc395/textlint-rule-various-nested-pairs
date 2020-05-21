# textlint-rule-various-nested-pairs
textlint rule to check duplicated nested pairs and nested pairs with wrong order.

检测是否正确地嵌套了不同的括号、引号等，包括是否重复嵌套，是否按指定顺序嵌套。

## 安装 Install

Install with [npm](https://www.npmjs.com/):

```
npm install textlint-rule-textlint-rule-various-nested-pairs
```

## 使用 Usage

Via `.textlintrc`(Recommended)

在`.textlintrc`中添加（推荐）

```json
{
  "rules": {
    "textlint-rule-various-nested-pairs": true
  }
}
```

Via CLI

通过命令行调用

```
textlint --rule textlint-rule-various-nested-pairs README.md
```

### 选项 Options

#### `pairs`
可配置`pairs`选项，列举需要检查是否重复嵌套的 pairs。

Use this option to list all pairs that need to be checked if nested duplicated.

```json
{
  "rules": {
    "various-nested-pairs": {
      //  默认配置 default option
      "pairs": ["()", "（）", "[]", "【】", "〔〕"]
    }
  }
}
```

examples:
```
text(word word (word)) // NG
text(word word 〔ffff〕) // good
```

#### `orderedPairs`
可配置`orderedPairs`选项，列举需要检查是否重复嵌套以及按一定顺序嵌套的 pairs.

Use this option to list all pairs that need to be checked if nested duplicated and with right order.

```json
{
  "rules": {
    "various-nested-pairs": {
      //  默认配置 default option
      "orderPairs": [["\"\"", "''"], ["“”", "‘’"], ["「」", "『』"]]
    }
  }
}
```
examples:

```
'Hello world', He said // NG
"Hello world", He said // good

'"Hello world" is the first lesson', He said // ng
"'Hello world' is the first lesson", He said // good
```

#### `ignoredHtmlTags`
搭配[textlint-plugin-html](https://github.com/textlint/textlint-plugin-html)使用时，可以配置`ignoredHtmlTags`选项，它是一个数组，表示忽略哪些 HTML 标签内的内容。默认为`["code", "pre"]`。

When using with [textlint-plugin-html](https://github.com/textlint/textlint-plugin-html), add this option to ignore contents of some tags. Default Value is `["code", "pre"]`.


## 开发 Development
### Build

Builds source codes for publish to the `lib` folder. You can write ES2015+ source codes in `src/`
folder.

    npm run build

### Tests

Run test code in `test` folder. Test textlint rule by
[textlint-tester](https://github.com/textlint/textlint-tester "textlint-tester").

    npm test

## License

MIT © chenyulu
