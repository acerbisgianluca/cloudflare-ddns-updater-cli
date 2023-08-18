const packageJson = require('../package.json');

/** @type {import('@changesets/types').GetVersionMessage} */
const getVersionMessage = async (plan) => {
    const release = plan.releases.find((release) => release.name === packageJson.name);

    if (release) {
        return `chore(release): bump version to v${release.newVersion}`;
    } else {
        return 'chore(release): no publish';
    }
};

/** @type {import('@changesets/types').CommitFunctions} */
module.exports = {
    getVersionMessage,
};
