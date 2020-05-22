const { MenuItem, shell } = require('electron');
const uuidv4 = require('uuid').v4;
const Store = require('electron-store');

const { getPath } = require('../utils');

const historyTrackerClientId = 'r606gixvsow1nuauf4sjoxctm91vcs';

class TwitchAuth {
    static get Store() {
        return new Store({ name: 'lor_history_tracker' })
    }

    static get redirectUrl() {
        return 'http://127.0.0.1:6750/twitchAuth/authorize';
    }

    static get menuItem() {
        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        const label = authenticatedTwitchUser.displayName ? `Connected to Twitch as ${authenticatedTwitchUser.displayName}` : 'Connect to Twitch'
        return new MenuItem({
            label,
            click: () => authenticatedTwitchUser.displayName
            ? () => {}
            : shell.openExternal(`https://id.twitch.tv/oauth2/authorize?client_id=${historyTrackerClientId}&redirect_uri=${TwitchAuth.redirectUrl}&response_type=code&scope=user:read:email&state=thnksfrthmmrs`)
        });
    }

    static get authenticatedTwitchUser() {
        const store = TwitchAuth.Store;
        const authenticatedTwitchUser = store.get('authenticatedTwitchUser');

        return authenticatedTwitchUser ? {
            id: authenticatedTwitchUser.id,
            login: authenticatedTwitchUser.login,
            displayName: authenticatedTwitchUser.display_name,
            type: authenticatedTwitchUser.type,
            broadcasterType: authenticatedTwitchUser.broadcaster_type,
            description: authenticatedTwitchUser.description,
            profileImageUrl: authenticatedTwitchUser.profile_image_url,
            offlineImageUrl: authenticatedTwitchUser.offline_image_url,
            viewCount: authenticatedTwitchUser.view_count,
            email: authenticatedTwitchUser.email,
            accessToken: authenticatedTwitchUser.accessToken,
            refreshToken:  authenticatedTwitchUser.refreshToken
        } : {}
    }

    static get logoutMenuItem() {
        const authenticatedTwitchUser = TwitchAuth.authenticatedTwitchUser;

        return authenticatedTwitchUser.id ? [
            new MenuItem({
                label: 'Disconnect from Twitch',
                click: () => TwitchAuth.removeUserIfExists()
            })
        ] : []
    }

    static removeUserIfExists = () => {
        const store = TwitchAuth.Store;
        
        if(store.has('authenticatedTwitchUser')) {
            store.delete('authenticatedTwitchUser');
        }
    }

    static updateAuthenticatedUser = (newUserPropsToSpread) => {
        const store = TwitchAuth.Store;

        const authenticatedTwitchUser = store.get('authenticatedTwitchUser');

        const updatedUser = authenticatedTwitchUser ? { ...authenticatedTwitchUser, ...newUserPropsToSpread} : { ...newUserPropsToSpread }
        store.set('authenticatedTwitchUser', updatedUser);
    }
}

module.exports = TwitchAuth;