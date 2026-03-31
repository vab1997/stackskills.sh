export function mergeDependencies(deps = {}, devDeps = {}) {
  return [...Object.keys(deps), ...Object.keys(devDeps)];
}
