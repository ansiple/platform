// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCurrentUserId, makeGetProfilesForReactions} from 'mattermost-redux/selectors/entities/users';
import {getMissingProfilesByIds} from 'mattermost-redux/actions/users';
import {addReaction, removeReaction} from 'mattermost-redux/actions/posts';
import {getEmojiImageUrl} from 'mattermost-redux/utils/emoji_utils';

import Reaction from './reaction.jsx';

function makeMapStateToProps() {
    const getProfilesForReactions = makeGetProfilesForReactions();

    return function mapStateToProps(state, ownProps) {
        const profiles = getProfilesForReactions(state, ownProps.reactions);

        return {
            ...ownProps,
            profiles,
            otherUsers: ownProps.reactions.length - profiles.length,
            currentUserId: getCurrentUserId(state),
            emojiImageUrl: getEmojiImageUrl(ownProps.emojis.get(ownProps.emojiName))
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addReaction,
            removeReaction,
            getMissingProfilesByIds
        }, dispatch)
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(Reaction);
