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
        api.getReadList().then(res=> {
           this.setState({readList: res.data});
        });
    }
    render() {
        return <DataProvider state={this.state} api={api}>
            <div>
                <Menu menuChange={this.menuChanged}></Menu>
                <Router history={browserHistory}>
                    <Route path="/" component={NoCmp('default')}>
                        <Route path="/login" component={NoCmp('login')}/>
                        <Route path="/users" component={NoCmp('users')}>
                            <Route path="/user/:userId" component={NoCmp('usersid')}/>
                        </Route>
                        <Route path="*" component={NoCmp('star')}/>
                    </Route>
                </Router>
                <div>{this.state.name}</div>
                <ul>
                {
                    this.state.readList && this.state.readList.map(l=>
                        <li>{l.title}</li>
                    )
                }
                </ul>
            </div>
        </DataProvider>;
    }
}

render(<MainPage/>
    , document.getElementById('root'));


