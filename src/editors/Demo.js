import React, { useEffect } from "react"
import G6 from '@antv/g6'

function DemoEditor() {
    const data = {
        // 点集
        nodes: [
          {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
          },
          {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
          },
        ],
        // 边集
        edges: [
          {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
          },
        ],
      };
    
    const ref = React.useRef(null);
    let graph = null;
    
    useEffect(() => {
      if (!graph) {
        graph = new G6.Graph({
          container: ref.current,
          width: 1200,
          height: 800,
          modes: {
            default: ['drag-canvas'],
          },
          layout: {
            type: 'dagre',
            direction: 'LR',
          },
          defaultNode: {
            type: 'node',
            labelCfg: {
              style: {
                fill: '#0000A6',
                fontSize: 10,
              },
            },
            style: {
              stroke: '#72CC4A',
              width: 150,
            },
          },
        });
      }
      graph.data(data);
      graph.render();
    }, []);
    return <div ref={ref}></div>;
}

export default DemoEditor;
