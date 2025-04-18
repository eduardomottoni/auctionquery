import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: ${({ theme }) => theme.typography.lineHeight.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #__next {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export default GlobalStyles; 