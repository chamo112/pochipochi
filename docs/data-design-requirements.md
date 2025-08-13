# データ設計要件定義書

## 1. データベース設計概要

### 1.1 設計方針
- **正規化**：第3正規形まで適用
- **パフォーマンス**：インデックス設計による高速検索
- **拡張性**：将来的な機能追加に対応
- **整合性**：外部キー制約による関連性保証
- **セキュリティ**：個人情報の適切な保護

### 1.2 技術選択
- **データベース**：PostgreSQL（Supabase）
- **ORM**：Prisma
- **認証**：Supabase Auth
- **ファイルストレージ**：Supabase Storage

## 2. エンティティ関係図（ER図）

```
Users (ユーザー)
├── 1:N → Expenses (支出)
├── 1:N → Budgets (予算)
└── 1:N → UserSettings (ユーザー設定)

Households (世帯)
├── 1:N → Users (ユーザー)
├── 1:N → Categories (カテゴリ)
└── 1:N → HouseholdSettings (世帯設定)

Categories (カテゴリ)
├── 1:N → SubCategories (サブカテゴリ)
└── 1:N → Expenses (支出)

SubCategories (サブカテゴリ)
└── 1:N → Expenses (支出)

Expenses (支出)
├── N:1 → Users (ユーザー)
├── N:1 → Categories (カテゴリ)
├── N:1 → SubCategories (サブカテゴリ)
└── 1:N → ExpenseAttachments (添付ファイル)

Budgets (予算)
├── N:1 → Households (世帯)
├── N:1 → Categories (カテゴリ)
└── N:1 → SubCategories (サブカテゴリ)
```

## 3. テーブル設計詳細

### 3.1 households（世帯）
```sql
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**説明**：夫婦の世帯を管理するマスターテーブル

### 3.2 users（ユーザー）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**説明**：夫婦それぞれのユーザー情報

### 3.3 categories（カテゴリ）
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(50) DEFAULT 'folder',
  color VARCHAR(7) DEFAULT '#4CAF50',
  sort_order INTEGER DEFAULT 0,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(household_id, name)
);
```

**説明**：支出のメインカテゴリ（食費、娯楽など）

### 3.4 sub_categories（サブカテゴリ）
```sql
CREATE TABLE sub_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(category_id, name)
);
```

**説明**：カテゴリの詳細分類（外食、食材、旅行、遊びなど）

### 3.5 expenses（支出）
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  sub_category_id UUID REFERENCES sub_categories(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  memo TEXT,
  payment_method VARCHAR(20) DEFAULT 'credit' CHECK (payment_method IN ('cash', 'credit', 'debit', 'electronic')),
  source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'api')),
  external_id VARCHAR(100), -- クレカ連携時の外部ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_expenses_user_date (user_id, expense_date),
  INDEX idx_expenses_category (category_id),
  INDEX idx_expenses_date (expense_date)
);
```

**説明**：支出の詳細記録（user_idで登録者を記録、不明な支出の詳細確認時に使用）

### 3.6 budgets（予算）
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  sub_category_id UUID REFERENCES sub_categories(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  budget_year INTEGER NOT NULL,
  budget_month INTEGER NOT NULL CHECK (budget_month BETWEEN 1 AND 12),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(household_id, category_id, sub_category_id, budget_year, budget_month)
);
```

**説明**：家庭全体の月次・カテゴリ別予算設定

### 3.7 expense_attachments（支出添付ファイル）
```sql
CREATE TABLE expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**説明**：レシート画像などの添付ファイル（将来拡張用）

### 3.8 household_settings（世帯設定）
```sql
CREATE TABLE household_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  setting_key VARCHAR(50) NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(household_id, setting_key)
);
```

**説明**：世帯レベルの設定（通貨、通知設定など）

### 3.9 import_logs（インポートログ）
```sql
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL,
  file_name VARCHAR(255),
  total_records INTEGER DEFAULT 0,
  success_records INTEGER DEFAULT 0,
  error_records INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**説明**：クレジットカードデータインポートの履歴管理

## 4. データバリデーション要件

### 4.1 必須項目
- **expenses.amount**：正の数値のみ
- **expenses.expense_date**：未来日付は警告表示
- **categories.name**：世帯内でユニーク
- **budgets.amount**：正の数値のみ

### 4.2 データ形式
- **金額**：DECIMAL(10,2) - 最大99,999,999.99円
- **日付**：DATE型、ISO 8601形式
- **文字列**：UTF-8エンコーディング

### 4.3 制約条件
- **カテゴリ削除**：関連支出が存在する場合は論理削除
- **ユーザー削除**：関連データのカスケード削除
- **予算重複**：同一期間・カテゴリの重複予算は不可

## 5. インデックス設計

### 5.1 パフォーマンス重視インデックス
```sql
-- 支出検索の高速化
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date DESC);
CREATE INDEX idx_expenses_category_date ON expenses(category_id, expense_date DESC);
CREATE INDEX idx_expenses_amount ON expenses(amount);

-- カテゴリ検索の高速化
CREATE INDEX idx_categories_household ON categories(household_id, sort_order);
CREATE INDEX idx_subcategories_category ON sub_categories(category_id, sort_order);

-- 予算検索の高速化
CREATE INDEX idx_budgets_household_period ON budgets(household_id, budget_year, budget_month);
```

## 6. データフロー設計

### 6.1 支出登録フロー
```
[ユーザー入力] 
→ [バリデーション] 
→ [データベース保存] 
→ [リアルタイム同期] 
→ [予算チェック] 
→ [通知処理]
```

### 6.2 クレジットカードインポートフロー
```
[ファイルアップロード] 
→ [形式チェック] 
→ [データパース] 
→ [重複チェック] 
→ [カテゴリ自動分類] 
→ [ユーザー確認] 
→ [一括登録]
```

### 6.3 レポート生成フロー
```
[期間・条件指定] 
→ [データ集計クエリ] 
→ [キャッシュチェック] 
→ [グラフデータ生成] 
→ [フロントエンド表示]
```

## 7. セキュリティ要件

### 7.1 アクセス制御
- **Row Level Security（RLS）**：世帯データの完全分離
- **ユーザー認証**：Supabase Auth による JWT認証
- **権限管理**：世帯管理者と一般メンバーの権限分離

### 7.2 データ暗号化
- **保存時暗号化**：Supabaseの標準暗号化
- **通信暗号化**：HTTPS/TLS 1.3
- **個人情報**：機密度の高いデータは追加暗号化

### 7.3 監査ログ
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  table_name VARCHAR(50) NOT NULL,
  operation VARCHAR(10) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 8. パフォーマンス最適化

### 8.1 クエリ最適化
- **支出一覧**：日付範囲での効率的な検索
- **集計処理**：月次集計の事前計算
- **レポート**：頻繁なクエリのマテリアライズドビュー

### 8.2 キャッシュ戦略
- **アプリケーションレベル**：カテゴリマスタのメモリキャッシュ
- **データベースレベル**：月次集計データのキャッシュ
- **CDN**：静的リソース（アイコン、画像）のキャッシュ

## 9. バックアップ・復旧

### 9.1 バックアップ戦略
- **自動バックアップ**：Supabaseの日次自動バックアップ
- **リテンション**：30日間の保持期間
- **地理的冗長**：複数リージョンでの保存

### 9.2 災害復旧
- **RTO（目標復旧時間）**：4時間以内
- **RPO（目標復旧時点）**：24時間以内
- **復旧手順**：段階的復旧プロセスの文書化

## 10. 初期データ設計

### 10.1 マスターデータ
```sql
-- デフォルトカテゴリ
INSERT INTO categories (name, icon, color, is_system) VALUES
('食費', 'restaurant', '#4CAF50', true),
('娯楽', 'entertainment', '#FF9800', true),
('交通費', 'directions_car', '#2196F3', true),
('光熱費', 'electrical_services', '#9C27B0', true);

-- デフォルトサブカテゴリ
INSERT INTO sub_categories (category_id, name) VALUES
((SELECT id FROM categories WHERE name = '食費'), '外食'),
((SELECT id FROM categories WHERE name = '食費'), '食材'),
((SELECT id FROM categories WHERE name = '娯楽'), '旅行'),
((SELECT id FROM categories WHERE name = '娯楽'), '遊び');
```

### 10.2 設定デフォルト値
- **通貨**：JPY（日本円）
- **開始曜日**：月曜日
- **通知**：予算超過時のみ有効
- **データ保持期間**：無制限（ユーザー削除まで）