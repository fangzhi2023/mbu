import React from "react"
import Editor from "rich-markdown-editor"

import "./Markdown.scss"

function Markdown(props) {
  return (
  <div className="markdown">
    <div className={ props.readOnly ? 'container':'container edit' }>
      <Editor {...props} />
    </div>
  </div>
  )
}

export default Markdown;
