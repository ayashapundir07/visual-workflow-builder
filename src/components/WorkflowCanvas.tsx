import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  ReactFlowInstance,
  MarkerType,
  EdgeTypes,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Paper, TextField, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWorkflowStore } from '../store/workflowStore';
import { nodeTypes } from '../nodes/nodeRegistry';

// Initial nodes configuration - starts with a trigger node
const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { label: 'Trigger', type: 'trigger' },
  },
];

const initialEdges: Edge[] = [];

// Default styling for edges (connections between nodes)
const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#1a192b',
  },
  style: {
    strokeWidth: 2,
    stroke: '#1a192b',
  },
};

// Custom edge component with delete functionality
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, selected }: any) => {
  const [showDelete, setShowDelete] = useState(false);
  const { setEdges } = useReactFlow();

  // Show delete button when edge is clicked
  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setShowDelete(true);
  };

  // Delete edge when delete button is clicked
  const onDeleteClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((eds) => eds.filter((e) => e.id !== id));
    setShowDelete(false);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={`M ${sourceX} ${sourceY} C ${sourceX + (targetX - sourceX) / 2} ${sourceY} ${sourceX + (targetX - sourceX) / 2} ${targetY} ${targetX} ${targetY}`}
        markerEnd={markerEnd}
        onClick={onEdgeClick}
      />
      {showDelete && (
        <foreignObject
          x={(sourceX + targetX) / 2 - 12}
          y={(sourceY + targetY) / 2 - 12}
          width={24}
          height={24}
          style={{ overflow: 'visible' }}
        >
          <IconButton
            size="small"
            color="error"
            onClick={onDeleteClick}
            sx={{
              bgcolor: 'white',
              '&:hover': { bgcolor: 'white' },
              boxShadow: 1,
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </foreignObject>
      )}
    </>
  );
};

// Register custom edge type
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Main WorkflowCanvas component
const WorkflowCanvas: React.FC = () => {
  // Refs and state management
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { saveWorkflow, loadWorkflow } = useWorkflowStore();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        ...defaultEdgeOptions,
        id: `edge-${Date.now()}`,
        type: 'custom',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle drag over events
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping new nodes
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node`, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Save workflow to JSON file
  const handleSave = () => {
    const workflowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        markerEnd: edge.markerEnd,
        style: edge.style,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      }
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load workflow from JSON file
  const handleLoad = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection and loading
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflowData = JSON.parse(e.target?.result as string);
          if (workflowData.nodes && workflowData.edges) {
            setNodes(workflowData.nodes);
            setEdges(workflowData.edges.map((edge: Edge) => ({
              ...edge,
              ...defaultEdgeOptions,
              type: 'custom',
            })));
          }
        } catch (error) {
          console.error('Error parsing workflow file:', error);
          alert('Invalid workflow file format');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle node selection
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  // Handle node name changes
  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      const updatedNodes = nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: event.target.value } }
          : node
      );
      setNodes(updatedNodes);
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: event.target.value } });
    }
  };

  // Handle node deletion
  const handleDeleteNode = () => {
    if (selectedNode) {
      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      // Remove connected edges
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      // Clear selection
      setSelectedNode(null);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ flex: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleLoad}>
              Load
            </Button>
          </Panel>
        </ReactFlow>
      </div>
      {/* Node configuration panel */}
      {selectedNode && (
        <Paper
          sx={{
            width: 300,
            p: 2,
            borderLeft: '1px solid #e0e0e0',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Node
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Node Name"
              value={selectedNode.data.label}
              onChange={handleNodeNameChange}
              fullWidth
            />
            {/* Hide delete button for trigger nodes */}
            {selectedNode.type !== 'trigger' && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteNode}
                sx={{ mt: 2 }}
              >
                Delete Node
              </Button>
            )}
          </Box>
        </Paper>
      )}
      {/* Hidden file input for loading workflows */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default WorkflowCanvas; 