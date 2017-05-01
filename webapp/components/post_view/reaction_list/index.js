// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getReactionsForPost} from 'mattermost-redux/selectors/entities/posts';
import {getCustomEmojisAsMap} from 'mattermost-redux/selectors/entities/emojis';

import * as Actions from 'mattermost-redux/actions/posts';

import ReactionList from './reaction_list.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        reactions: getReactionsForPost(state, ownProps.post.id),
        emojis: getCustomEmojisAsMap(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getReactionsForPost: Actions.getReactionsForPost
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactionList);
