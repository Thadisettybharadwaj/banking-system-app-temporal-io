import * as rules from '@commitlint/rules';
import * as conventional from '@commitlint/config-conventional';

const ignoreCommit = (parsed) => {
  // don't lint release commits
  return parsed.type === 'chore' && parsed.scope === 'release';
};

const getAllowedTypes = () => {
  const targetBranch = process.env.GITHUB_BASE_REF;
  const typeEnum = conventional.default.rules['type-enum'][2];
  if (targetBranch?.startsWith('release/') || targetBranch?.startsWith('hotfix/')) {
    return typeEnum.filter((type) => !type.startsWith('feat'));
  }
  return typeEnum;
};

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'reference-empty': [2, 'never'],
    'type-enum': [2, 'always', getAllowedTypes()],
  },
  plugins: [
    {
      rules: {
        'reference-empty': (parsed, when) => {
          if (ignoreCommit(parsed)) {
            return [true];
          }
          const { subject } = parsed;
          const hasReference = /[A-Za-z0-9]+-\d+/.test(subject);
          const hasNoIssue = /NOISSUE/i.test(subject);
          return [
            (when === 'never') === (hasNoIssue || hasReference),
            `commit message Jira tickets (e.g., ABC-1234) must ${when} be empty`,
          ];
        },
        'body-max-line-length': (parsed, _when, _value) => {
          if (ignoreCommit(parsed)) {
            return [true];
          }
          return rules.default['body-max-line-length'](parsed, _when, _value);
        },
      },
    },
  ],
};
