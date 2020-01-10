import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import Home from './pages/Home';
import {TaskList} from "./pages/TaskList";
import {TaskEdit} from "./pages/TaskEdit";
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';


const App: React.FC = () => (
    <IonApp>
       <Home>
          <IonReactRouter>
              <IonRouterOutlet>
                  <Route path="/home" component={TaskList} />
                  <Route path="/edit" component={TaskEdit}/>
                  <Redirect exact from="/" to="/home" />
              </IonRouterOutlet>
          </IonReactRouter>
       </Home>
    </IonApp>
);

export default App;
