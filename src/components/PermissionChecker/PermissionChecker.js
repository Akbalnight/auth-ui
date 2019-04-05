const getAuth = obj => obj ? obj.auth : {};

const checker = (state = {}, permission) => {
    const {permissions = {}} = state;
    return permissions[permission]
};

export class PermissionChecker{
    constructor(reduxStore){
        this.state = getAuth(reduxStore.getState());
        reduxStore.subscribe(() => {
            this.state = getAuth(reduxStore.getState());
        })
    }
    has(permission) {
        return checker(this.state, permission);
    }
}
