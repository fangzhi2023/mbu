
import { Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { dynamicLoad } from "../../editors"

import "./index.scss"

import { fetchSuite } from '../../services/suite';

function Suite(props) {  
    const { id } = useParams()
    const { state } = useLocation()
    let [uKey, setUKey] = useState(null)
    if (state && state.uKey != uKey) {
        setUKey(state.uKey)
    }

    let [loading, setLoading] = useState(true)
    let [editor, setEditor] = useState({
        component: null,
        data: null
    })
    useEffect(() => {
        setLoading(true)
        async function fetchSuiteData() {
            const data = await fetchSuite(id)
            const component = await dynamicLoad(data.editor)
            setEditor({
                ... data,
                name: data.editor,
                component: component.default
            })
            setLoading(false)
        }
        fetchSuiteData()
    }, [id, uKey])

    return (
        <div className="suite">
            { loading ? <Spin tip="加载数据..." /> : <editor.component name={editor.name} id={editor.id} data={editor.data} status={props.status} />}
        </div>
    )
}

export default Suite;