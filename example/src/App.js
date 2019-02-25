import React, { Component } from 'react'

import { Login } from 'auth-ui';

export default class App extends Component {
    render () {
        return (
        <div>
            <Login
                loginUrl={null}
                logoutUrl={null}
                services_esb={true}
                version_info={'Пример использования Login-компоненты. Версия 0.0.1 от 25.02.2019'} />
        </div>
        )
    }
}
