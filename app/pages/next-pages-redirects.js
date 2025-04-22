// Este arquivo ajuda a redirecionar para páginas dinâmicas no formato src/pages/

import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Função para lidar com redirecionamentos
export default function NextPagesRedirect() {
  const router = useRouter();
  const { path } = router.query;

  useEffect(() => {
    if (path) {
      // Redirecionar para a página correta em src/pages
      const correctPath = Array.isArray(path) ? path.join('/') : path;
      router.replace(`/src/pages/${correctPath}`);
    } else {
      // Se não houver um caminho, redirecionar para a página inicial
      router.replace('/src/pages/index');
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
      <h1>Redirecionando...</h1>
      <p>Por favor, aguarde enquanto redirecionamos você para a página correta.</p>
    </div>
  );
}

// Adicione getServerSideProps para garantir que esta página sempre seja renderizada no servidor
export async function getServerSideProps() {
  return {
    props: {},
  };
} 