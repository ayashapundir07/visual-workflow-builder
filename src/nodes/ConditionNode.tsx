import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';

interface ConditionNodeData {
  label: string;
  type: 'condition';
  conditionType?: string;
  condition?: string;
  truePath?: string;
  falsePath?: string;
}

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({ data }) => {
  return (
    <Paper
      sx={{
        p: 2,
        minWidth: 150,
        textAlign: 'center',
        position: 'relative',
        bgcolor: '#87ceeb',
        borderColor: '#87ceeb',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box>
        <Typography variant="subtitle1">{data.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {data.type}
        </Typography>
      </Box>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%', background: '#4caf50' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%', background: '#f44336' }}
      />
    </Paper>
  );
};

export default ConditionNode; 