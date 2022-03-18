import React, { useEffect } from "react"
import G6 from '@antv/g6'
import { mix } from '@antv/util';

function SetEditor(props) {

  const { id, data } = props

  
  const ref = React.useRef(null);
    
  useEffect(() => {
    renderGraph(ref.current)(data)
  }, [])

  return <div ref={ref} style={{width:"100%",height:"100%"}}></div>;
}

export default SetEditor;

function renderGraph(container) {
  const minimap = new G6.Minimap()
  const toolbar = new G6.ToolBar({
    getContent: () => {
      return `<ul>
          <li code='locate' title='定位'>
            <i aria-label="图标: environment" class="anticon anticon-environment"><svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path></svg></i>
          </li>
          <li code='zoomOut' title='放大'>
            <i aria-label="图标: zoom-in" class="anticon anticon-zoom-in"><svg viewBox="64 64 896 896" data-icon="zoom-in" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path></svg></i></li>
          <li code='zoomIn' title='缩小'>
            <i aria-label="图标: zoom-out" class="anticon anticon-zoom-out"><svg viewBox="64 64 896 896" data-icon="zoom-out" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path></svg></i>
          </li>
          <li code='autoZoom' title='恢复'>
            <i aria-label="图标: pic-center" class="anticon anticon-pic-center"><svg viewBox="64 64 896 896" data-icon="pic-center" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M952 792H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-632H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM848 660c8.8 0 16-7.2 16-16V380c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h672zM232 436h560v152H232V436z"></path></svg></i>
          </li>
        </ul>`
    },  
    handleClick: (code, graph) => {
      if (code === 'locate') {
        // 定位到激活节点
        return
      }
      toolbar.handleDefaultOperator(code, graph)
    }
  })
  return data => {
    const colorArr = [
      '#5B8FF9',
      '#5AD8A6',
      '#5D7092',
      '#F6BD16',
      '#6F5EF9',
      '#6DC8EC',
      '#D3EEF9',
      '#DECFEA',
      '#FFE0C7',
      '#1E9493',
      '#BBDEDE',
      '#FF99C3',
      '#FFE0ED',
      '#CDDDFD',
      '#CDF3E4',
      '#CED4DE',
      '#FCEBB9',
      '#D3CEFD',
      '#945FB9',
      '#FF9845',
    ];

    G6.registerNode(
      'dice-mind-map-root', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 16)[0] + 24;
          const stroke = cfg.style.stroke || '#096dd9';
          const fill = cfg.style.fill;

          return `
          <group>
            <rect draggable="true" style={{width: ${width}, height: 42, stroke: ${stroke}, radius: 4}} keyshape>
              <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>${cfg.label}</text>
              <text style={{ marginLeft: ${
                width - 16
              }, marginTop: -20, stroke: '#66ccff', fill: '#000', cursor: 'pointer', opacity: ${
            cfg.hover ? 0.75 : 0
          } }} action="add">+</text>
            </rect>
          </group>
        `;
        },
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ];
        },
      },
      'single-node',
    );
    G6.registerNode(
      'dice-mind-map-sub', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 14)[0] + 24;
          const color = cfg.color || cfg.style.stroke;

          return `
          <group>
            <rect draggable="true" style={{width: ${width + 24}, height: 22}} keyshape>
              <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>${
                cfg.label
              }</text>
              <text style={{ marginLeft: ${
                width - 8
              }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
            cfg.hover ? 0.75 : 0
          }, next: 'inline' }} action="add">+</text>
              <text style={{ marginLeft: ${
                width - 4
              }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
            cfg.hover ? 0.75 : 0
          }, next: 'inline' }} action="delete">-</text>
            </rect>
            <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 22 }} />
            
          </group>
        `;
        },
        getAnchorPoints() {
          return [
            [0, 0.965],
            [1, 0.965],
          ];
        },
      },
      'single-node',
    );
    G6.registerNode(
      'dice-mind-map-leaf', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 12)[0] + 24;
          const color = cfg.color || cfg.style.stroke;

          return `
          <group>
            <rect draggable="true" style={{width: ${width + 20}, height: 26, fill: 'transparent' }}>
              <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6 }}>${cfg.label}</text>
                  <text style={{ marginLeft: ${
                    width - 8
                  }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
            cfg.hover ? 0.75 : 0
          }, next: 'inline' }} action="add">+</text>
                  <text style={{ marginLeft: ${
                    width - 4
                  }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
            cfg.hover ? 0.75 : 0
          }, next: 'inline' }} action="delete">-</text>
            </rect>
            <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 32 }} />
            
          </group>
        `;
        },
        getAnchorPoints() {
          return [
            [0, 0.965],
            [1, 0.965],
          ];
        },
      },
      'single-node',
    );
    G6.registerBehavior('dice-mindmap', {
      getEvents() {
        return {
          'node:click': 'clickNode',
          'node:dblclick': 'editNode',
          'node:mouseenter': 'hoverNode',
          'node:mouseleave': 'hoverNodeOut',
        };
      },
      clickNode(evt) {
        const model = evt.item.get('model');
        const name = evt.target.get('action');
        switch (name) {
          case 'add':
            const newId =
              model.id +
              '-' +
              (((model.children || []).reduce((a, b) => {
                  const num = Number(b.id.split('-').pop());
                  return a < num ? num : a;
                }, 0) || 0) +
                1);
            evt.currentTarget.updateItem(evt.item, {
              children: (model.children || []).concat([{
                id: newId,
                direction: newId.charCodeAt(newId.length - 1) % 2 === 0 ? 'right' : 'left',
                label: 'New',
                type: 'dice-mind-map-leaf',
                color: model.color || colorArr[Math.floor(Math.random() * colorArr.length)],
              }, ]),
            });
            evt.currentTarget.layout(false);
            break;
          case 'delete':
            const parent = evt.item.get('parent');
            evt.currentTarget.updateItem(parent, {
              children: (parent.get('model').children || []).filter((e) => e.id !== model.id),
            });
            evt.currentTarget.layout(false);
            break;
          case 'edit':
            break;
          default:
            return;
        }
      },
      editNode(evt) {
        const item = evt.item;
        const model = item.get('model');
        const {
          x,
          y
        } = item.calculateBBox();
        const graph = evt.currentTarget;
        const realPosition = evt.currentTarget.getClientByPoint(x, y);
        const el = document.createElement('div');
        const fontSizeMap = {
          'dice-mind-map-root': 24,
          'dice-mind-map-sub': 18,
          'dice-mind-map-leaf': 16,
        };
        el.style.fontSize = fontSizeMap[model.type] + 'px';
        el.style.position = 'fixed';
        el.style.top = realPosition.y + 'px';
        el.style.left = realPosition.x + 'px';
        el.style.paddingLeft = '12px';
        el.style.transformOrigin = 'top left';
        el.style.transform = `scale(${evt.currentTarget.getZoom()})`;
        const input = document.createElement('input');
        input.style.border = 'none';
        input.value = model.label;
        input.style.width = G6.Util.getTextSize(model.label, fontSizeMap[model.type])[0] + 'px';
        input.className = 'dice-input';
        el.className = 'dice-input';
        el.appendChild(input);
        document.body.appendChild(el);
        const destroyEl = () => {
          document.body.removeChild(el);
        };
        const clickEvt = (event) => {
          if (!(event.target && event.target.className && event.target.className.includes('dice-input'))) {
            window.removeEventListener('mousedown', clickEvt);
            window.removeEventListener('scroll', clickEvt);
            graph.updateItem(item, {
              label: input.value,
            });
            graph.layout(false);
            graph.off('wheelZoom', clickEvt);
            destroyEl();
          }
        };
        graph.on('wheelZoom', clickEvt);
        window.addEventListener('mousedown', clickEvt);
        window.addEventListener('scroll', clickEvt);
        input.addEventListener('keyup', (event) => {
          if (event.key === 'Enter') {
            clickEvt({
              target: {},
            });
          }
        });
      },
      hoverNode(evt) {
        evt.currentTarget.updateItem(evt.item, {
          hover: true,
        });
      },
      hoverNodeOut(evt) {
        evt.currentTarget.updateItem(evt.item, {
          hover: false,
        });
      },
    });
    G6.registerBehavior('scroll-canvas', {
      getEvents: function getEvents() {
        return {
          wheel: 'onWheel',
        };
      },

      onWheel: function onWheel(ev) {
        const {
          graph
        } = this;
        if (!graph) {
          return;
        }
        if (ev.ctrlKey) {
          const canvas = graph.get('canvas');
          const point = canvas.getPointByClient(ev.clientX, ev.clientY);
          let ratio = graph.getZoom();
          if (ev.wheelDelta > 0) {
            ratio += ratio * 0.05;
          } else {
            ratio *= ratio * 0.05;
          }
          graph.zoomTo(ratio, {
            x: point.x,
            y: point.y,
          });
        } else {
          const x = ev.deltaX || ev.movementX;
          const y = ev.deltaY || ev.movementY || (-ev.wheelDelta * 125) / 3;
          graph.translate(-x, -y);
        }
        ev.preventDefault();
      },
    });

    const dataTransform = (data) => {
      const changeData = (d, level = 0, color) => {
        const data = {
          ...d,
        };
        switch (level) {
          case 0:
            data.type = 'dice-mind-map-root';
            break;
          case 1:
            data.type = 'dice-mind-map-sub';
            break;
          default:
            data.type = 'dice-mind-map-leaf';
            break;
        }

        data.hover = false;

        if (color) {
          data.color = color;
        }

        if (level === 1 && !d.direction) {
          if (!d.direction) {
            data.direction = d.id.charCodeAt(d.id.length - 1) % 2 === 0 ? 'right' : 'left';
          }
        }

        if (d.children) {
          data.children = d.children.map((child) => changeData(child, level + 1, data.color));
        }
        return data;
      };
      return changeData(data);
    };

    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const tree = new G6.TreeGraph({
      container,
      width,
      height,
      fitView: true,
      plugins: [ minimap, toolbar ],
      fitViewPadding: [10, 20],
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16;
        },
        getWidth: (node) => {
          return node.level === 0 ?
            G6.Util.getTextSize(node.label, 16)[0] + 12 :
            G6.Util.getTextSize(node.label, 12)[0];
        },
        getVGap: () => {
          return 10;
        },
        getHGap: () => {
          return 60;
        },
        getSide: (node) => {
          return node.data.direction;
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          lineWidth: 2,
        },
      },
      minZoom: 0.5,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'dice-mindmap'],
      },
    });

    tree.data(dataTransform(data));

    tree.render();
  }
}
