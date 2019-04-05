import React, {Component} from 'react';
import PropTypes from 'prop-types';

export const checkPermissionConnector = (WrappedComponent) => {
    class Connect extends Component{
        render() {
            return<WrappedComponent
                permissionChecker={this.context.permissionChecker}
                {...this.props}
            />
        }
    }
    Connect.contextTypes = {
        permissionChecker: PropTypes.object
    };
    return Connect;
}
