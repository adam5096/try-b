const common = `
  --import features/step_definitions/**/*.ts
  --import features/support/**/*.ts
  --format summary
  --format progress-bar
  --loader ts-node/esm
`;

module.exports = {
  default: `${common} features/**/*.feature`
};
