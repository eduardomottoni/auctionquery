import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  user-select: none;

  // Sizes
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.lg};
        `;
      case 'md':
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.md};
        `;
    }
  }}

  // Variants
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.buttonPrimaryText};
          border-color: ${theme.colors.secondary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.buttonPrimaryText};
            border-color: ${theme.colors.primary};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.textLight};
          }
        `;
        case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: transparent;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.border};
          }
        `;
      case 'primary':
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.buttonPrimaryText};
          border-color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
            border-color: ${theme.colors.secondary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Button; 