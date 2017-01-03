import React from 'react';
import Menu, {SubMenu, Item as MenuItem} from 'rc-menu';
import 'rc-menu/assets/index.css';

function onOpenChange(value) {
}
function TopMenu(props) {

    return <Menu mode='horizontal' onSelect={props.menuChange} onOpenChange={onOpenChange}>
        <MenuItem>Veda</MenuItem>
        <SubMenu title="Login">
            <MenuItem key='login'>Login</MenuItem>
        </SubMenu>
    </Menu>;
}

export default TopMenu;