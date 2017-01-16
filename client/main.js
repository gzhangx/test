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
        api.getReadList().then(res=> {
            console.log('got res for consturctor api get');
            console.log(res);
            this.setState({schedule: res.data.schedule});
        });
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
           this.setState({schedule: res.data.schedule});
        });
    }
    route(urlHash) {
        switch (urlHash) {
            case 'login':
                return <Login/>;
            default:
                return <table><tbody>
                    {
                        this.state.schedule && this.state.schedule.map((l,i)=>
                            <tr key={i}>{l.map((r,j)=>
                                <td key={j}>{r}</td>
                            )}</tr>
                        )
                    }
                </tbody></table>;
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


