// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {makeGetPostsInChannel} from 'mattermost-redux/selectors/entities/posts';
import {get} from 'mattermost-redux/selectors/entities/preferences';
import {getChannel, getMyChannelMember} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getPosts} from 'mattermost-redux/actions/posts';
import {Preferences} from 'utils/constants.jsx';

import PostList from './post_list.jsx';

function makeMapStateToProps() {
    const getPostsInChannel = makeGetPostsInChannel();

    return function mapStateToProps(state, ownProps) {
        return {
            channel: getChannel(state, ownProps.channelId),
            channelMember: getMyChannelMember(state, ownProps.channelId),
            posts: getPostsInChannel(state, ownProps.channelId),
            currentUserId: getCurrentUserId(state),
            fullWidth: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getPosts
        }, dispatch)
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(PostList);
