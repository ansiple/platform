// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {getCurrentUser, getUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';
import {get, getBool} from 'mattermost-redux/selectors/entities/preferences';

import {Preferences} from 'mattermost-redux/constants';

import Post from './post.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        user: getUser(state, ownProps.post.user_id),
        status: getStatusForUserId(state, ownProps.post.user_id),
        currentUser: getCurrentUser(state),
        shouldHighlight: false,
        displayNameType: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, 'name_format', 'false'),
        center: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_CENTERED,
        compactDisplay: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.MESSAGE_DISPLAY, Preferences.MESSAGE_DISPLAY_DEFAULT) === Preferences.MESSAGE_DISPLAY_COMPACT,
        previewsCollapsed: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.COLLAPSE_DISPLAY, 'false'),
        useMilitaryTime: getBool(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.USE_MILITARY_TIME, false),
        isFlagged: getBool(state, Preferences.CATEGORY_FLAGGED_POST, ownProps.post.id)
    };
}

export default connect(mapStateToProps)(Post);
