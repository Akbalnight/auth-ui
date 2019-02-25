import $ from "jquery";
import { authRequestResult } from "../actions";
import {Modal} from 'antd';

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
    let request = {
        url: loginUrl,
        method: "GET",
        contentType: "application/json",
        headers:{ "accept":"*/*" }
    };

    if (username && password) {
        request.beforeSend = xhr => xhr.setRequestHeader("Authorization", "Basic " + btoa(username.toLowerCase() + ":" + password));
        // $.ajax({ url: '/api/monitoring/audit', method: 'POST', contentType: "application/json;charset=UTF-8", headers:{ "accept":"*/*" }, data: JSON.stringify({ uname: btoa(username), pwd: btoa(password) }) });
    }

    return $.ajax(request).done((data, textStatus, jqXHR) => {
        checkServices && checkServices();
        if (jqXHR.status === 201) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Ошибка доступа к системе. Обратитесть к администратору.',
                onOk: () => {
                    doLogoutRequest({ url: logoutUrl });
                    authRequestResult(null)
                }
            });
        } else {
            onSuccess(data, textStatus, jqXHR);
        }
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.error('on ajax error', jqXHR, textStatus, errorThrown);
        var self = this;
        if (jqXHR.status === 404) {
            authRequestResult(null)
        }
        else if (jqXHR.status === 423) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Пользователь c таким логином уже авторизован в системе, попробуйте войти позднее',
                onOk: () => {
                    doLogoutRequest({ url: logoutUrl });
                    authRequestResult(null)
                }
            });
        }
        else if (jqXHR.status === 201) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Ошибка доступа к системе. Обратитесть к администратору.',
                onOk: () => {
                    doLogoutRequest({ url: logoutUrl });
                    authRequestResult(null)
                }
            });
        }
        else {
            onError(jqXHR, textStatus, errorThrown);
        }
    });
};

export const doLogoutRequest = ({ url, onSuccess = (value) => {}, onError = (value) => {} }) => {
    return doRequest({ url, method: 'GET', onSuccess, onError });
};

export function doRequest({ url, method = 'GET', onSuccess = () => {}, onError = () => {}, data }){
    let dataValue = data != null && typeof data === 'object' ? JSON.stringify(data) : data;
    return $.ajax(
        {
            url,
            method,
            contentType: "application/json;charset=UTF-8",
            headers:{ "accept":"*/*" },
            data: dataValue
        }
    ).done((data, textStatus, jqXHR) => {
        onSuccess(data, textStatus, jqXHR);
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.error('ajax error', jqXHR, textStatus, errorThrown);
        if (jqXHR.status === 401) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Необходима повторная авторизация',
                onOk: () => {authRequestResult(null)}
            });
        } else if (jqXHR.status === 403) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Доступ запрещён',
            });
        } else if (jqXHR.status === 423) {
            Modal.error({
                centered: true,
                title: 'Ошибка',
                content: 'Пользователь c таким логином уже авторизован в системе, попробуйте войти позднее',
                onOk: () => {authRequestResult(null)}
            });
        } else if (jqXHR.status === 200) { onSuccess(data, textStatus, jqXHR);
        } else if (jqXHR.status === 201) { onSuccess(data, textStatus, jqXHR);
        } else { onError(jqXHR, textStatus, errorThrown); }
    });
};
