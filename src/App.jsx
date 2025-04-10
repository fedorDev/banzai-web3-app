import SelectChain from '/src/components/SelectChain'
import { useNavigate } from 'react-router'

const App = () => {
  const navigate = useNavigate()

  return (
    <SelectChain onPicked={(val) => navigate(`/${val}`)} />
  )
}
export default App
