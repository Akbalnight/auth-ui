const getAuth = obj => obj ? obj.auth : {};

const checker = (state = {}, permission) => {
    const {permissions = {}} = state;
    return permissions[permission]
};

const combinePath = (a, b) => a ? `${a}.${b}` : b;

const recursiveCacheGenerator = (state, tree, path = null, cache) => {
  if (Array.isArray(tree)) {
    cache[path] = tree.map(p =>
      (state.permissions && state.permissions[p]) ||
      (Array.isArray(state.roles) && state.roles.includes(p))
    ).some(p => p);

    return cache[path];
  } else if (typeof tree === 'object') {
    const keys = Object.keys(tree);
    const childrenCan = keys.map(key =>
      recursiveCacheGenerator(state, tree[key], combinePath(path, key), cache)
    ).some(p => p);

    if (path)
      cache[path] = childrenCan;

    return childrenCan;
  }

  return false;
};

const updatePermissionsCache = (state, tree) => {
  if (state) {
    const cache = {};
    recursiveCacheGenerator(state, tree, '', cache);
    return cache;
  }
  return {};
};

export class PermissionChecker{
    constructor(reduxStore, permissionsTreeMapping = {}){
        const updateState = () => {
            this.state = getAuth(reduxStore.getState());
            this.cache = updatePermissionsCache(this.state, permissionsTreeMapping);
        };

        updateState();
        reduxStore.subscribe(updateState);
    }

    hasPermission(permission) {
      return !!checker(this.state, permission);
    }

    hasInternalRole(role) {
      return !!this.cache[role]
    }

    has(permission) {
        return this.hasInternalRole(permission) || this.hasPermission(permission);
    }
}
