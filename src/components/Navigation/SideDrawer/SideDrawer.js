import React from 'react';
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";

import classes from './SideDrawer.css';
import Backdrop from "../../ui/Backdrop/Backdrop";
import Aux from "../../../hoc/Aux/Aux";
const sideDrawer = (props) => {
    const attachedClasses = [classes.SideDrawer,classes.Close];

    if(props.open){
        attachedClasses[1] = classes.Open;
    }

    return (
        <Aux>
        <Backdrop show={props.open} clicked={props.closed} />
        <div className={attachedClasses.join(" ")}>
            <div className={classes.Logo}><Logo/></div>
            <nav>
                <NavigationItems/>
            </nav>
        </div>
        </Aux>
    );

};


export default sideDrawer;