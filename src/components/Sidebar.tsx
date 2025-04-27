import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { DragEvent } from 'react';

// Define available node types and their properties
const nodeTypes = [
  { type: 'action', label: 'Action', color: '#4caf50' }, // Green
  { type: 'condition', label: 'Condition', color: '#2196f3' }, // Blue
];

// Sidebar component for displaying draggable node types
const Sidebar: React.FC = () => {
  // Handle drag start event for node types
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    // Set the data to be transferred during drag
    event.dataTransfer.setData('application/reactflow', nodeType);
    // Set the drag effect to 'move'
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper
      sx={{
        width: 250,
        height: '100%',
        p: 2,
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Node Types
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Render each node type as a draggable box */}
        {nodeTypes.map((node) => (
          <Box
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: node.color,
              cursor: 'grab',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography variant="body1">{node.label}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Sidebar; 