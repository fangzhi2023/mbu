import React, { useEffect,useState } from "react"
import G6 from '@antv/g6'
import eventBus from "../utils/event-bus"
import { fittingString } from "../utils/string"
import BaseEditor from "./Base"
import { debounce } from "lodash"

function GraphMapEditor(props) {

  const { id, editing, data } = props

  const d = {
    ... data
  }

  const ref = React.useRef(null);

  const [renderFun, setRenderFun] = useState(null)

  let [graph, setGraph] = useState(null)
  useEffect(() => {
    const fun = renderGraph(ref.current)
    setGraph(fun(d, editing))
    setRenderFun(() => fun)
  }, [])
    
  useEffect(() => {
    // 首次渲染不执行
    if (renderFun) {
      setGraph(renderFun(d, editing))
    }
  }, [id, editing])

  const checkChanged = () => {
    return graph && graph.isChange
  }
  const onSaveSuccess = () => {
    graph.isChange = false
  }

  const getData = () => {
    const data = graph.save()
    const transformData = node => {
      const d = {
        id: node.id,
        info: node.info,
        config: node.config,
        data: node.data,
        x: node.x,
        y: node.y
      }
      if (node.children) {
        d.children = node.children.map(n => transformData(n))
      }
      return d
    }
    return transformData(data)
  }

  return <BaseEditor id={id} editing={editing} checkChanged={checkChanged} onSaveSuccess={onSaveSuccess} getData={getData}>
    <div ref={ref} style={{width:"100%",height:"100%"}}></div>
  </BaseEditor>
}

export default GraphMapEditor;

function renderGraph(container){
  
    // 全局变量
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    let filterKey = "acquired" // 过滤key
    let nodeMap = {} // 结点map

    function calculOpacity(config, data) {
      let value = config.value 
      if (filterKey && data && data[filterKey]) value = data[filterKey]
      if (value < 40) value = 40
      if (value > 100) value = 100
      return value * 0.01
    }
    function initNodeParams() {
      const params  = {}
      params.x = width / 2 + 300 * (Math.random());
      params.y = height / 2 + 300 * (Math.random() - 0.5);
      return params
    }
    function generateNode() {
      return {
        id: Date.now() + "",
        info: {
          name: "新增结点",
          description: ""
        },
        config: {
          value: 90,
          color: "grey",
          backgroundColor: "#e3e3e3",
        },
        data: {}
      }
    }
    function translateNodeParams(node, level) {

      switch (level) {
        case 0:
          node.type = 'mind-map-root';
          break;
        case 1:
          node.type = 'mind-map-sub';
          break;
        default:
          if (level) {
            node.type = 'mind-map-leaf';
          }
          break;
      }

      return {
        ...node,
        level,
        label: fittingString(node.info.name, 10),
        size: node.config.size,
        labelCfg: {
          style: {
            fill: node.config.color,
          }
        },
        style: {
          opacity: calculOpacity(node.config, node.data),
          fill: node.config.backgroundColor,
          stroke: node.config.backgroundColor
        },
        stateStyles: {
          highlight: {
            opacity: 1,
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor,
            shadowColor: node.config.backgroundColor,
          },
          active: {
            opacity: 1,
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor,
            shadowColor: node.config.backgroundColor
          },
          selected: {
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor,
            shadowColor: node.config.backgroundColor,
          },
          disable: {
            opacity: .1,
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor
          },
          disabled: {
            opacity: .1,
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor
          },
          inactive: {
            opacity: .1,
            fill: node.config.backgroundColor,
            stroke: node.config.backgroundColor
          },
        }
      }
    }
    function translateEdgeParams(edge) {
      const sourceNode = nodeMap[edge.source]
      return {
        ...edge,
        style: {
          stroke: sourceNode.config.backgroundColor
        }
      }
    }

    // 组件
    const toolbar = new G6.ToolBar({
      getContent: () => {
        return `<ul>
            <li code='zoomOut' title='放大'>
              <i aria-label="图标: zoom-in" class="anticon anticon-zoom-in"><svg viewBox="64 64 896 896" data-icon="zoom-in" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path></svg></i></li>
            <li code='zoomIn' title='缩小'>
              <i aria-label="图标: zoom-out" class="anticon anticon-zoom-out"><svg viewBox="64 64 896 896" data-icon="zoom-out" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z"></path></svg></i>
            </li>
            <li code='autoZoom' title='全貌'>
              <i aria-label="图标: pic-center" class="anticon anticon-pic-center"><svg viewBox="64 64 896 896" data-icon="pic-center" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M952 792H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-632H72c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h880c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM848 660c8.8 0 16-7.2 16-16V380c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h672zM232 436h560v152H232V436z"></path></svg></i>
            </li>
          </ul>`
      },  
      handleClick: (code, graph) => {
        toolbar.handleDefaultOperator(code, graph)
      }
    })
    const contextMenu = new G6.Menu({
      getContent(evt) {
        let id, header = "菜单", list = []
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
          return
        } else if (evt.item) {
          const item = evt.item 
          const type = item.getType()
          if(type === "node") {
            const model = item.get("model")
            id = model.id
            header = `基于[${model.label}]操作`
            list = [
              {
                label: "新增结点",
                code: "createNode"
              },
              {
                label: "删除",
                code: "deleteNode"
              }
            ]
          }
        }
        return `
        <h3>${header}</h3>
        <ul>
          ${list.map(item => `<li id=${id} code='${item.code}'>${item.label}</li>`).join("")}
        </ul>`
      },
      handleMenuClick: (target, item) => {
        if (!target) return
        const id = target.getAttribute("id")
        const code = target.getAttribute("code")
        switch(code) {
          case "createNode":
            handleCreateNode(id)
            break
          case "deleteNode":
            handleDeleteNode(id)
            break
        }
      },
      // offsetX and offsetY include the padding of the parent container
      // 需要加上父级容器的 padding-left 16 与自身偏移量 10
      offsetX: 16 + 10,
      // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
      offsetY: 0,
      // the types of items that allow the menu show up
      // 在哪些类型的元素上响应
      itemTypes: ['node'],
    });
    
    // 订阅
    eventBus.subscribe("updateNodeInfo", ({ id, info }) => {
        const node = graph.findById(id)
        const params = nodeMap[id]
        if (node && params) {
          const newParams = translateNodeParams({...params, info: { ...params.info, ...info }})
          nodeMap[id] = JSON.parse(JSON.stringify(newParams))
          graph.update(node, newParams)
          graph.layout()
          graph.isChange = true
        } else {
          console.error("找不到结点: " + id)
        }
    })
    eventBus.subscribe("updateNodeConfig", ({id, config}) => {
      const node = graph.findById(id)
      const params = nodeMap[id]
      if (node && params) {
        const newParams = translateNodeParams({...params, config: { ...params.config, ...config }}) 
        nodeMap[id] = JSON.parse(JSON.stringify(newParams))
        graph.update(node, newParams)
        node.getOutEdges().forEach(edge => {
          const source = edge.get("model").source
          const params = translateEdgeParams({ source })
          graph.updateItem(edge, params)
        })
        graph.paint()
        graph.isChange = true
      } else {
        console.error("找不到结点: " + id)
      }
    })
    eventBus.subscribe("updateNodeData", ({id, key, value}) => {
      const node = graph.findById(id)
      const params = nodeMap[id]
      if (node && params) {
        params.data[key] = value
        nodeMap[id] = JSON.parse(JSON.stringify(params))
        graph.update(node, params)
        graph.paint()
        graph.isChange = true
      } else {
        console.error("找不到结点: " + id)
      }
    })
    
    // 注册
    G6.registerNode(
      'mind-map-root', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 16)[0] + 24;
          const color = cfg.labelCfg.style.fill || "grey";
          const backgroundColor = cfg.style.fill || "#e3e3e3"

          return `
          <group>
            <rect draggable="true" style={{width: ${width}, height: 38, stroke: ${backgroundColor}, fill: ${backgroundColor}, radius: 6}} keyshape>
              <text draggable="true" style={{ fill: ${color}, fontSize: 16, marginLeft: 12, marginTop: 12 }}>${cfg.label}</text>
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
      'mind-map-sub', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 14)[0] + 24;
          const color = cfg.labelCfg.style.fill || "grey";
          const backgroundColor = cfg.style.fill || "#e3e3e3"
          return `
          <group>
            <rect draggable="true" style={{width: ${width}, height: 32, lineWidth:2, stroke: ${backgroundColor}, radius: 6,  fill: 'transparent' }} keyshape>
              <text draggable="true" style={{ fill: ${color}, fontSize: 14, marginLeft: 12, marginTop: 9 }}>${cfg.label}</text>
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
      'mind-map-leaf', {
        jsx: (cfg) => {
          const width = G6.Util.getTextSize(cfg.label, 12)[0] + 24;
          const color = cfg.labelCfg.style.fill || "grey";
          const backgroundColor = cfg.style.fill || "#e3e3e3"

          return `
          <group>
            <rect draggable="true" style={{width: ${width + 20}, height: 26, fill: 'transparent' }}>
              <text draggable="true" style={{ fill: ${color}, fontSize: 12, marginLeft: 12, marginTop: 6 }}>${cfg.label}</text>
            </rect>
            <rect draggable="true" style={{ fill: ${backgroundColor}, width: ${width + 24}, height: 2, x: 0, y: 32 }} />
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

    const dataTransform = (data) => {
      const changeData = (d, level = 0) => {
        nodeMap[d.id] = { ...d }
        delete nodeMap[d.id].children

        const data = translateNodeParams(d, level)

        if (d.children) {
          data.children = d.children.map((child, index) => changeData(child, level + 1));
        }
        return data;
      };
      return changeData(data);
    }
  
    let graph
    
    // 处理事件
    function handleCreateNode(id) {
      const item = graph.findById(id)
      const model = item.get("model")

      const initParams = initNodeParams()
      const c = generateNode()

      const configParams = translateNodeParams(c, (model.level || 0) + 1)

      nodeMap[c.id] = JSON.parse(JSON.stringify(configParams))

      graph.updateItem(item, {
        children: (model.children || []).concat([Object.assign(initParams, configParams)]),
      });

      graph.layout(false)
      graph.isChange = true

      const n = graph.findById(c.id)
      graph.setItemState(n, "selected", true)
      setTimeout(() => {
        handleNodeClick(n)
      }, 800)
    }
    function handleDeleteNode(id) {
      const item = graph.findById(id)
      const parent = item.get('parent')
      graph.updateItem(parent, {
        children: (parent.get('model').children || []).filter((e) => e.id !== id),
      });
      graph.layout()
      nodeMap[id] = null
      graph.isChange = true
      eventBus.publish("hideNodeDialog")
    }
    
    function handleNodeClick(item) {
      const id = item.get("model").id
      graph.focusItem(item, true, {
        easing: 'easeCubic',
        duration: 500,
      });
      const nodeParams = nodeMap[id]
      eventBus.publish("showNodeDialog", nodeParams)
    }

  return (data, isEditing) => {

    if (graph) {
      graph.clear()
      graph = null
      container.innerHTML = ""
    }
    nodeMap = {}

    // 放在闭包外面，第二次创建不显示
    const minimap = new G6.Minimap()
    const plugins = isEditing ?  [ minimap, toolbar, contextMenu ] :  [ minimap, toolbar ]
    graph = new G6.TreeGraph({
        container,
        width,
        height,
        plugins,
        fitCenter: true,
        modes: {
          default: [
            'drag-canvas', 
            'zoom-canvas',
            {
              type: 'drag-node',
              enableDelegate: true,
              shouldEnd: () => false
            }, 
          ],
        },
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
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            lineWidth: 2,
          },
        },
        minZoom: 0.5,
        maxZoom: 6
    });

    graph.edge(translateEdgeParams)

    if (!data || !data.id) {
      const c = initNodeParams()
      const params = generateNode()
      data = Object.assign(c, params)
    }

    graph.data(dataTransform(data))

    graph.render();
    
    graph.fitView();

    // 事件
    graph.on("node:click", function(e) {
      const item = e.item;
      // animately move the graph to focus on the item.
      // the second parameter controlls whether move with animation, the third parameter is the animate configuration
      handleNodeClick(item)
    })
    graph.on("canvas:click", function(e) {
      eventBus.publish("hideNodeDialog")
    })

    // 拖拽
    let minDisNode;
    graph.on('node:dragstart', (e) => {
      minDisNode = undefined;
    });
    graph.on('node:drag', (e) => {
      minDisNode = undefined;
      const item = e.item;
      const model = item.getModel();
      const nodes = graph.getNodes();
      let minDis = Infinity;
      nodes.forEach((inode) => {
        const node = inode.getModel();
        if (node.id === model.id) return;
        if (node.style.fill != node.config.backgroundColor) {
          graph.updateItem(inode, { style: { fill: node.config.backgroundColor } });
        }
        const dis = (node.x - e.x) * (node.x - e.x) + (node.y - e.y) * (node.y - e.y);
        if (dis < minDis) {
          minDis = dis
          minDisNode = inode
        }
      });
      if (minDis < 2000) {
        graph.updateItem(minDisNode, { style: { fill: "red" } });
      } else minDisNode = undefined;
    });

    graph.on('node:dragend', (e) => {
      if (!minDisNode) {
        return;
      }
      const item = e.item;
      const id = item.getID();
      const data = graph.findDataById(id);
      // if the minDisNode is a descent of the dragged node, return
      let isDescent = false;
      const minDisNodeId = minDisNode.getID();

      G6.Util.traverseTree(data, (d) => {
        if (d.id === minDisNodeId) isDescent = true;
      });
      if (isDescent) {
        return;
      }
      graph.removeChild(id);

      setTimeout(() => {
        const newParentData = graph.findDataById(minDisNodeId);
        let newChildren = newParentData.children;
        if (newChildren) newChildren.push(data);
        else newChildren = [data];
        graph.updateChildren(newChildren, minDisNodeId);
        graph.isChange = true
      }, 600);
    })

    if (typeof window !== 'undefined') {
      function resize() {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.width || !container.height) return;
        graph.changeSize(container.width, container.height);
      }
      window.onresize = debounce(resize, 200)
    }

    return graph
  }
}

