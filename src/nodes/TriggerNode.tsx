import React from 'react';
import { NodeProps } from 'reactflow';
import BaseNode from './BaseNode';

interface TriggerNodeData {
  label: string;
  type: 'trigger';
  triggerType?: string;
}

const TriggerNode: React.FC<NodeProps<TriggerNodeData>> = (props) => {
  return <BaseNode {...props} />;
};

export default TriggerNode; 