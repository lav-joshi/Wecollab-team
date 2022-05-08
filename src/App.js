import Home from './components/Home'
import {BrowserRouter} from "react-router-dom";

function App() {
  console.log(process.env.REACT_APP_HOST_NAME)
  return (
    <BrowserRouter >
      <Home/>
    </BrowserRouter>
  );
}

export default App;
