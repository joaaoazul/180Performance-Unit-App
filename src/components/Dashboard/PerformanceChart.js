import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-top: 20px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
  background: ${props => props.active ? '#10B981' : 'white'};
  color: ${props => props.active ? 'white' : '#64748B'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0D9668' : '#F8FAFC'};
  }
`;

const CustomTooltip = styled.div`
  background: #1E293B;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
`;

const TooltipLabel = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #E2E8F0;
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  font-size: 12px;
`;

const TooltipColor = styled.span`
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: 6px;
`;

const TooltipValue = styled.span`
  color: white;
  font-weight: 500;
`;

const PerformanceChart = ({ data }) => {
  const [filter, setFilter] = React.useState('month');
  
  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <TooltipLabel>{label}</TooltipLabel>
          {payload.map((item, index) => (
            <TooltipItem key={index}>
              <TooltipColor color={item.color} />
              {item.name}: <TooltipValue>{item.value}</TooltipValue>
            </TooltipItem>
          ))}
        </CustomTooltip>
      );
    }
    return null;
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Performance dos Atletas</ChartTitle>
        <FilterContainer>
          <FilterButton 
            active={filter === 'week'} 
            onClick={() => setFilter('week')}
          >
            Semana
          </FilterButton>
          <FilterButton 
            active={filter === 'month'} 
            onClick={() => setFilter('month')}
          >
            Mês
          </FilterButton>
          <FilterButton 
            active={filter === 'year'} 
            onClick={() => setFilter('year')}
          >
            Ano
          </FilterButton>
        </FilterContainer>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748B" 
            fontSize={12} 
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis 
            stroke="#64748B" 
            fontSize={12} 
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <Tooltip content={renderCustomTooltip} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="attendance" 
            name="Presença" 
            stroke="#10B981" 
            activeDot={{ r: 6 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="performance" 
            name="Performance" 
            stroke="#3B82F6" 
            activeDot={{ r: 6 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="satisfaction" 
            name="Satisfação" 
            stroke="#F59E0B" 
            activeDot={{ r: 6 }} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PerformanceChart;