import { useState, useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { getBook } from './data/books';
import { useAuth } from './hooks/useAuth';

import { TopNav }       from './components/layout/TopNav';
import { BottomNav }    from './components/layout/BottomNav';
import { Toast }        from './components/ui/Toast';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { AuthScreen }   from './components/layout/AuthScreen';
import { BookSwitcher } from './components/modals/BookSwitcher';

import { TodayPage }    from './pages/TodayPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProgressPage } from './pages/ProgressPage';
import { MemoPage }     from './pages/MemoPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const { currentBook, theme, currentUid } = useAppStore();
  const book = getBook(currentBook);

  const [loading,      setLoading]      = useState(true);
  const [showAuth,     setShowAuth]     = useState(false);
  const [bookSwitcher, setBookSwitcher] = useState(false);

  // 認証状態をuseAuthで管理（マウント時にonAuthStateChanged開始）
  useAuth();

  // ロード完了後にログイン済みでなければ認証画面
  const handleLoadDone = () => {
    setLoading(false);
    // currentUid が null のままなら認証画面
    if (!currentUid) setShowAuth(true);
  };

  // テーマ・教材モードを body に適用
  useEffect(() => {
    document.body.className = [
      theme === 'light' ? 'light' : '',
      book.themeMode,
    ].filter(Boolean).join(' ');
  }, [theme, book.themeMode]);

  // ログイン完了したら認証画面を閉じる
  useEffect(() => {
    if (currentUid) setShowAuth(false);
  }, [currentUid]);

  if (loading) {
    return <LoadingScreen onDone={handleLoadDone} />;
  }

  if (showAuth) {
    return <AuthScreen onSkip={() => setShowAuth(false)} />;
  }

  return (
    <>
      <TopNav onBookSwitcher={() => setBookSwitcher(true)} />

      <main>
        <TodayPage />
        <CalendarPage />
        <ProgressPage />
        <MemoPage />
        <SettingsPage />
      </main>

      <BottomNav />
      <Toast />

      {bookSwitcher && (
        <BookSwitcher
          open={bookSwitcher}
          onClose={() => setBookSwitcher(false)}
        />
      )}
    </>
  );
}
