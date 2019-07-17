const getAuth = obj => obj ? obj.auth : {};

const checker = (state = {}, permission) => {
    const {permissions = {}} = state;
    return permissions[permission]
};

const combinePath = (a, b) => a ? `${a}.${b}` : b;

const recursiveCacheGenerator = (state, node, path = null, cache) => {
  if (typeof (node) === 'boolean') {
    cache[path] = node;
    return node;
  } else if (Array.isArray(node)) {
    cache[path] = node.map(p =>
      (state.permissions && state.permissions[p]) ||
      (Array.isArray(state.roles) && state.roles.includes(p))
    ).every(p => p);

    return cache[path];
  } else if (typeof node === 'object') {
    const keys = Object.keys(node);
    const childrenCan = keys.map(key =>
      recursiveCacheGenerator(state, node[key], combinePath(path, key), cache)
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
