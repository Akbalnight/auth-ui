import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { LocaleProvider } from 'antd'
import ru from 'antd/lib/locale-provider/ru_RU'

import './index.css'
import App from './App'

ReactDOM.render(
    <Provider store={store}>
        <LocaleProvider locale={ru}>
            <App />
        </LocaleProvider>
    </Provider>
, document.getElementById('root'))
