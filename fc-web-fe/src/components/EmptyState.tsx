import React from 'react';
import styled from 'styled-components';
import { FaCoffee, FaLeaf, FaWarehouse, FaCalendarAlt } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-gray-600);
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-gray-400);
`;

const Message = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
`;

const iconMap = {
  coffee: FaCoffee,
  leaf: FaLeaf,
  warehouse: FaWarehouse,
  calendar: FaCalendarAlt
};

export const EmptyContainer = Container;
export const EmptyMessage = Message;

export const EmptyIcon: React.FC<{ name: keyof typeof iconMap }> = ({ name }) => {
  const IconComponent = iconMap[name];
  return (
    <IconWrapper>
      <IconComponent />
    </IconWrapper>
  );
}; 