import styled from 'styled-components';

const Card = styled.div`

  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 16px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
  
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 14px;
  color: #555;
`;

const BoardCard = () => (
  <Card>
    <Title>Start Your Project</Title>
    <Text>
      Before starting your project, it's essential to create a board to visualize and track all tasks and milestones. This helps organize the workflow and ensures effective collaboration.
    </Text>
  </Card>
);

export default BoardCard;
