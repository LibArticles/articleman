module.exports = {
  name: 'plugin-ignore-add-options',
  factory: () => {
    if (process.argv.includes('add')) {
      // List all Yarn v3 `add` command options
      const validOptions = [
        '--json',
        '-E',
        '--exact',
        '-T',
        '--tilde',
        '-C',
        '--caret',
        '-D',
        '--dev',
        '-P',
        '--peer',
        '-O',
        '--optional',
        '--prefer-dev',
        '-i',
        '--interactive',
        '--cached',
        '--mode',
      ];

      process.argv = process.argv
        .map((arg, i) => {
          if (
            i === 0 ||
            i === 1 ||
            validOptions.includes(arg) ||
            !arg.startsWith('-')
          ) {
            return arg;
          }

          return null;
        })
        .filter(Boolean);
    }

    return {};
  },
};
