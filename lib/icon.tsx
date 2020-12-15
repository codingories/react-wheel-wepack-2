import React from 'react';
import wechat from '../icons/wechart.svg'
console.log(wechat);
interface IconProps {
  name: string;
}

const Icon: React.FunctionComponent<IconProps> = (props) => {
  // Icon的类型是一个接受IconProps的函数组件FunctionComponent,<>表示类型接受一个参数P,如果不传参数的默认值就是一个空对象
  // 空对象表示没有任何限制，当传了就有限制,p会传递到PropsWithChildren
  // 最终的意思就是当我们写Function, 这个函数组件Props必须有name还可以有children,此时props的类型就是IconProps外加一个Children
  return (
    <span>{ props.name }</span>
  )
};

export default Icon;
