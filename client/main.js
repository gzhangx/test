import React from 'react';
import {render} from 'react-dom';
import {createHashHistory} from 'history';
import Menu from './components/topmenu/index.jsx';
import DataProvider from './DataProvider.jsx';
import api from './api.js';
import Login from './components/login/index.jsx';


class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.history = createHashHistory();
        this.history.listen(location => {
            console.log(location);
        });
        this.menuChanged = this.menuChanged.bind(this);
        this.state = {
            name: 'state name'
        }
    }

    menuChanged(val) {
        //BrowserHistory.Push('/'+val.key);
        this.history.replace({
            pathname: val.key,
            search: '',
        });
        this.setState({pathname: val.key});
        if (val.key == 'login') {
            this.setState({readList: null});
        }else
        api.getReadList().then(res=> {
           this.setState({readList: res.data});
        });
    }
    route(urlHash) {
        switch (urlHash) {
            case 'login':
                return <Login/>;
            default:
                return <ul>
                    {
                        this.state.readList && this.state.readList.map(l=>
                            <li>{l.title}</li>
                        )
                    }
                </ul>;
        }
    }

    render() {
        return <DataProvider state={this.state} api={api}>
            <div>
                <Menu menuChange={this.menuChanged}></Menu>
                <div>{this.state.name}</div>
                {this.route(this.state.pathname)}
            </div>
        </DataProvider>;
    }
}

render(<MainPage/>
    , document.getElementById('root'));


