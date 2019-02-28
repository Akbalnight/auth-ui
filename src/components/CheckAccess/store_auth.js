let _store_auth = {};

const get = () => _store_auth;
const set = (newAuth) => {
    _store_auth = {
        ..._store_auth,
        ...newAuth,
    }
}

const store_auth = { get, set };

export { store_auth };
