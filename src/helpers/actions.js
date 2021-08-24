export const isBack = (props)=>{
  const {history} = props;
  return history && history.action && history.action === 'POP'
}