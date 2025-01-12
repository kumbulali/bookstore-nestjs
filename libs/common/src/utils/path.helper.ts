import * as path from 'path';

export const getI18nPath = (): string => {
  return path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production'
      ? 'dist/libs/common/i18n'
      : 'libs/common/i18n',
  );
};
