// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import UserProfile from 'components/user_profile.jsx';
import PostInfo from './post_info';
import {FormattedMessage} from 'react-intl';

import * as PostUtils from 'utils/post_utils.jsx';

import Constants from 'utils/constants.jsx';

import React from 'react';
import PropTypes from 'prop-types';

export default class PostHeader extends React.PureComponent {
    static propTypes = {
        post: PropTypes.object.isRequired,
        user: PropTypes.object,
        handleCommentClick: PropTypes.func.isRequired,
        handleDropdownOpened: PropTypes.func.isRequired,
        compactDisplay: PropTypes.bool,
        displayNameType: PropTypes.string,
        useMilitaryTime: PropTypes.bool.isRequired,
        isFlagged: PropTypes.bool.isRequired,
        status: PropTypes.string,
        isBusy: PropTypes.bool,
        lastPostCount: PropTypes.number
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const post = this.props.post;
        const isSystemMessage = PostUtils.isSystemMessage(post);

        let userProfile = (
            <UserProfile
                user={this.props.user}
                displayNameType={this.props.displayNameType}
                status={this.props.status}
                isBusy={this.props.isBusy}
            />
        );
        let botIndicator;
        let colon;

        if (post.props && post.props.from_webhook) {
            if (post.props.override_username && global.window.mm_config.EnablePostUsernameOverride === 'true') {
                userProfile = (
                    <UserProfile
                        user={this.props.user}
                        overwriteName={post.props.override_username}
                        disablePopover={true}
                    />
                );
            } else {
                userProfile = (
                    <UserProfile
                        user={this.props.user}
                        displayNameType={this.props.displayNameType}
                        disablePopover={true}
                    />
                );
            }

            botIndicator = <li className='bot-indicator'>{Constants.BOT_NAME}</li>;
        } else if (isSystemMessage) {
            userProfile = (
                <UserProfile
                    user={{}}
                    overwriteName={
                        <FormattedMessage
                            id='post_info.system'
                            defaultMessage='System'
                        />
                    }
                    overwriteImage={Constants.SYSTEM_MESSAGE_PROFILE_IMAGE}
                    disablePopover={true}
                />
            );
        }

        if (this.props.compactDisplay) {
            colon = (<strong className='colon'>{':'}</strong>);
        }

        return (
            <ul className='post__header'>
                <li className='col col__name'>{userProfile}{colon}</li>
                {botIndicator}
                <li className='col'>
                    <PostInfo
                        post={post}
                        handleCommentClick={this.props.handleCommentClick}
                        handleDropdownOpened={this.props.handleDropdownOpened}
                        compactDisplay={this.props.compactDisplay}
                        useMilitaryTime={this.props.useMilitaryTime}
                        isFlagged={this.props.isFlagged}
                        lastPostCount={this.props.lastPostCount}
                    />
                </li>
            </ul>
        );
    }
}
