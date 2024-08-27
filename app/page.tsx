import dynamic from 'next/dynamic';

const MainMenu = dynamic(() => import('./components/MainMenu'), { ssr: false });

export default function Home() {
  return <MainMenu />;
}
