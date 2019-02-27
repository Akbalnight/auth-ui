import React, { Component } from 'react'

import { Login, CheckAccess } from 'auth-ui';

export default class App extends Component {
    render () {
        return (
        <div>
            <CheckAccess permission='/LoginPage/RedDiv:GET'>
                <div style={{ width: '100%', height: 100, background: 'red' }} />
            </CheckAccess>
            <Login
                loginUrl={null}
                logoutUrl={null}
                services_esb={true}
                version_info={'Пример использования Login-компоненты. Версия 0.0.1 от 25.02.2019'} />
        </div>
        )
    }
}
