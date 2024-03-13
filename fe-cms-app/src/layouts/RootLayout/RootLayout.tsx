import { Outlet } from 'react-router-dom';
import { useRootLayout } from './hooks/useRootLayout';
import './RootLayout.scss';
import { Header } from '../../components/Header';

export default function RootLayout() {
  useRootLayout();
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
