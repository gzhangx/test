import React from 'react';
//import {connect} from 'react-redux';


class DataProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;
    }
    getChildContext() {
        return {
            api: this.props.api
        };
    }

    render() {
        return this.props.children;
    }
}

DataProvider.childContextTypes = {
    api: React.PropTypes.object,
    state: React.PropTypes.object
};

//function mapStateToProps(state, props) {return {...props,};}
//export default connect(mapStateToProps)(DataProvider);

export default DataProvider;