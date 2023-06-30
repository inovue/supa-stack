import { classNames } from "primereact/utils";


export type ImageCardProps = JSX.IntrinsicElements['img'] & {
}

export const  ImageCard:React.FC<ImageCardProps> = (props) => {
  const {className: _className, style: _style, ..._props} = props;

  const imageProps:JSX.IntrinsicElements['img'] = {
    ..._props,
    className: classNames([ ...(_className ? _className.split(' ') : []) ]),
    style: {
      width:'100%',
      height:'100%',
      borderRadius:'5px',
      objectFit:'contain',
      verticalAlign: 'middle',
      ...(_style||{}) }
    
  }
  
  const imageWrapperProps: JSX.IntrinsicElements['div'] = {
    className: classNames([]),
    style: {
      width:'100%',
      height:'100%',
      borderRadius:'5px',
      aspectRatio:1,
      backgroundColor:'black',
      cursor:'pointer',
      position:'relative'
    }
  }

  return (
    <div {...imageWrapperProps} >
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        <img {...imageProps} />
      }
    </div>
  )
}