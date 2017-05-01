// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {removePost, flagPost, unflagPost, pinPost, unpinPost, addReaction} from 'mattermost-redux/actions/posts';

import {canDeletePost} from 'utils/post_utils.jsx';

import PostInfo from './post_info.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        canDelete: canDeletePost(ownProps.post)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            removePost,
            flagPost,
            unflagPost,
            pinPost,
            unpinPost,
            addReaction
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostInfo);
