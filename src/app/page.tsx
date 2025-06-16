export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pochipochi</h1>
        <p className="text-lg text-gray-600 mb-8">家計簿アプリ</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              収入管理
            </h2>
            <p className="text-gray-600">月々の収入を記録・管理</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              支出記録
            </h2>
            <p className="text-gray-600">日々の支出を簡単に記録</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              分析・レポート
            </h2>
            <p className="text-gray-600">支出パターンを分析</p>
          </div>
        </div>

        <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
          はじめる
        </button>
      </div>
    </main>
  );
}
