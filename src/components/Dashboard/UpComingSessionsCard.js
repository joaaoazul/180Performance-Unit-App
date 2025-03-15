import React from 'react';
import styled from 'styled-components';
import { FiClock, FiChevronRight, FiUser, FiMapPin } from 'react-icons/fi';

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

const SessionsList = styled.div`
  padding: 10px;
`;

const SessionItem = styled.div`
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 3px solid ${props => props.color || '#10B981'};
  background: #F8FAFC;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SessionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #1E293B;
`;

const SessionTime = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #64748B;
  
  svg {
    margin-right: 5px;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #64748B;
  margin-top: 5px;
  
  svg {
    margin-right: 5px;
    min-width: 14px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const UpcomingSessionsCard = ({ sessions }) => {
  return (
    <CardContainer>
      <CardHeader>
        <Title>Próximas Sessões</Title>
        <ViewAll href="/calendar">
          Ver agenda <FiChevronRight />
        </ViewAll>
      </CardHeader>
      
      <SessionsList>
        {sessions.map((session, index) => (
          <SessionItem key={index} color={session.color}>
            <SessionHeader>
              <SessionTitle>{session.title}</SessionTitle>
              <SessionTime>
                <FiClock />
                {session.time}
              </SessionTime>
            </SessionHeader>
            
            <InfoContainer>
              <SessionInfo>
                <FiUser />
                {session.athlete}
              </SessionInfo>
              
              {session.location && (
                <SessionInfo>
                  <FiMapPin />
                  {session.location}
                </SessionInfo>
              )}
            </InfoContainer>
          </SessionItem>
        ))}
      </SessionsList>
    </CardContainer>
  );
};

export default UpcomingSessionsCard;