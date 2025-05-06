import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: var(--color-error-light);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin: var(--spacing-md) 0;
  text-align: center;
`;

const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorContainer>{children}</ErrorContainer>
);

export default ErrorMessage; 