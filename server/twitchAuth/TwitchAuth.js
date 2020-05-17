const { MenuItem, shell } = require('electron');
const uuidv4 = require('uuid').v4;
const Store = require('electron-store');

const { getPath } = require('../utils');

const redirectUrl = 'https://localhost:6750/twitchAuth/authorize';
const historyTrackerClientId = 'r606gixvsow1nuauf4sjoxctm91vcs';

class TwitchAuth {
    static get menuItem() {
        const store = new Store();
        const authenticatedTwitchUser = store.get('authenticatedTwitchUser');
        const label = authenticatedTwitchUser ? authenticatedTwitchUser.display_name : 'Login'
        //const icon = authenticatedTwitchUser ? authenticatedTwitchUser.profile_image_url : null
        return new MenuItem({
            label,
            click: () => shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=${historyTrackerClientId}&redirect_uri=${redirectUrl}&response_type=code&scope=user:read:email&state=thnksfrthmmrs`)
        });
    }

    static get logoutMenuItem() {
        const store = new Store();
        const authenticatedTwitchUser = store.get('authenticatedTwitchUser');

        return authenticatedTwitchUser ? [
            new MenuItem({
                label: 'Logout',
                click: () => store.delete('authenticatedTwitchUser')
            })
        ] : []
    }
}

module.exports = TwitchAuth;