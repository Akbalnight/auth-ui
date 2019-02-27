import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CheckAccess extends React.Component {
    static propTypes = {
        permission: PropTypes.string,
    }

    render() {
        if (this.props.userPermissions[this.props.permission]) {
            return this.props.children;
        }
        return null;
    }
}

const mapStateToProps = (store) => ({
    userPermissions: store.auth.permissions,
})

export default connect(mapStateToProps)(CheckAccess);
