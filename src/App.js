import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import WorkflowCanvas from './components/WorkflowCanvas';
import Sidebar from './components/Sidebar';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactFlowProvider>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <WorkflowCanvas />
          </main>
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
