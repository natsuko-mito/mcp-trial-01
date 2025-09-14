# MCP Trial 01 - おみくじアプリ

## 開発について

このプロジェクトは、2025年09月のSoftware Design特集記事「AI開発が加速 MCPでどう変わる？」をtrialしたものです。
MCP（Model Context Protocol）を活用した開発体験の実験として取り組んでおり、開発およびテストにはClaude CodeのAIアシスタント機能を利用しています。

## 概要

日本の伝統的なおみくじをモチーフにしたWebアプリケーション

## 運勢の種類

- 大吉 - 最高の運勢
- 吉 - 良い運勢
- 中吉 - まずまずの運勢
- 小吉 - 小さな幸運
- 凶 - 注意が必要
- 大凶 - 特に注意が必要

## セットアップ

### 前提条件

- Node.js (v16以上)
- npm

### インストール

```bash
# リポジトリをクローン
git clone git@github.com.private:natsuko-mito/mcp-trial-01.git
cd mcp-trial-01

# 依存関係をインストール
npm install
```

### 実行

`index.html`をブラウザで直接開く

## テスト

このプロジェクトには包括的なE2Eテストが含まれています。

```bash
# すべてのテストを実行
npm test

# ブラウザを表示してテスト実行
npm run test:headed

# テストレポートを表示
npm run test:report
```

### テスト内容

- 初期状態の表示確認
- おみくじを引く機能のテスト
- ローディング状態の確認
- 結果表示の検証
- リセット機能のテスト
- 複数回実行のテスト
- CSS スタイリングの確認
- 高速クリックの処理
- アクセシビリティのテスト
- レスポンシブデザインのテスト

## プロジェクト構造

```
mcp-trial-01/
├── index.html          # メインのHTMLファイル
├── script.js           # JavaScriptロジック
├── style.css           # CSSスタイル
├── package.json        # プロジェクト設定
├── playwright.config.js # Playwriteの設定
├── tests/
│   └── omikuji.spec.js # E2Eテストファイル
└── .claude/
    └── commands/       # Claude Code設定
```

