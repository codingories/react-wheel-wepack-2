import React from 'react';
import './importIcons.js'
import './icon.scss'

interface IconProps {
  name: string;
  onClick: () => void;

  // onClick: React.MouseEventHandler<SVGElement>
  // onClick表示是svg元素鼠标事件的处理函数
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  return (
      <svg className="zui-icon" onClick={props.onClick}>
        <use xlinkHref={`#${props.name}`} />
      </svg>
  )
};

export default Icon;
