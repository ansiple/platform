// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {removePost} from 'mattermost-redux/actions/posts';

import {getUser} from 'mattermost-redux/selectors/entities/users';

import PostBody from './post_body.jsx';

function mapStateToProps(state, ownProps) {
    let parentPostUser;
    if (ownProps.post.commentedOnPost) {
        parentPostUser = getUser(state, ownProps.post.commentedOnPost.user_id);
    }

    return {
        ...ownProps,
        parentPostUser
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
