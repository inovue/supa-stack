import { useFormContext } from "remix-validated-form"

export const FormErrorBox:React.FC<{className?:string}> = ({className=''}) => {
  const context = useFormContext()

  return (
    <ul>
      {Object.keys(context.fieldErrors).map(key => (
        <li key={key}>
          <small className="p-error" style={{whiteSpace:'pre-wrap'}}>{key}: {JSON.stringify(context.fieldErrors[key],null,2)}</small>
        </li>
      ))}
    </ul>
  )
}