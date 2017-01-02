import React from 'react';
import {render} from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import Menu from './components/topmenu/index.jsx';
import DataProvider from './DataProvider.jsx';
import api from './api.js';

function NoCmp(data) {
    return ()=><div>{data || 'NoCmp'}</div>
}
class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.menuChanged = this.menuChanged.bind(this);
        this.state = {
            name: 'state name'
        }
    }

    menuChanged(val) {
        browserHistory.push('/'+val.key);
        this.setState({name: val.key});
        if (val.key == 'login') {
            this.setState({readList: null});
        }else
        api.getReadList().then(res=> {
           this.setState({readList: res.data});
        });
    }
    render() {
        return <DataProvider state={this.state} api={api}>
            <div>
                <Menu menuChange={this.menuChanged}></Menu>
                <div>{this.state.name}</div>
                <ul>
                {
                    this.state.readList && this.state.readList.map(l=>
                        <li>{l.title}</li>
                    )
                }
                </ul>
                <Link  to='login'>Login</Link>
                {this.props.children}
            </div>
        </DataProvider>;
    }
}

render(<Router history={browserHistory}>
        <Route path="/" component={MainPage}>
            <Route path="login" component={NoCmp('loginroute')}/>
        </Route>
    </Router>
    , document.getElementById('root'));


