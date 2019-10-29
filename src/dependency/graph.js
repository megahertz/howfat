'use strict';

module.exports = {
  flat,
  mapAsync,
};

/**
 * @param {Dependency} dependency
 * @param {Set<Dependency>} flattenItems For internal usage
 * @return {Set<Dependency>}
 */
function flat(dependency, flattenItems = new Set()) {
  dependency.children.forEach((dep) => {
    dep = dep.getOriginal();
    if (!flattenItems.has(dep.getOriginal())) {
      flattenItems.add(dep);
      flat(dep, flattenItems);
    }
  });

  return flattenItems;
}

/**
 * @param {Dependency} dependency
 * @param {MapDependencyCallback} callback
 * @return {Promise<Dependency>}
 */
async function mapAsync(dependency, callback) {
  dependency = await callback(dependency, 0, null);

  let list = dependency.children
    .map((child, index) => ({ parent: dependency, child, index }));

  while (list.length > 0) {
    const nextList = [];

    const promises = list.map(({ child, index, parent }) => {
      return callback(child, index, parent)
        .then((newChild) => {
          parent.children[index] = newChild;
          child.children.forEach((c, i) => {
            nextList.push({ child: c, index: i, parent: child });
          });
        });
    });

    await Promise.all(promises);
    list = nextList;
  }

  return dependency;
}
