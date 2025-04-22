// Esta é uma página catch-all que captura todas as solicitações
// e as redireciona para a pasta src/pages

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function CatchAllPage() {
  const router = useRouter();
  const { path } = router.query;

  useEffect(() => {
    if (path) {
      // Construir o caminho correto para src/pages
      const correctPath = Array.isArray(path) ? path.join('/') : path;
      router.replace(`/src/pages/${correctPath}`);
    }
  }, [path, router]);

  // Página de carregamento enquanto redireciona
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1>Carregando...</h1>
      <p>Por favor, aguarde enquanto carregamos a página correta.</p>
    </div>
  );
}

// Garantir que esta página seja renderizada no servidor
export async function getServerSideProps() {
  return {
    props: {},
  };
} 