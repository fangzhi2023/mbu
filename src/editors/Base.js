import React, { useEffect } from "react"
import G6 from '@antv/g6'

import data from "../mock/data/tree.json"

function BaseEditor() {
  
    const ref = React.useRef(null);
    let graph = null;
    
    useEffect(() => {
      if (!graph) {
        graph = new G6.TreeGraph({
          container: ref.current,
          pixelRatio: 2,
          modes: {
            default: [{
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                var data = item.get('model').data;
                data.collapsed = collapsed;
                return true;
              }
          }, 'drag-canvas', 'zoom-canvas']
          },
          defaultNode: {
            size: 16,
            anchorPoints: [[0, 0.5], [1, 0.5]],
            style: {
              fill: '#40a9ff',
              stroke: '#096dd9'
            }
          },
          defaultEdge: {
            shape: 'cubic-horizontal',
            style: {
              stroke: '#A3B1BF'
            }
          },
          layout: {
            type: 'compactBox',
            direction: 'LR',
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap() {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            }
          }
        });
    
        graph.node(function(node) {
          return {
            size: 26,
            style: {
              fill: '#40a9ff',
              stroke: '#096dd9'
            },
            label: node.id,
            labelCfg: {
              position: node.children && node.children.length > 0 ? 'left' : 'right'
            }
          };
        });
    
        graph.data(data);
        graph.render();
        graph.fitView();
      }
    }, []);
    return <div ref={ref} style={{width:"100%",height:"100%"}}></div>;
}

export default BaseEditor;
