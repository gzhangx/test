import React from 'react';
import {render} from 'react-dom';
import Menu from './components/topmenu/index.jsx';
import DataProvider from './DataProvider.jsx';


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
    }
    render() {
        return <DataProvider state={this.state} api={this.state}>
            <div>
                <Menu menuChange={this.menuChanged}></Menu>
                <div>{this.state.name}</div>
            </div>
        </DataProvider>;
    }
}

render(<MainPage/>
    , document.getElementById('root'));


