import './App.scss';
import ARSceneComponent from './8thwall/ARSceneComponent';
import UI from './components/UI/UI';
import { useStore } from './hook/useStore';
import Emitter from './util/Emitter';
import { useEffect } from 'react';
import {ONFAMILYSELECTED} from './util/constants';
import Loading from './components/Loading/Loading';
import Desktop from './components/ErrorUI/Desktop';
import Global from './util/Global';

function App() {
  const [{isMobile, isOnLocation}, {}] = useStore();
  
  return (
    <div className="App">
      {isMobile?<ARSceneComponent/>:<Desktop/>}
      {isMobile?<UI/>:''}
      {isMobile?<Loading/>:''}
    </div>
  );
}

export default App;
