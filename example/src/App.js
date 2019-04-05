import React, { Component } from 'react'
import {Login,  checkPermissionConnector, SecuredHOC} from 'auth-ui';

class App extends Component {
    isPermitted = route => this.props.permissionChecker.has(route);
    render () {
        return (
        <div>
            <SecuredHOC permission='/LoginPage/RedDiv:GET'>
                <div style={{ width: '100%', height: 100, background: 'red' }} />
            </SecuredHOC>
            <Login
                loginUrl={null}
                logoutUrl={null}
                services_esb={true}
                version_info={'Пример использования Login-компоненты. Версия 0.0.2 от 05.04.2019'} />
        </div>
        )
    }
}

export default checkPermissionConnector(App);
