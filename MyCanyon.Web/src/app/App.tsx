import { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AppData, loadData, saveData } from "./account/AppData";
import Menu from "./menu/Menu";
import Home from "./home/Home";
import Trips from "./trips/Trips";
import Account from "./account/Account";
import OnedriveRoot from "Onedrive/OnedriveRoot";
import "./App.css";

const initialData = loadData();

function App() {
    const [data, setData] = useState(initialData);
    const updateData = (newData: AppData) => {
        setData(newData);
        saveData(newData);
    }

    return (
        <div className="app">
            <OnedriveRoot>
                <Router>
                    <Menu />
                    <div className="content">
                        <Route exact path="/" component={Home} />
                        <Route path="/account" component={Account} />
                        <Route path="/trips" render={(props) => (<Trips {...props} data={data} updateData={updateData} />)}/>
                    </div>
                </Router>
            </OnedriveRoot>
        </div>
    );
}
export default App;