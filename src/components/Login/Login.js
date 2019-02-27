import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { authRequestStart, authRequestResult } from "../../actions";
import { doAuthRequest } from "./authUtils";
import { ReactComponent as Logo } from './Logo.svg'

import 'antd/dist/antd.css';
import './Login.css';

const FormItem = Form.Item;

class Login extends React.Component {
    static propTypes = {
        loginUrl: PropTypes.string,
        logoutUrl: PropTypes.string,
        checkServices: PropTypes.function,
        services_esb: PropTypes.boolean,
        version_info: PropTypes.string,
        dummy_login_data: PropTypes.object,
        logo: PropTypes.object
      }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.doRequest(values);
            }
        });
    };

    doRequest = (values) => {

        if (this.props.dummy_login_data) {
            this.props.authRequestResult(this.props.dummy_login_data);
            return {};
        }

        if (!this.props.loginUrl) {
            console.error('auth-ui/Login: Не указан URL для входа.');
            return {};
        }
        if (!this.props.logoutUrl) {
            console.error('auth-ui/Login: Не указан URL для выхода.');
            return {};
        }

        this.props.authRequestStart();
        let self = this;

        doAuthRequest({
            loginUrl: this.props.loginUrl,
            logoutUrl: this.props.logoutUrl,
            username: values.username,
            password: values.password,
            onSuccess: (value) => {self.props.authRequestResult(value)},
            onError: () => {self.props.authRequestResult(null)},
            checkServices: this.props.checkServices,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='login-center'>
                {this.props.services_esb ?
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <div className='logo'>
                        {this.props.logo || <Logo />}
                    </div>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Введите имя пользователя' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Имя пользователя" disabled={this.props.services_esb?'':'disabled'}/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Введите пароль' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  type="password" placeholder="Пароль" disabled={this.props.services_esb?'':'disabled'} />
                        )}
                    </FormItem>

                    <FormItem className="login-form-item-button">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Вход
                        </Button>
                    </FormItem>
                </Form> :
                    <p style={{color: '#0167bb', fontSize: '16px', fontWeight: 'bold'}}>Система временно недоступна</p> }


                <p>{this.props.version_info}</p>
            </div>
        );
    }

}

const mapStateToProps = (store) => ({
    auth: store.auth,
});

export default connect(mapStateToProps, {authRequestStart, authRequestResult})(Form.create()(Login));
