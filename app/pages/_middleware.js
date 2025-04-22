import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Se for a página inicial, verifica se devemos redirecionar para a aplicação real
  if (pathname === '/') {
    // Redirecionar para a página principal da aplicação
    url.pathname = '/src/pages/index';
    return NextResponse.redirect(url);
  }

  // Passar as outras solicitações sem alteração
  return NextResponse.next();
}

// Configuração para aplicar o middleware a todas as rotas
export const config = {
  matcher: [
    /*
     * Match all request paths exceto:
     * 1. /api routes
     * 2. /_next (internal Next.js routes)
     * 3. /static (estáticos como favicons, etc)
     * 4. /src/pages/ (já estão no formato correto)
     */
    '/((?!api|_next|static|src/pages).*)',
  ],
}; 