import React, {Component} from "react";
import {BackHandler} from "react-native";
import {Actions} from "react-native-router-flux";

class AppNavigation extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        console.log("????????????",this.props.children)
        //listens to hardwareBackPress
        BackHandler.addEventListener('hardwareBackPress', () => {
            try {
                Actions.pop();
                return true;
            }
            catch (err) {
                console.debug("Can't pop. Exiting the app...");
                return false;
            }
        });
    }

    componentWillUnmount(){
        console.log("Unmounting app, removing listeners");
        BackHandler.removeEventListener('hardwareBackPress');
    }

    render() {
        return this.props.children;
    }
}

export default AppNavigation;