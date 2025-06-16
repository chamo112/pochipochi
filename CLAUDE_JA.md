# CLAUDE_JA.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを日本語で提供します。

## プロジェクト概要

「pochipochi」（ポチポチ）は日本の家計簿・支出管理アプリケーションです。現在、プロジェクトは初期セットアップ段階で、まだソースコードは実装されていません。

## 現在の状態

リポジトリは基本設定で初期化されています：

- Git リポジトリのセットアップ完了
- Node.js スタイルの .gitignore 設定済み
- IntelliJ IDEA プロジェクトファイル存在
- Claude Code 用設定を .gitignore に追加済み
- Node.js バージョン管理用の mise 設定完了

## 開発セットアップ

### 前提条件

- [mise](https://mise.jdx.dev/) が Node.js バージョン管理のためにインストールされている必要があります

### セットアップコマンド

1. `mise install` - .mise.toml で指定された Node.js 22.16.0 をインストール
2. `node --version` - Node.js のインストールを確認

### 将来のビルドコマンド

技術スタックが確定した後、Node.js/Web プロジェクトの典型的なコマンドは以下の通りです：

- `npm install` または `yarn install` - 依存関係のインストール（package.json 作成後）
- `npm run dev` または `yarn dev` - 開発サーバーの起動（設定後）
- `npm run build` または `yarn build` - 本番用ビルド（設定後）
- `npm test` または `yarn test` - テストの実行（設定後）

## プロジェクトのコンテキスト

アプリケーション名「pochipochi」（ポチポチ）は、クリックやタップ音を表す日本語のオノマトペです。ボタンのクリックやデータ入力の際によく使われる表現で、ユーザーが頻繁に支出を入力する家計簿アプリにふさわしい名前です。
