import React, { useEffect,useState } from "react"
import G6 from '@antv/g6'
import eventBus from "../utils/event-bus"
import { fittingString } from "../utils/string"
import BaseEditor from "./Base"
import { debounce } from "lodash"

function GraphMapEditor(props) {

  const { id, data, editing } = props

  const d = {
    nodes: [],
    edges: [],
    ... data
  }

  const ref = React.useRef(null);

  const [renderFun, setRenderFun] = useState(null)

  let [graph, setGraph] = useState(null)
  useEffect(() => {
    const fun = renderGraph(ref.current)
    setGraph(fun(d, editing))
    console.log("首次渲染")
    setRenderFun(() => fun)
  }, [])
    
  useEffect(() => {
    // 首次渲染不执行
    if (renderFun) {
      setGraph(renderFun(d, editing))
      console.log("二次渲染")
    }
  }, [id, editing])

  const hasChanged = () => {
    return graph && graph.isChange
  }

  const getData = () => {
    const data = graph.save()
    return {
      nodes: data.nodes.map(node => {
        return {
          id: node.id,
          info: node.info,
          config: node.config,
          data: node.data,
          x: node.x,
          y: node.y
        }
      }),
      edges: data.edges.map(edge => {
        return {
          source: edge.source,
          target: edge.target
        }
      })
    }
  }

  return <BaseEditor id={id} editing={editing} hasChanged={hasChanged} getData={getData}>
    <div ref={ref} style={{width:"100%",height:"100%"}}></div>
  </BaseEditor>
}

export default GraphMapEditor;

function renderGraph(container){
  
    // 全局变量
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    let filterKey = null // 过滤key
    let nodeMap = {} // 结点map

    function calculOpacity(config, data) {
      let value = config.value 
      if (filterKey && data && data[filterKey]) value = data[filterKey]
      if (value < 40) value = 40
      if (value > 100) value = 100
      return value * 0.01
    }
    function generateNode() {
      return {
        id: Date.now() + "",
        info: {
          name: "新增结点",
          description: ""
        },
        config: {
          value: 100,
          color: "white",
          backgroundColor: "grey",
          size: 80
        },
        data: {}
      }
    }
    function initNodeParams() {
      const params  = {}
      params.x = width / 2 + 300 * (Math.random());
      params.y = height / 2 + 300 * (Math.random() - 0.5);
      return params
    }
    function translateNodeParams(node) {
      return {
        ...node,
        label: fittingString(node.info.name, 6),
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
          }
        }
      }
    }
    function translateEdgeParams(edge) {
      // const sourceNode = nodeMap[edge.source]
      return {
        ...edge,
        // style: {
        //   stroke: sourceNode.config.backgroundColor
        // },
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
          list = [
            {
              label: "新增模块",
              code: "createNode"
            }
          ]
        } else if (evt.item) {
          const item = evt.item 
          const type = item.getType()
          if(type === "node") {
            const model = item.get("model")
            id = model.id
            header = `基于[${model.label}]操作`
            list = [
              {
                label: "新增模块",
                code: "createNode"
              },
              {
                label: "删除",
                code: "deleteNode"
              }
            ]
          } else if (type === "edge") {
            id = item.get("model").id
            list = [
              {
                label: "删除边",
                code: "deleteEdge"
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
          case "deleteEdge":
            handleDeleteEdge(id)
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
      itemTypes: ['node', 'edge', 'canvas'],
    });
    
    // 订阅
    eventBus.subscribe("updateNodeInfo", ({ id, info }) => {
        const node = graph.findById(id)
        const params = nodeMap[id]
        if (node && params) {
          const newParams = translateNodeParams({...params, info: { ...params.info, ...info }})
          nodeMap[id] = JSON.parse(JSON.stringify(newParams))
          graph.update(node, newParams)
          graph.paint()
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
        graph.layout()
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
    let t = null // 用于存储临时变量
    G6.registerEdge(
      'line-growth',
      {
        setState(name, value, item) {
          const shape = item.get('keyShape')
          if (name === "active") {
            if(!t) {
              t = {
                stroke: shape.attr("stroke"),
                lineWidth: shape.attr("lineWidth")
              }
            }
            if (value) {
              const length = shape.getTotalLength();
              const source = item.get("model").source
              const color = nodeMap[source].config.backgroundColor || "grey"
              shape.attr("stroke", color)
              shape.attr("lineWidth", 2)
              shape.animate(
                (ratio) => {
                  const startLen = ratio * length;
                  const cfg = {
                    lineDash: [startLen, length - startLen]
                  };
                  return cfg;
                },
                {
                  repeat: false,
                  duration: 500,
                },
              )
            } else {
              if(t) {
                shape.attr("lineWidth", t.lineWidth)
                shape.attr("stroke", t.stroke)
              }
              // 结束动画
              shape.stopAnimate();
              // 清空 lineDash
              shape.attr('lineDash', null);
            }
          }
        }
      },
      'quadratic',
    );
  
    let graph
    
    // 处理事件
    function handleCreateNode(id) {
      const initParams = initNodeParams()
      const c = generateNode()
      const configParams = translateNodeParams(c)
      nodeMap[c.id] = JSON.parse(JSON.stringify(configParams))
      graph.add("node", Object.assign(initParams, configParams))
      graph.isChange = true
      
      // 如果id不为空，新增关联新模块的边
      if (id) {
        const sourceNode = nodeMap[id]
        if (sourceNode) {
          const edge = translateEdgeParams({ source: sourceNode.id, target: c.id })
          graph.add("edge", edge)
        }
      }

      graph.layout()

      const n = graph.findById(c.id)
      graph.setItemState(n, "selected", true)
      setTimeout(() => {
        handleNodeClick(n)
      }, 800)
    }
    function handleDeleteNode(id) {
      const n = graph.findById(id)
      graph.removeItem(n)
      graph.isChange = true
      nodeMap[id] = null
      eventBus.publish("hideNodeDialog")
    }

    function handleDeleteEdge(id) {
      const edge = graph.findById(id)
      graph.removeItem(edge)
      graph.isChange = true
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
    graph = new G6.Graph({
      container,
      width,
      height,
      plugins,
      layout: {
        type: 'force',
        preventOverlap: true,
        collideStrength: 0.7,
        alphaDecay: 0.01,
        linkDistance: 200,
        nodeStrength: 10,
        edgeStrength: 0.4,
        nodeSize: (d) => {
          return d.size / 2 + 5;
        },
      },
      defaultNode: {
        size: 30,
        labelCfg: {
          position: 'center',
          style: {
            fontStyle: 'bold',
            fontSize: 14,
          },
        },
        style: {
          opacity: 0.8,
          lineWidth: 1,
          stroke: '#000',
          fill: "grey"
        }
      },
      defaultEdge: {
        type: 'line-growth',
        labelCfg: {
          autoRotate: true,
        },
        style: {
          opacity: .8,
          stroke: '#c3c3c3'
        }
      },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'activate-relations',
          'click-select',
          {
            type: 'create-edge',
            key: 'control', // undefined by default, options: 'shift', 'control', 'ctrl', 'meta', 'alt'
          },
        ],
      },
      minZoom: 0.5,
    });

    const nodes = data.nodes.map(node => {
      const configParams = translateNodeParams(node)
      nodeMap[node.id] = JSON.parse(JSON.stringify(configParams))
      return configParams
    })
    const edges = data.edges.map(edge => {
      return translateEdgeParams(edge)
    })
    
    graph.data({
      nodes,
      edges
    });

    graph.render();

    if (nodes.length === 0) {
      const id = 'node'+Date.now()+parseInt(Math.random() * 100) 
      handleCreateNode(id)
      graph.isChange = false
    }
    
    // 键盘按键
    let downKey = undefined
    graph.on("keydown", e => {
      downKey = e.key
    })
    graph.on("keyup", e => {
      downKey = undefined
    })

    // 事件
    graph.on("node:click", function(e) {
      if (downKey === "Control") return
      const item = e.item;
      handleNodeClick(item)
    })
    graph.on("canvas:click", function(e) {
      eventBus.publish("hideNodeDialog")
    })
    graph.on("edge:mouseenter", function(e) {
      const item = e.item
      const sourceId = item.get("model").source
      const color = nodeMap[sourceId].config.backgroundColor
      graph.updateItem(item, { style: { lineWidth: 4, stroke: color }})
    })
    graph.on("edge:mouseleave", function(e) {
      const item = e.item
      graph.updateItem(item, { style: { lineWidth: 1, stroke: '#c3c3c3' }})
    })

    // 拖拽
    function refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
      e.item.get('model').fx = null;
      e.item.get('model').fy = null;
    });

    // 创建边相关
    graph.on('aftercreateedge', (e) => {
      graph.isChange = true
      const item = e.edge
      graph.updateItem(item, {
        type: "line-growth"
      })
    });
    
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
