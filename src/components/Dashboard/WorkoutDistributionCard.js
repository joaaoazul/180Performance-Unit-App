import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 100%;
`;

const CardHeader = styled.div`
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const ChartContainer = styled.div`
  height: 250px;
`;

const CustomLabel = styled.div`
  font-size: 14px;
  color: #1E293B;
  display: flex;
  align-items: center;
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: 8px;
`;

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const CustomTooltip = styled.div`
  background: #1E293B;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
`;

const TooltipColor = styled.span`
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: 6px;
`;

const WorkoutDistributionCard = ({ data }) => {
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0];
      return (
        <CustomTooltip>
          <TooltipItem>
            <TooltipColor color={payload[0].color} />
            {name}: {value} ({(percent * 100).toFixed(0)}%)
          </TooltipItem>
        </CustomTooltip>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Distribuição de Treinos</CardTitle>
      </CardHeader>
      
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right" 
              formatter={(value, entry) => (
                <CustomLabel>
                  <ColorDot color={entry.color} />
                  {value}
                </CustomLabel>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContainer>
  );
};

export default WorkoutDistributionCard;
