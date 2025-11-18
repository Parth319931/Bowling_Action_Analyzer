import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    font-size: ${props => props.theme.typography.fontSize.base};
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.default};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${props => props.theme.typography.fontSize['4xl']};
  }

  h2 {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
  }

  h3 {
    font-size: ${props => props.theme.typography.fontSize['2xl']};
  }

  h4 {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }

  a {
    color: ${props => props.theme.colors.primary.main};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.primary.dark};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.neutral[400]};
    border-radius: ${props => props.theme.borderRadius.full};

    &:hover {
      background: ${props => props.theme.colors.neutral[500]};
    }
  }
`;
