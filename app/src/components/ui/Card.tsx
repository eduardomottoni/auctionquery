import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export default Card; 