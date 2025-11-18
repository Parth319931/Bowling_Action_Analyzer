// src/pages/History.jsx
/**
 * History Page
 * ------------
 * Complete history of all user analyses
 * 
 * Features:
 * - Searchable analysis list
 * - Filter by date, status
 * - Sort options
 * - Bulk actions
 * - Pagination
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { MdSearch, MdFilterList } from 'react-icons/md';
import { mockHistoryData } from '../services/mockData';

const HistoryPage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
  max-width: 500px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const HistoryItem = styled(Card)`
  cursor: pointer;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemInfo = styled.div``;

const ItemTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  color: ${props => props.theme.colors.text.primary};
`;

const ItemSubtitle = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ItemDate = styled.div`
  color: ${props => props.theme.colors.text.secondary};
`;

const ItemResult = styled.div`
  color: ${props => props.color};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const History = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [data] = useState(mockHistoryData);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HistoryPage>
      <PageHeader>
        <PageTitle>Analysis History</PageTitle>
        <SearchBar>
          <Input
            placeholder="Search analyses..."
            icon={<MdSearch />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Button variant="outline" icon={<MdFilterList />}>
            Filter
          </Button>
        </SearchBar>
      </PageHeader>

      <HistoryList>
        {filteredData.map((item) => (
          <HistoryItem
            key={item.id}
            hoverable
            onClick={() => navigate(`/results/${item.id}`)}
          >
            <ItemInfo>
              <ItemTitle>{item.name}</ItemTitle>
              <ItemSubtitle>{item.viewType} view</ItemSubtitle>
            </ItemInfo>
            
            <ItemDate>{item.date}</ItemDate>
            
            <ItemResult color={item.elbowAngle >= 160 ? '#4CAF50' : '#F44336'}>
              Elbow: {item.elbowAngle}°
            </ItemResult>
            
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryPage>
  );
};

export default History;
