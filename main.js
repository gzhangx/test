import React from 'react';
import {render} from 'react-dom';
import Menu from './components/topmenu/index.jsx';
import DataProvider from './DataProvider.jsx';
import api from './api.js';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.menuChanged = this.menuChanged.bind(this);
        this.state = {
            name: 'state name'
        }
    }

    menuChanged(val) {
        this.setState({name: val.key});
        api.getReadList().then(res=> {
            console.log(res);
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
            </div>
        </DataProvider>;
    }
}

render(<MainPage/>
    , document.getElementById('root'));


