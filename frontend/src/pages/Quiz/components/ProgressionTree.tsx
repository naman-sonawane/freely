import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface ProgressionTreeProps {
  onNodeClick: (nodeName: string) => void;
}

const containerStyles = {
  width: '100%',
  height: '100vh',
};

const renderCustomNode = ({ nodeDatum, onNodeClick }: any) => {
  const textLength = nodeDatum.name.length * 8;
  const boxWidth = textLength + 20;

  return (
    <g onClick={() => onNodeClick(nodeDatum.name)}>
      <rect
        width={boxWidth}
        height="40"
        x={-boxWidth / 2}
        y="-20"
        fill="#f0f0f0"
        stroke="#333"
        strokeWidth="1.5"
        rx="5"
        ry="5"
      />
      <text fill="black" strokeWidth="0.5" x="0" y="5" textAnchor="middle">
        {nodeDatum.name}
      </text>
    </g>
  );
};

const ProgressionTree: React.FC<ProgressionTreeProps> = ({ onNodeClick }) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [subject, setSubject] = useState('');
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const dimensions = document.getElementById('treeWrapper')?.getBoundingClientRect();
    if (dimensions) {
      setTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 4,
      });
    }
  }, []);

  const handleCurateTree = async () => {
    console.log('Curate Progression Tree for:', subject);
    try {
      const prompt = `
        Create a progression tree for the topic "${subject}". Each node should represent a concept and include its children concepts. 
        Provide the data in the following JSON format and only output the json:
        [
          {
            "name": "Root Node",
            "children": [
              {
                "name": "Child Node 1",
                "children": [
                  {"name": "Grandchild Node 1"},
                  {"name": "Grandchild Node 2"}
                ]
              },
              {"name": "Child Node 2"}
            ]
          }
        ]
      `;

      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/upload', { prompt });
      const rawTreeData = response.data.description;
      const jsonString = rawTreeData.replace(/```json\n|\n```/g, '').trim();
      const parsedTreeData = JSON.parse(jsonString);

      setTreeData(parsedTreeData);
    } catch (error) {
      console.error('Error generating progression tree:', error);
    }
  };

  return (
    <div id="treeWrapper" style={containerStyles}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            width: '80%',
          }}
        >
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject..."
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              width: '80%',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
          <button
            onClick={handleCurateTree}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Curate
          </button>
        </div>
      </div>

      {treeData.length > 0 && (
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          zoomable={true}
          zoom={0.7}
          renderCustomNodeElement={(rd3tProps) =>
            renderCustomNode({ ...rd3tProps, onNodeClick })
          }
          nodeSize={{ x: 200, y: 100 }}
        />
      )}
    </div>
  );
};

export default ProgressionTree;
