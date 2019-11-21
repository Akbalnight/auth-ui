import * as types from '../constants/actionTypes';

const initialState = {
    loading: false,
    loggedIn: false,
    username: null,
    roles: [],
    permissions: {}
};
const getResultForToken = res => {
  const permissions ={};
  const roles =res.roles.split(', ');
  roles[0] = roles[0].slice(1);
  roles[roles.length-1] =  roles[0].slice(0, roles.length-1);
  return {
    loading: false,
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    loggedIn: true,
    id: res.userId,
    username: res.username || null,
    email: res.email || '',
    avatarUrl:  res.avatarUrl || null,
    firstName:  res.firstName || null,
    middleName:  res.middleName || null,
    lastName: res.lastName || null,
    position:  res.position || null,
    phone:  res.phone || null,
    permissions:  res.permissions.forEach(p => {
      permissions[p.path.replace(/\/+$/, "") + ':' + p.method] = true;
    }),
    roles
  };
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case types.AUTH_REQUEST_START:
            return Object.assign({}, initialState, {loading: true});
        case types.AUTH_REQUEST_RESULT:
            if (action.result) {
                if(action.result.access_token) {
                  return getResultForToken(action.result);
                } else {
                  let permissions = {};
                  action.result.roles.forEach(r => r.permissions.forEach(p => {
                    permissions[p.path.replace(/\/+$/, "") + ':' + p.method] = true;
                  }));
                  const userData = action.result.jsonData;
                  return {
                    loading: false,
                    loggedIn: true,
                    id: action.result.id,
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
                }
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
