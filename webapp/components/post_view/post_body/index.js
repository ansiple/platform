// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {removePost} from 'mattermost-redux/actions/posts';

import {getUser} from 'mattermost-redux/selectors/entities/users';
import {get} from 'mattermost-redux/selectors/entities/preferences';
import {getPost} from 'mattermost-redux/selectors/entities/posts';

import {Preferences} from 'mattermost-redux/constants';

import PostBody from './post_body.jsx';

function mapStateToProps(state, ownProps) {
    let parentPostUser;
    if (ownProps.post.commentedOnPost) {
        parentPostUser = getUser(state, ownProps.post.commentedOnPost.user_id);
    }

    return {
        ...ownProps,
        parentPostUser,
        previewsCollapsed: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.COLLAPSE_DISPLAY, 'false'),
        parentPost: getPost(state, ownProps.post.root_id)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            removePost
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostBody);
