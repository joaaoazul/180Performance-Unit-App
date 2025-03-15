import React from 'react';
import styled from 'styled-components';
import { FiChevronRight, FiFlag } from 'react-icons/fi';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
`;

const ViewAll = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #10B981;
  text-decoration: none;
  
  svg {
    margin-left: 5px;
  }
`;

const AthletesList = styled.div`
  padding: 0;
`;

const AthleteItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #F8FAFC;
  }
`;

const AthleteImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E2E8F0;
  margin-right: 15px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GoalBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => props.achieved ? '#10B981' : '#F59E0B'};
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 8px;
`;

const AthleteInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AthleteName = styled.h4`
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 500;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: #F1F5F9;
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: ${props => {
    if (props.value >= 75) return '#10B981';
    if (props.value >= 50) return '#10B981';
    if (props.value >= 25) return '#F59E0B';
    return '#EF4444';
  }};
  width: ${props => props.value}%;
`;

const ProgressLabel = styled.span`
  font-size: 12px;
  color: #64748B;
  margin-left: 10px;
  white-space: nowrap;
`;

const AthleteProgressCard = ({ athletes }) => {
  return (
    <CardContainer>
      <CardHeader>
        <Title>Progresso dos Atletas</Title>
        <ViewAll href="/athletes">
          Ver todos <FiChevronRight />
        </ViewAll>
      </CardHeader>
      
      <AthletesList>
        {athletes.map((athlete, index) => (
          <AthleteItem key={index}>
            <AthleteImage>
              {athlete.image ? <img src={athlete.image} alt={athlete.name} /> : null}
              <GoalBadge achieved={athlete.goalProgress >= 80}>
                <FiFlag />
              </GoalBadge>
            </AthleteImage>
            
            <AthleteInfo>
              <AthleteName>{athlete.name}</AthleteName>
              <ProgressContainer>
                <ProgressBar>
                  <Progress value={athlete.goalProgress} />
                </ProgressBar>
                <ProgressLabel>{athlete.goalProgress}%</ProgressLabel>
              </ProgressContainer>
            </AthleteInfo>
          </AthleteItem>
        ))}
      </AthletesList>
    </CardContainer>
  );
};

export default AthleteProgressCard;