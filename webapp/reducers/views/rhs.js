// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {combineReducers} from 'redux';
import {ActionTypes} from 'utils/constants.jsx';

function selectedPostId(state = null, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_POST_SELECTED:
        return action.postId;
    default:
        return state;
    }
}

function fromSearch(state = false, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_POST_SELECTED:
        return action.from_search;
    default:
        return state;
    }
}

function fromFlaggedPosts(state = false, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_POST_SELECTED:
        return action.from_flagged_posts;
    default:
        return state;
    }
}

function fromPinnedPosts(state = false, action) {
    switch (action.type) {
    case ActionTypes.RECEIVED_POST_SELECTED:
        return action.from_pinned_posts;
    default:
        return state;
    }
}

export default combineReducers({
    selectedPostId,
    fromSearch,
    fromFlaggedPosts,
    fromPinnedPosts
});
