
import { Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { dynamicLoad } from "../../editors"

import "./index.scss"

import { fetchSuite } from '../../services/suite';
import { getDefaultId } from '../../layouts/BaseLayout';

function Suite(props) { 
    
    let { id } = useParams()
    if (!id) id = getDefaultId("suite")

    const { editing = false } = props

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
            const component = await dynamicLoad(data.type)
            setEditor({
                ... data,
                name: data.type,
                component: component.default
            })
            setLoading(false)
        }
        fetchSuiteData()
    }, [id, uKey])

    return (
        <div className="suite">
            { loading ? <Spin tip="加载数据..." /> : <editor.component name={editor.name} id={editor.id} data={editor.data} editing={editing} />}
        </div>
    )
}

export default Suite;