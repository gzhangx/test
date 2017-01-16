import React from 'react';
import get from 'lodash/get';


//function textRender(state, item, setState){
//    return <input type="text" id={item.id} value={get(state, item.path)} onChange={evt=>setState(item.path, evt.target.value)} />
//}
/*
class Form extends React.ReactComponent {
    constructor(props) {
        super(props);
        this.state = props.initialState || {};
    }


    render() {
        return <table>
            <tbody>
            {this.props.formFields.map(fr=><tr>
                <td>{fr.text}</td>
                <td><textRender state={this.state} item={fr} setState={this.setState} /></td>
            </tr>)}
            </tbody>
        </table>;
    }
}

export default Form;
    */