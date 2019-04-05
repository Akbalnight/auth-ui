import * as types from '../constants/actionTypes';

const initialState = {
    loading: false,
    loggedIn: false,
    username: null,
    roles: [],
    permissions: {}
};


const auth = (state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_REQUEST_START:
            return Object.assign({}, initialState, {loading: true});
        case types.AUTH_REQUEST_RESULT:
            if (action.result) {
                let permissions = {};
                action.result.roles.forEach(r => r.permissions.forEach(p => {
                    permissions[p.path.replace(/\/+$/, "") + ':' + p.method] = true;
                }));
                const userData = action.result.jsonData;
                return {
                    loading: false,
                    loggedIn: true,
                    username: action.result.name,
                    email: action.result.email,
                    avatarUrl: userData && 'avatarUrl' in userData ? userData.avatarUrl : null,
                    firstName: userData && 'firstName' in userData ? userData.firstName : null,
                    middleName: userData && 'middleName' in userData ? userData.middleName : null,
                    lastName: userData && 'lastName' in userData ? userData.lastName : null,
                    position: userData && 'position' in userData ? userData.position : null,
                    phone: userData && 'phone' in userData ? userData.phone : null,
                    permissions: permissions,
                    roles: action.result.roles.map(r => r.name)
                };
            } else {
                return {
                    loading: false,
                    loggedIn: false,
                    username: null,
                    permissions: {},
                    roles: []
                };
            }
        default:
            return state;
    }
};

export default auth;
