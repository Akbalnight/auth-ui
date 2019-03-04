import React from 'react';
import PropTypes from 'prop-types';

export class PermissionCheckerProvider extends React.Component{
    constructor(props, context){
        super(...arguments);
        this.context = context;
        this.permissionChecker = props.permissionChecker;
    }

    static childContextTypes = {
        permissionChecker: PropTypes.object.isRequired,
    }

    getChildContext(){
        return {
            permissionChecker: this.permissionChecker
        }
    }
    render(){
        return this.props.children;
    }
}