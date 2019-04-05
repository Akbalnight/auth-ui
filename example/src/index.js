import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { LocaleProvider } from 'antd'
import ru from 'antd/lib/locale-provider/ru_RU'
import {PermissionChecker, PermissionCheckerProvider} from 'auth-ui';
import './index.css'
import App from './App'

const permissionChecker = new PermissionChecker(store);
ReactDOM.render(
    <Provider store={store}>
      <PermissionCheckerProvider permissionChecker={permissionChecker}>
          <LocaleProvider locale={ru}>
              <App />
          </LocaleProvider>
      </PermissionCheckerProvider>
    </Provider>
, document.getElementById('root'))
