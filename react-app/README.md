# FocusGold — React/TypeScript 版

## 📁 リポジトリ構成（移行後）

```
focusgold-app/（既存リポジトリ）
│
├── www/                        ← ★ HTML版（そのまま残す）
│   ├── index.html
│   └── firebase-messaging-sw.js
│
├── react-app/                  ← ★ 新React版（ここに配置）
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         TopNav, BottomNav, AuthScreen, LoadingScreen
│   │   │   ├── modals/         BookSwitcher, ProblemModal
│   │   │   └── ui/             Toast, PomodoroTimer
│   │   ├── data/               books.ts, badges.ts
│   │   ├── hooks/              useAuth.ts, useProblemState.ts, useStreak.ts
│   │   ├── pages/              TodayPage, CalendarPage, ProgressPage, MemoPage, SettingsPage
│   │   ├── store/              appStore.ts（Zustand）
│   │   ├── styles/             global.css
│   │   ├── types/              index.ts
│   │   ├── utils/              firebase.ts, sm2.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── capacitor.config.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── build-apk-html.yml  ← HTML版 APKビルド
│       └── build-apk-react.yml ← React版 APKビルド
│
├── capacitor.config.json       ← HTML版の設定（そのまま）
└── package.json                ← HTML版の設定（そのまま）
```

---

## 🚀 Codespace での環境構築手順

### STEP 1 — Codespacesを開く

GitHub リポジトリページで：
```
Code ボタン → Codespaces タブ → Create codespace on main
```
しばらく待つとブラウザ上のVSCodeが起動します。

---

### STEP 2 — React版フォルダを作成してファイルを配置

ターミナル（Ctrl+@）を開いて以下を実行：

```bash
# リポジトリのルートにいることを確認
pwd
# → /workspaces/focusgold-app  などと表示されればOK

# react-app フォルダを作成
mkdir react-app
cd react-app
```

その後、Claudeが出力した各ファイルを以下の構造で配置します：

```bash
# ディレクトリを一括作成
mkdir -p src/{components/{layout,modals,ui},data,hooks,pages,store,styles,types,utils}
mkdir -p .github/workflows
```

各ファイルをVSCodeのエクスプローラーから**新規ファイル作成 → 内容を貼り付け**してください。

---

### STEP 3 — .env ファイルを作成（Firebase設定）

```bash
# react-app/ の中で実行
cp .env.example .env
```

`.env` を開いて自分のFirebaseプロジェクトの値を入力：

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=focusgold-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=focusgold-app
VITE_FIREBASE_STORAGE_BUCKET=focusgold-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=688930...
VITE_FIREBASE_APP_ID=1:688930...
```

> **⚠️ `.env` は絶対にGitにコミットしないでください！**
> `.gitignore` に `.env` が含まれていることを確認してください。

---

### STEP 4 — 依存パッケージをインストール

```bash
# react-app/ の中で実行
npm install
```

初回は1〜2分かかります。

---

### STEP 5 — 開発サーバーを起動

```bash
npm run dev
```

Codespaces が自動的にポートを転送し、ブラウザプレビューが開きます。
（ポートタブに `5173` が表示されます → 「ブラウザで開く」をクリック）

---

### STEP 6 — ビルドテスト

```bash
npm run build
# dist/ フォルダが生成されればOK
```

---

## 📱 Capacitor（Android APK化）のセットアップ

### Capacitorをインストール

```bash
# react-app/ 内で
npm install @capacitor/core @capacitor/android @capacitor/cli

# Capacitorを初期化（すでにcapacitor.config.jsonがある場合はスキップ）
npx cap init "FocusGold" "com.focusgold.app" --web-dir dist

# Androidプラットフォームを追加
npx cap add android
```

### ローカルでAPKビルド（Codespaces上）

```bash
npm run build          # Viteでビルド
npx cap sync android   # distをandroid/に同期
cd android
./gradlew assembleDebug
# android/app/build/outputs/apk/debug/app-debug.apk が生成される
```

---

## 🔑 GitHub Secrets の設定（APK自動ビルド用）

GitHub リポジトリ → **Settings → Secrets and variables → Actions** で以下を追加：

| Secret名 | 内容 |
|----------|------|
| `KEYSTORE_BASE64` | キーストアファイルをbase64エンコードした文字列 |
| `KEYSTORE_PASSWORD` | キーストアのパスワード |
| `KEY_ALIAS` | キーのエイリアス |
| `KEY_PASSWORD` | キーのパスワード |
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

### キーストアのbase64変換コマンド

```bash
# ローカルのターミナルで実行
base64 -i focusgold.keystore | pbcopy  # macOS（クリップボードにコピー）
base64 focusgold.keystore              # Linux（コンソールに出力）
```

---

## 🔄 HTML版とReact版の使い分け

| | HTML版 | React版 |
|---|---|---|
| フォルダ | `www/` | `react-app/` |
| APK workflow | `build-apk-html.yml` | `build-apk-react.yml` |
| 状態管理 | グローバル変数 | Zustand |
| 型安全 | なし | TypeScript |
| 拡張性 | 低（1ファイル） | 高（コンポーネント分割）|

---

## ➕ 新機能を追加する方法

### 新しい画面（ページ）を追加

1. `src/pages/NewFeaturePage.tsx` を作成
2. `src/types/index.ts` に TabId を追加（例: `'newfeature'`）
3. `src/components/layout/BottomNav.tsx` にタブを追加
4. `src/App.tsx` に `<NewFeaturePage />` を追加

### 新しい教材（本）を追加

1. `src/data/books.ts` の `BOOKS` 配列に追加
2. `src/types/index.ts` の `BookId` に追加
3. `src/store/appStore.ts` の `AllBookStates` に追加

### ミニゲームを追加

`src/pages/GamePage.tsx` を新規作成して上記と同じ手順でタブに追加するだけです。
コンポーネントが完全に独立しているので他の機能に影響しません。

---

## 🐛 よくあるエラーと対処法

### `npm install` でエラーが出る
```bash
rm -rf node_modules package-lock.json
npm install
```

### `npx cap sync` でエラーが出る
```bash
npm run build  # 先にビルドしてdist/を作る
npx cap sync android
```

### Firebase認証エラー
`.env` の値が正しいか確認し、Firebase ConsoleでAuthentication → Sign-in methodを有効化してください。

### TypeScriptエラーが大量に出る
```bash
npm run build 2>&1 | head -50  # 最初のエラーだけ確認
```
