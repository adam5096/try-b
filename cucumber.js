const common = `
  --require features/step_definitions/**/*.ts
  --require features/support/**/*.ts
  --format summary
  --format progress-bar
  --publish-quiet
`;

module.exports = {
  default: `${common} features/**/*.feature`
};
