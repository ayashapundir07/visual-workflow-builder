import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

interface ActionNodeData {
  label: string;
  type: 'action';
  actionType?: string;
  parameters?: Record<string, any>;
}

const ActionNode: React.FC<NodeProps<ActionNodeData>> = (props) => {
  return <BaseNode {...props} />;
};

export default ActionNode; 