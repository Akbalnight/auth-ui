import { authRequestResult } from "../../actions";
import { Modal } from 'antd';

export const doAuthRequest = ({ loginUrl, logoutUrl, username, password, onSuccess = () => {}, onError = () => {}, checkServices }) => {
    return authRequest({ loginUrl, logoutUrl, username, password, onSuccess, onError: () => {
        Modal.error({
            centered: true,
            title: 'Ошибка',
            content: 'Неправильный логин или пароль',
            onOk:() => {
                doLogoutRequest({ url: logoutUrl });
                onError()
            }
        });
    }, checkServices });
};

const authRequest = ({ loginUrl, logoutUrl, username = null, password = null, onSuccess = () => {}, onError = () => {}, checkServices }) => {
    let request = new Request(loginUrl);

    let headers = new Headers();
    headers.append('accept', '*/*');
    headers.append('Content-Type', 'application/json')
    if (username && password) {
        try {
            headers.set('Authorization', "Basic " + btoa(username.toLowerCase() + ":" + password));
        }
        catch (err) {
            return Promise.reject(getAuthError({ status: 401 }));
        }
    }

    let init = {
        method: "GET",
        headers: headers
    }

    return fetch(request, init).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            switch(response.status) {
                case 201:
                    Modal.error({
                        centered: true,
                        title: 'Ошибка',
                        content: 'Ошибка доступа к системе. Обратитесть к администратору.',
                        onOk: () => {
                            doLogoutRequest({ url: logoutUrl });
                            authRequestResult(null)
                        }
                    });
                case 423:
                    Modal.error({
                        centered: true,
                        title: 'Ошибка',
                        content: 'Пользователь c таким логином уже авторизован в системе, попробуйте войти позднее',
                        onOk: () => {
                            doLogoutRequest({ url: logoutUrl });
                            authRequestResult(null)
                        }
                    });
                case 404:
                    authRequestResult(null);
                    break;
                default:
                    onError(response);
                    break;
            }
        }
    }, function(reason) {
        console.error('on fetch error', reason);
    }).then(data => {
        if (!data) {
            return;
        }
        checkServices && checkServices();
        onSuccess(data);
    }, function(reason) {
        console.error('on json() error', reason);
    });
};

export const checkAuthRequest = (loginUrl, logoutUrl, onSuccess = () => {}, onError = () => {}) => {
    return authRequest({
        loginUrl,
        logoutUrl,
        username: null,
        password: null,
        onSuccess,
        onError,
        checkServices: null
    });
};

export const doLogoutRequest = ({ url, onSuccess = (value) => {}, onError = (value) => {} }) => {
    let request = new Request(url);

    let headers = new Headers();
    headers.append('accept', '*/*');
    headers.append('Content-Type', 'application/json;charset=UTF-8')

    let init = {
        method: "GET",
        headers: headers
    }

    return fetch(request, init).then(response => {
        if (response.ok) {
            return onSuccess(response);
        }
        else {
            switch(response.status) {
                case 401:
                    Modal.error({
                        centered: true,
                        title: 'Ошибка',
                        content: 'Необходима повторная авторизация',
                        onOk: () => {authRequestResult(null)}
                    });
                case 403:
                    Modal.error({
                        centered: true,
                        title: 'Ошибка',
                        content: 'Доступ запрещён',
                    });
                    break;
                case 423:
                    Modal.error({
                        centered: true,
                        title: 'Ошибка',
                        content: 'Пользователь c таким логином уже авторизован в системе, попробуйте войти позднее',
                        onOk: () => {authRequestResult(null)}
                    });
                case 404:
                    authRequestResult(null);
                    break;
                default:
                    onError(response);
                    break;
            }
        }
    }, function(reason) {
        console.error('on fetch error', reason);
    });
};
