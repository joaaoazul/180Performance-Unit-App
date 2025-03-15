import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, #10B981 0%, #047857 100%);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Quote = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 10px;
  line-height: 1.4;
`;

const Author = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
`;

const MotivationCard = ({ quote, author }) => {
  return (
    <CardContainer>
      <CardOverlay>
        <Quote>"{quote}"</Quote>
        <Author>— {author}</Author>
      </CardOverlay>
    </CardContainer>
  );
};

export default MotivationCard;