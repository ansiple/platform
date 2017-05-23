// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {getCustomEmojisAsMap} from 'mattermost-redux/selectors/entities/emojis';
import {getBool} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserMentionKeys, getUsersByUsername} from 'mattermost-redux/selectors/entities/users';

import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {Preferences} from 'mattermost-redux/constants';
import {getSiteURL} from 'utils/url.jsx';

import PostMessageView from './post_message_view.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        emojis: getCustomEmojisAsMap(state),
        enableFormatting: getBool(state, Preferences.CATEGORY_ADVANCED_SETTINGS, 'formatting', true),
        mentionKeys: getCurrentUserMentionKeys(state),
        usernameMap: getUsersByUsername(state),
        team: getCurrentTeam(state),
        siteUrl: getSiteURL()
    };
}

export default connect(mapStateToProps)(PostMessageView);
