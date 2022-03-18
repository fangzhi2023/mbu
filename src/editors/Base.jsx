import { Button, Input, Form, message, Modal } from "antd"
import { DeleteOutlined, NodeExpandOutlined, NodeIndexOutlined, SaveOutlined } from "@ant-design/icons"
import React, { Fragment, useEffect, useState } from "react"
import { SketchPicker } from 'react-color'
import { debounce } from "lodash"

import eventBus from "../utils/event-bus"
import "./Base.scss"
import { useNavigate } from "react-router"
import { rgba2Hex } from "../utils/color"
import { createArticle } from "../services/article"
import { createSuite } from "../services/suite"

function BaseEditor(props) {

    const { id, status } = props
    const navigate = useNavigate()

    useEffect(() => {
        eventBus.subscribe("save", secret => {
           message.success("保存成功")
           eventBus.publish("saveSuccess", secret)
        })
        eventBus.subscribe("cancelEdit", () => {
            // TODO: 
            navigate( `/suite/${id}`, { replace: true, state: { uKey: Date.now() } })
        })
    }, [])

    return <div className="base-editor">
      {props.children}
      {
          status !== "editing"
            ? <Fragment>
                <ViewNodeInfo />
                {/* <ViewNodeFilter id={id} /> */}
            </Fragment>
            : ""
      }
      {
          status === "editing"
            ?  <Fragment>
                <EditNodeInfo />
                <EditNodeConfig />
            </Fragment>
            : ""
      }
  </div>
}

function ViewNodeInfo() {
    
    let nodeId = null
    let [visible, setVisible] = useState(false)
    let [info, setInfo] = useState({})

    useEffect(() => {
        eventBus.subscribe("showNodeDialog", ({ id, info }) => {
            nodeId = id
            setInfo(info)
            setVisible(true)
            eventBus.publish("moveAuthorDialog")
        })
        eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
    }, [])
    
    const navigate = useNavigate()
    const handleViewArticle = () => {
        navigate(`/article/${info.articleId}`)
    }
    const handleViewSuite = () => {
        navigate(`/suite/${info.suiteId}`)
    }

    return (
        <div className={ visible ? "node-dialog left visible" : "node-dialog left" }>
            <h3 className="title">{info.name}</h3>
            <p className="desc">{info.description}</p>
            <div className="footer">
                <div>{ info.articleId ? <Button onClick={handleViewArticle} type="link" icon={<NodeIndexOutlined />} /> : "" }</div>
                <div>{ info.suiteId ? <Button onClick={handleViewSuite} type="link" icon={<NodeExpandOutlined />} /> : "" }</div>
            </div>
        </div>
    )
}

function EditNodeInfo() {
    
  const [form] = Form.useForm();

    let [nodeId, setNodeId] = useState(null)
    let [info, setInfo] = useState({})
    let [visible, setVisible] = useState(false)

    useEffect(() => {
        eventBus.subscribe("showNodeDialog", ({ id, info }) => {
            setNodeId(id)
            setInfo(info)
            form.setFieldsValue(info)
            setVisible(true)
        })
        eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
    }, [])

    const onFinish = info => {
        eventBus.publish("updateNodeInfo", { id: nodeId, info })
        message.success("更新成功")
    }
      
    let [articleLoading, setArticleLoading] = useState(false)
    let [suitLoading, setSuiteLoading] = useState(false)
    const navigate = useNavigate()
    const handleEditArticle = () => {
        if (info.articleId) {
            navigate( `/article/${info.articleId}`, { state: { uKey: Date.now() } })
            return
        }
        setArticleLoading(true)
        createArticle().then(({ id }) => {
            eventBus.publish("updateNodeInfo", { id: nodeId, info: { ...info, articleId: id }})
            const secret = "key" + Date.now()
            eventBus.subscribe("saveSuccess", secret2 => {
                if (secret2 !== secret) return
                setArticleLoading(false)
                navigate( `/article/${id}`, { state: { uKey: Date.now() } })
            })
            eventBus.publish("save", secret)
        })
    }
    const handleEditSuite = () => {
        if (info.suiteId) {
            navigate( `/suite/${info.suiteId}`, { state: { uKey: Date.now() } })
            return
        }
        setSuiteLoading(true)
        createSuite().then(({ id }) => {
            eventBus.publish("updateNodeInfo", { id: nodeId, info: { ...info, suiteId: id }})
            const secret = "key" + Date.now()
            eventBus.subscribe("saveSuccess", secret2 => {
                if (secret2 !== secret) return
                setSuiteLoading(false)
                navigate( `/suite/${id}`, { state: { uKey: Date.now() } })
            })
            eventBus.publish("save", secret)
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
                    <Button loading={articleLoading} onClick={handleEditArticle} type="link" icon={<NodeIndexOutlined />} />
                    <Button loading={suitLoading} onClick={handleEditSuite} type="link" icon={<NodeExpandOutlined />} />
                </div>
                <div>
                    <Button htmlType="submit" type="link" icon={<SaveOutlined />}>更新</Button>
                </div>
            </div>
        </Form>
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
        eventBus.subscribe("showNodeDialog", ({ id, config }) => {
            setNodeId(id)
            if(!config.color) config.color = "#fff"
            if(!config.backgroundColor) config.backgroundColor = "#000"
            setConfig(config)
            setVisible(true)
        })
        eventBus.subscribe("hideNodeDialog", () => {
            setVisible(false)
        })
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
            <Form.Item label="直径">
                <Input type="number" value={config.size} min={30} max={160} onChange={e => handleChange("size", e.target.value)} />
            </Form.Item>
            <Form.Item label="优先级">
                <Input type="number" value={config.value} min={30} max={100} onChange={e => handleChange("value", e.target.value)} />
            </Form.Item>
        </Form>
    </div>
}

export default BaseEditor;
