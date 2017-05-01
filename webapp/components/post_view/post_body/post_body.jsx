// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as Utils from 'utils/utils.jsx';
import * as PostUtils from 'utils/post_utils.jsx';
import Constants from 'utils/constants.jsx';
import CommentedOnFilesMessageContainer from 'components/post_view/commented_on_files_message_container';
import FileAttachmentListContainer from 'components/file_attachment_list_container.jsx';
import PostBodyAdditionalContent from 'components/post_view/post_body_additional_content.jsx';
import PostMessageContainer from 'components/post_view/post_message_view';
import ReactionListContainer from 'components/post_view/reaction_list';

import {FormattedMessage} from 'react-intl';

import React from 'react';
import PropTypes from 'prop-types';

export default class PostBody extends React.PureComponent {
    static propTypes = {

        /**
         * The post to render the body of
         */
        post: PropTypes.object.isRequired,

        /**
         * The poster of the parent post, if exists
         */
        parentPostUser: PropTypes.object,

        /**
         * The function called when the comment icon is clicked
         */
        handleCommentClick: PropTypes.func.isRequired,

        /**
         * Set to render post body compactly
         */
        compactDisplay: PropTypes.bool,

        /**
         * Set to collapse image and video previews
         */
        previewCollapsed: PropTypes.string,

        /**
         * The post count used for selenium tests
         */
        lastPostCount: PropTypes.number,

        actions: PropTypes.shape({

            /**
             * The function to delete the post
             */
            removePost: PropTypes.func.isRequired
        }).isRequired
    }

    constructor(props) {
        super(props);

        this.removePost = this.removePost.bind(this);
    }

    removePost() {
        this.props.actions.removePost(this.props.post);
    }

    render() {
        const post = this.props.post;
        const parentPost = post.commentedOnPost;

        let comment = '';
        let postClass = '';

        if (parentPost && this.props.parentPostUser) {
            const profile = this.props.parentPostUser;

            let apostrophe = '';
            let name = '...';
            if (profile != null) {
                let username = profile.username;
                if (parentPost.props &&
                        parentPost.props.from_webhook &&
                        parentPost.props.override_username &&
                        global.window.mm_config.EnablePostUsernameOverride === 'true') {
                    username = parentPost.props.override_username;
                }

                if (username.slice(-1) === 's') {
                    apostrophe = '\'';
                } else {
                    apostrophe = '\'s';
                }
                name = (
                    <a
                        className='theme'
                        onClick={Utils.searchForTerm.bind(null, username)}
                    >
                        {username}
                    </a>
                );
            }

            let message = '';
            if (parentPost.message) {
                message = Utils.replaceHtmlEntities(parentPost.message);
            } else if (parentPost.file_ids && parentPost.file_ids.length > 0) {
                message = (
                    <CommentedOnFilesMessageContainer
                        parentPostId={parentPost.id}
                    />
                );
            }

            comment = (
                <div className='post__link'>
                    <span>
                        <FormattedMessage
                            id='post_body.commentedOn'
                            defaultMessage='Commented on {name}{apostrophe} message: '
                            values={{
                                name,
                                apostrophe
                            }}
                        />
                        <a
                            className='theme'
                            onClick={this.props.handleCommentClick}
                        >
                            {message}
                        </a>
                    </span>
                </div>
            );
        }

        if (PostUtils.isEdited(this.props.post)) {
            postClass += ' post--edited';
        }

        let fileAttachmentHolder = null;
        if (((post.file_ids && post.file_ids.length > 0) || (post.filenames && post.filenames.length > 0)) && this.props.post.state !== Constants.POST_DELETED) {
            fileAttachmentHolder = (
                <FileAttachmentListContainer
                    post={post}
                    compactDisplay={this.props.compactDisplay}
                />
            );
        }

        const messageWrapper = (
            <div
                key={`${post.id}_message`}
                id={`${post.id}_message`}
                className={postClass}
            >
                <PostMessageContainer
                    lastPostCount={this.props.lastPostCount}
                    post={this.props.post}
                />
            </div>
        );

        let messageWithAdditionalContent;
        if (this.props.post.state === Constants.POST_DELETED) {
            messageWithAdditionalContent = messageWrapper;
        } else {
            messageWithAdditionalContent = (
                <PostBodyAdditionalContent
                    post={this.props.post}
                    message={messageWrapper}
                    previewCollapsed={this.props.previewCollapsed}
                />
            );
        }

        let mentionHighlightClass = '';
        if (post.isCommentMention) {
            mentionHighlightClass = 'mention-comment';
        }

        return (
            <div>
                {comment}
                <div className={'post__body ' + mentionHighlightClass}>
                    {messageWithAdditionalContent}
                    {fileAttachmentHolder}
                    <ReactionListContainer post={post}/>
                </div>
            </div>
        );
    }
}
