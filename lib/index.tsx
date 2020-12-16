import ReactDOM from 'react-dom'
import React from 'react'
import Icon from './icon'
const fn: React.MouseEventHandler = (e)=>{
  console.log(e.target);// target可能没有属性,MouseEvent接受参数, 断言
};

ReactDOM.render(
  <div>
    <Icon name="QQ" onClick={fn} />
  </div>, document.querySelector('#root'));
