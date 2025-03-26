import styled from 'styled-components';

export const Container = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

export const Title = styled.h1`
    color: var(--text-primary);
    margin-bottom: 2rem;
    font-size: 1.75rem;
`;

export const FilterContainer = styled.div`
    background-color: var(--background-secondary);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const Label = styled.label`
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
`;

export const Select = styled.select`
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    
    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }
`;

export const Input = styled.input`
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    
    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-end;
`;

interface ButtonProps {
    variant?: 'primary' | 'secondary';
}

export const Button = styled.button<ButtonProps>`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 120px;
    
    background-color: ${props => props.variant === 'secondary' 
        ? 'var(--background-secondary)' 
        : 'var(--primary-color)'};
    color: ${props => props.variant === 'secondary' 
        ? 'var(--text-primary)' 
        : 'var(--text-on-primary)'};
    
    &:hover {
        background-color: ${props => props.variant === 'secondary' 
            ? 'var(--background-hover)' 
            : 'var(--primary-hover)'};
    }
`;

export const ResultsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
`;

export const ResultCard = styled.div`
    background-color: var(--background-secondary);
    border-radius: 8px;
    overflow: hidden;
`;

export const ResultHeader = styled.div`
    background-color: var(--primary-color);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
        color: var(--text-on-primary);
        margin: 0;
        font-size: 1rem;
    }
    
    span {
        color: var(--text-on-primary);
        font-size: 0.875rem;
    }
`;

export const ResultContent = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const ResultItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
`;

export const Value = styled.span`
    color: var(--text-primary);
    font-weight: 500;
`;

export const NoDataMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-size: 1rem;
`;

export const LoadingMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    font-size: 1rem;
`; 