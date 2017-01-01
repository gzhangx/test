import React from 'react';
import Menu, {SubMenu, Item as MenuItem} from 'rc-menu';
import 'rc-menu/assets/index.css';
function onSelect(val) {
    console.log(val);
}
function onOpenChange(value) {
}
function TopMenu(){
 return <Menu mode='horizontal' onSelect={onSelect} onOpenChange={onOpenChange}>
     <MenuItem>Veda</MenuItem>
     <SubMenu title="Login">
         <MenuItem>Login</MenuItem>
     </SubMenu>
 </Menu>;
}

export default TopMenu;