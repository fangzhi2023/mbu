import { Button, Input, Form, Modal, message } from "antd"
import {  ExclamationCircleOutlined, NodeExpandOutlined, NodeIndexOutlined, SaveOutlined } from "@ant-design/icons"
import React, { Fragment, useEffect, useState } from "react"
import { SketchPicker } from 'react-color'
import { debounce } from "lodash"

import eventBus from "../utils/event-bus"
import "./Base.scss"
import { useNavigate } from "react-router"
import { rgba2Hex } from "../utils/color"
import ArticleModal from "../components/ArticleModal"
import SuiteModal from "../components/SuiteModal"
import { fetchSuitesInfoByParentId, updateSuiteData } from "../services/suite"
import { fetchArticlesInfoBySuiteId } from "../services/article"

function BaseEditor(props) {

    const { id, editing, checkChanged, onSaveSuccess, getData } = props
    
    // 获取关联文章和模块
    let [articleMap, setArticleMap] = useState({})
    let [suiteMap, setSuiteMap] = useState({})
    useEffect(() => {
        async function fetchMapData() {
            await Promise.all([
                fetchSuitesInfoByParentId(id), 
                fetchArticlesInfoBySuiteId(id)
            ]).then(([suiteList, articleList]) => {
                console.log(articleList)
                const articleMap = {}
                articleList.forEach(a => {
                    articleMap[a.nodeId] = a
                })
                setArticleMap(articleMap)
                const suiteMap = {}
                suiteList.forEach(s => {
                    suiteMap[s.nodeId] = s
                })
                setSuiteMap(suiteMap)
            }).catch(err => {
                console.error(err)
            })
        }
        fetchMapData()
    }, [id])

    useEffect(() => {
        const checkChangedSub = eventBus.subscribe("checkChanged", (params, cb) => {
           if(checkChanged()) {
                Modal.confirm({
                    title: '存在未保存内容',
                    icon: <ExclamationCircleOutlined />,
                    content: '如想中断当前操作，请点击右上角关闭图标',
                    closable: true,
                    okText: '保存后执行',
                    onOk: async () => {
                        try {
                            await updateSuiteData({ id, data: getData() })
                            onSaveSuccess()
                            cb && cb()
                        } catch (err) {
                            message.error("保存异常")
                        }
                    },
                    cancelButtonProps: { danger: true },
                    cancelText: '放弃保存',
                    onCancel: e => {
                        // 点击右上角关闭图标，则只是中断操作
                        if (e && e.triggerCancel) return
                        
                        // e == close
                        e()
                        cb && cb()
                    }
                });
                return
           }
           cb && cb()
        })
        const saveSub = eventBus.subscribe("save", async (params, cb) => {
            if (checkChanged()) {
                try {
                    await updateSuiteData({ id, data: getData() })
                    onSaveSuccess()
                    cb && cb()
                } catch (err) {
                    message.error("保存异常")
                }
            } else {
                cb && cb()
            }
        })
        return ()  => {
            checkChangedSub.unsubscribe()
            saveSub.unsubscribe()
        }
    }, [checkChanged, getData])

    return <div className="base-editor">
      {props.children}
      {
          !editing
            ? <Fragment>
                <ViewNodeInfo id={id} articleMap={articleMap} suiteMap={suiteMap} />
                {/* <ViewNodeFilter id={id} /> */}
            </Fragment>
            : null
      }
      {
          editing
            ?  <Fragment>
                <EditNodeInfo id={id}  articleMap={articleMap} suiteMap={suiteMap} />
                <EditNodeConfig id={id} />
            </Fragment>
            : null
      }
  </div>
}

function ViewNodeInfo(props) {
    
    const { articleMap, suiteMap } = props 

    let [nodeId, setNodeId] = useState(null)
    let [visible, setVisible] = useState(false)
    let [info, setInfo] = useState({})

    useEffect(() => {
        const showDialogSub = eventBus.subscribe("showNodeDialog", ({ id, info }) => {
            setNodeId(id)
            setInfo(info)
            setVisible(true)
            eventBus.publish("moveAuthorDialog")
        })
        const hideDialogSub = eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
        return ()  => {
            showDialogSub.unsubscribe()
            hideDialogSub.unsubscribe()
        }
    }, [])
    
    const navigate = useNavigate()
    const handleViewArticle = articleId => {
        navigate(`/article/${articleId}`)
    }
    const handleViewSuite = suiteId => {
        navigate(`/suite/${suiteId}`)
    }

    return (
        <div className={ visible ? "node-dialog left visible" : "node-dialog left" }>
            <h3 className="title">{info.name}</h3>
            <p className="desc">{info.description}</p>
            <div className="footer">
                <div>{ articleMap[nodeId] ? <Button onClick={() => handleViewArticle(articleMap[nodeId].id)} type="link" title="查看详情" icon={<NodeIndexOutlined />}>详情</Button> : "" }</div>
                <div>{ suiteMap[nodeId] ? <Button onClick={() => handleViewSuite(suiteMap[nodeId].id)} type="link" title="查看关联模块" icon={<NodeExpandOutlined />}>子模块</Button> : "" }</div>
            </div>
        </div>
    )
}

function EditNodeInfo(props) {
    
    const { id, articleMap, suiteMap } = props 
  
    const [form] = Form.useForm();

    let [nodeId, setNodeId] = useState(null)
    let [info, setInfo] = useState({})
    let [visible, setVisible] = useState(false)

    useEffect(() => {
        const showDialogSub = eventBus.subscribe("showNodeDialog", ({ id, info }) => {
            setNodeId(id)
            setInfo(info)
            form.setFieldsValue(info)
            setVisible(true)
        })
        const hideDialogSub = eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
        
        return ()  => {
            showDialogSub.unsubscribe()
            hideDialogSub.unsubscribe()
        }
    }, [])

    const onFinish = info => {
        eventBus.publish("updateNodeInfo", { id: nodeId, info })
    }
      
    const navigate = useNavigate()
    let [articleModalShow, setArticleModalShow] = useState(false)

    const linkToArticle = articleId => {
        navigate( `/article/${articleId}/edit`, { state: { layoutKey: Date.now() } })
    }
    const handleEditArticle = () => {
        eventBus.publish("checkChanged", null, () => {
            if (articleMap[nodeId]) {
                linkToArticle(articleMap[nodeId].id)
                return
            }
            setArticleModalShow(true)
        })
    }

    let [suiteModalShow, setSuiteModalShow] = useState(false)
    const linkToSuite = suiteId => {
        navigate( `/suite/${suiteId}/edit`, { state: { layoutKey: Date.now() } })
    }
    const handleEditSuite = () => {  
        eventBus.publish("checkChanged", null, () => {
            if (suiteMap[nodeId]) {
                linkToSuite(suiteMap[nodeId].id)
                return
            }
            setSuiteModalShow(true)
        })
    }

    return <div className={ visible ? "node-dialog left visible" : "node-dialog left" }>
        <Form
            name="basic"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            >
            <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入结点名称' }]}
            >
                <Input placeholder="请输入结点名称" />
            </Form.Item>
            <Form.Item
                label="描述"
                name="description"
            >
                <Input.TextArea rows={6} maxLength={12} placeholder="输入结点描述内容" />
            </Form.Item>
            <div className="footer">
                <div>
                    <Button size="small" onClick={handleEditArticle} type="link" title="编辑详情" ><NodeIndexOutlined />详情</Button>
                    <Button size="small" onClick={handleEditSuite} type="link" title="编辑关联模块" ><NodeExpandOutlined />模块</Button>
                </div>
                <div>
                    <Button size="small" htmlType="submit" type="primary" icon={<SaveOutlined />}>更新</Button>
                </div>
            </div>
        </Form>
        { articleModalShow ? <ArticleModal suiteId={id} nodeId={nodeId} visible={true} onOk={id => linkToArticle(id)} onCancel={() => setArticleModalShow(false)} /> : null }
        { suiteModalShow ? <SuiteModal parentId={id} nodeId={nodeId} visible={true} onOk={id => linkToSuite(id)} onCancel={() => setSuiteModalShow(false)} /> : null }
    </div>
}

function ViewNodeFilter(props) {
    const { id } = props
    return <div className="node-dialog right visible">
        ViewNodeFilter: {id}
    </div>
}

function EditNodeConfig() {

    // 颜色选择器
    let [colorPickerKey, setColorPickerKey] = useState(null)
    let [config, setConfig] = useState({color: "#000a", backgroundColor: "#fff9"})

      const handlePickerClick = key => {
          setColorPickerKey(key)
      }
      const handlePickerClose = () => {
        setColorPickerKey(null)
      }
      const handlePickerChange = (key, color) => {
        const hexColor = rgba2Hex(color.rgb)
        handleChange(key, hexColor)
      }

    let [nodeId, setNodeId] = useState(null)
    let [visible, setVisible] = useState(false)

    useEffect(() => {
        const showDialogSub = eventBus.subscribe("showNodeDialog", ({ id, config }) => {
            setNodeId(id)
            if(!config.color) config.color = "#fff"
            if(!config.backgroundColor) config.backgroundColor = "#000"
            setConfig(config)
            setVisible(true)
        })
        const hideDialogSub = eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
        
        return ()  => {
            showDialogSub.unsubscribe()
            hideDialogSub.unsubscribe()
        }
    }, [])

    const publish = debounce(function(...args) {
        eventBus.publish(...args)
    }, 1000)

    const handleChange = (key, value) => {
        const newConfig = {...config, [key]: value}
        setConfig(newConfig)
        publish("updateNodeConfig", { id: nodeId, config: newConfig })
    }

    return <div className={ visible ? "node-dialog right visible" : "node-dialog right" }>
        <Form
            name="config"
            layout="horizontal"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            >
            <Form.Item label="字体颜色">
                <div className="swatch" onClick={ () => handlePickerClick('color') }>
                    <div className="color" style={{backgroundColor: config.color }}></div>
                </div>
                { colorPickerKey === "color" ? <div className="popover">
                <div className="cover" onClick={ handlePickerClose }/>
                    <SketchPicker color={ config.color } onChange={ e => handlePickerChange('color', e) } />
                </div> : null }
            </Form.Item>
            <Form.Item label="背景色">
                <div className="swatch" onClick={ () => handlePickerClick('backgroundColor') }>
                    <div className="color" style={{backgroundColor: config.backgroundColor }}></div>
                </div>
                { colorPickerKey === "backgroundColor" ? <div className="popover">
                <div className="cover" onClick={ handlePickerClose }/>
                    <SketchPicker color={ config.backgroundColor } onChange={ e => handlePickerChange('backgroundColor', e) } />
                </div> : null }
            </Form.Item>
            { config.size != undefined ? <Form.Item label="直径">
                <Input type="number" value={config.size} min={30} max={160} onChange={e => handleChange("size", e.target.value)} />
            </Form.Item> : null }
            { config.value != undefined ? <Form.Item label="优先级">
                <Input type="number" value={config.value} min={30} max={100} onChange={e => handleChange("value", e.target.value)} />
            </Form.Item> : null }
        </Form>
    </div>
}

export default BaseEditor;
