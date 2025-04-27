import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  saveWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }) => void;
  loadWorkflow: () => { nodes: Node[]; edges: Edge[] } | null;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  saveWorkflow: (workflow) => {
    localStorage.setItem('workflow', JSON.stringify(workflow));
    set({ nodes: workflow.nodes, edges: workflow.edges });
  },
  loadWorkflow: () => {
    const savedWorkflow = localStorage.getItem('workflow');
    if (savedWorkflow) {
      const workflow = JSON.parse(savedWorkflow);
      set({ nodes: workflow.nodes, edges: workflow.edges });
      return workflow;
    }
    return null;
  },
})); 