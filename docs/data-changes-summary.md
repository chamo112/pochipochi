# データ設計変更サマリー

## 変更概要
夫婦で共通の家計簿・予算管理を行うという要件に基づき、データ設計を以下のように修正しました。

## 主な変更点

### 1. 予算管理の変更
**変更前（個人別予算）**：
```sql
CREATE TABLE budgets (
  user_id UUID REFERENCES users(id), -- 個人別
  ...
);
```

**変更後（家庭共通予算）**：
```sql
CREATE TABLE budgets (
  household_id UUID REFERENCES households(id), -- 家庭単位
  ...
);
```

### 2. 支出記録の役割明確化
- **user_id を維持**：誰が登録したかを記録
- **用途**：不明な支出があった際の詳細確認用
- **表示ポリシー**：
  - メイン画面・レポート：登録者名は非表示
  - 支出詳細画面：登録者名を表示

### 3. ER図の更新
```
Budgets (予算)
├── N:1 → Households (世帯)    ← user_id から変更
├── N:1 → Categories (カテゴリ)
└── N:1 → SubCategories (サブカテゴリ)
```

### 4. インデックスの修正
```sql
-- 変更前
CREATE INDEX idx_budgets_user_period ON budgets(user_id, budget_year, budget_month);

-- 変更後  
CREATE INDEX idx_budgets_household_period ON budgets(household_id, budget_year, budget_month);
```

## 実装への影響

### UI設計
- **予算設定画面**：家庭全体の予算設定のみ
- **レポート画面**：家庭全体の合計表示
- **支出詳細画面**：登録者名の表示追加

### API設計
- **予算API**：household_id での予算管理
- **支出API**：user_id は維持（詳細確認用）
- **レポートAPI**：世帯単位での集計処理

## ユースケース例

### 支出確認フロー
1. **支出一覧で発見**：「1/20 その他 ¥3,000 (メモなし)」
2. **詳細画面で確認**：「登録者：田中花子」
3. **直接確認**：「これ何だっけ？」と質問可能

### 予算管理フロー
1. **家庭予算設定**：「食費 月30,000円」
2. **支出登録**：田中太郎が15,000円、田中花子が12,000円登録
3. **予算確認**：「食費 27,000円/30,000円 (残り3,000円)」

## 将来拡張への対応
- **多世帯対応**：household_id により他世帯と完全分離
- **権限管理**：世帯内でのユーザー権限設定
- **個人予算機能**：将来的に個人別予算も追加可能な設計