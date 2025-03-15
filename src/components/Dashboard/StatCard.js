import React from 'react';
import styled from 'styled-components';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
`;

const IconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${props => props.bg || '#EFF6FF'};
  color: ${props => props.color || '#3B82F6'};
`;

const ValueContainer = styled.div`
  margin-top: auto;
`;

const Value = styled.h2`
  margin: 0 0 5px;
  font-size: 28px;
  font-weight: 600;
  color: #1E293B;
`;

const Trend = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.positive ? '#10B981' : '#EF4444'};
`;

const TrendIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const TrendLabel = styled.span`
  color: #64748B;
  margin-left: 5px;
`;

const StatCard = ({ title, value, trend, percentChange, icon: Icon, color, bgColor }) => {
  const isPositive = percentChange >= 0;
  
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <IconBox bg={bgColor} color={color}>
          <Icon />
        </IconBox>
      </CardHeader>
      
      <ValueContainer>
        <Value>{value}</Value>
        <Trend positive={isPositive}>
          <TrendIcon>
            {isPositive ? <FiArrowUp /> : <FiArrowDown />}
          </TrendIcon>
          {Math.abs(percentChange)}%
          <TrendLabel>{trend}</TrendLabel>
        </Trend>
      </ValueContainer>
    </CardContainer>
  );
};

export default StatCard;