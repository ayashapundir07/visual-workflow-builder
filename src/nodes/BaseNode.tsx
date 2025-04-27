import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';

interface BaseNodeData {
  label: string;
  type: 'trigger' | 'action' | 'condition';
}

const BaseNode: React.FC<NodeProps<BaseNodeData>> = ({ data }) => {
  return (
    <Paper
      sx={{
        p: 2,
        minWidth: 150,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box>
        <Typography variant="subtitle1">{data.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {data.type}
        </Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
};

export default memo(BaseNode); 