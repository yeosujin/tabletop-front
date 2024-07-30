import React from 'react';
import { useRouteError } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: #ff4136;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <ErrorContainer>
      <ErrorTitle>앗! 문제가 발생했습니다.</ErrorTitle>
      <ErrorMessage>
        {error.statusText || error.message || '알 수 없는 오류가 발생했습니다.'}
      </ErrorMessage>
      <ErrorMessage>
        이 문제가 계속되면 관리자에게 문의해주세요.
      </ErrorMessage>
    </ErrorContainer>
  );
}

export default ErrorBoundary;