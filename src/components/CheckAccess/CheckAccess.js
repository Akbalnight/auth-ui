import React from 'react';
import PropTypes from 'prop-types';
import {store_auth} from './store_auth';

class CheckAccess extends React.Component {

    static propTypes = {
        permission: PropTypes.string,
    }

    static on = permission => {
        const userPermissions = store_auth.get().permissions;
        return  userPermissions && userPermissions[permission];
    }

    render() {
        return CheckAccess.on(this.props.permission) ? this.props.children : null;
    }
}

export default CheckAccess;
