import React from 'react';
import {checkPermissionConnector} from './connect';

class SecuredComponentHOC extends React.Component {
    render() {
        return this.props.permissionChecker.has(this.props.permission)
            ? this.props.children
            : null;
    }
}

export default checkPermissionConnector(SecuredComponentHOC);