// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import Post from './post';
import LoadingScreen from 'components/loading_screen.jsx';

import * as UserAgent from 'utils/user_agent.jsx';
import * as Utils from 'utils/utils.jsx';
import Constants from 'utils/constants.jsx';
import {createChannelIntroMessage} from 'utils/channel_intro_messages.jsx';

import {FormattedDate, FormattedMessage} from 'react-intl';

import React from 'react';

export default class PostList extends React.PureComponent {
    static propTypes = {

        /**
         * Array of posts in the channel, ordered from oldest to newest
         */
        posts: React.PropTypes.array,

        /**
         * The channel the posts are in
         */
        channel: React.PropTypes.object,

        /**
         * The channel membership for the current user
         */
        channelMember: React.PropTypes.object,

        /**
         * The user id of the logged in user
         */
        currentUserId: React.PropTypes.string,

        /**
         * Whether to display the channel intro at full width
         */
        fullWidth: React.PropTypes.bool,

        actions: React.PropTypes.shape({

            /**
             * Function to get more posts in the channel
             */
            getPosts: React.PropTypes.func.isRequired
        }).isRequired
    }

    constructor(props) {
        super(props);

        this.createPosts = this.createPosts.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.page = 0;
        this.preLoadListHeight = 0;
        this.previousScrollTop = 0;

        this.state = {
            loadingMorePosts: false,
            atEnd: this.props.posts && this.props.posts.length < Constants.POST_CHUNK_SIZE
        };
    }

    componentDidMount() {
        this.props.actions.getPosts(this.props.channel.id).then((posts) => {
            if (posts && posts.order.length < Constants.POST_CHUNK_SIZE) {
                this.setState({atEnd: true});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.channel.id !== nextProps.channel.id) {
            this.page = 0;
            this.setState({atEnd: false, loadingMorePosts: false});

            this.props.actions.getPosts(nextProps.channel.id).then((posts) => {
                if (posts && posts.order.length < Constants.POST_CHUNK_SIZE) {
                    this.setState({atEnd: true});
                }
            });
        }
    }

    componentWillUpdate() {
        if (this.refs.postlist) {
            this.previousScrollTop = this.refs.postlist.scrollTop;
        }
    }

    componentDidUpdate(prevProps) {
        // Perform scroll update to prevent scroll jump
        if (this.refs.postlist &&
                this.preLoadListHeight &&
                this.props.posts !== prevProps.posts) {
            this.refs.postlist.scrollTop = this.previousScrollTop + (this.refs.postlist.scrollHeight - this.preLoadListHeight);
            this.preLoadListHeight = 0;
        }
    }

    handleScroll() {
        // Cancel scroll update if user scrolls down after hitting top
        if (this.preLoadListHeight && this.refs.postlist.scrollTop > this.previousScrollTop) {
            this.preLoadListHeight = 0;
        }

        // Load more posts if user hits end of list
        if (this.refs.postlist.scrollTop === 0 &&
                !this.state.loadingMorePosts &&
                !this.state.atEnd) {
            this.setState({loadingMorePosts: true});

            this.page += 1;
            this.preLoadListHeight = this.refs.postlist.scrollHeight;

            this.props.actions.getPosts(this.props.channel.id, this.page, Constants.POST_CHUNK_SIZE).then((posts) => {
                if (posts && posts.order.length < Constants.POST_CHUNK_SIZE) {
                    this.setState({atEnd: true});
                }

                this.setState({loadingMorePosts: false});
            });
        }
    }

    createPosts(posts) {
        const postCtls = [];
        let previousPostDay = new Date(0);
        const currentUserId = this.props.currentUserId;
        const lastViewed = this.props.channelMember.last_viewed_at || 0;

        let renderedLastViewed = false;

        for (let i = posts.length - 1; i >= 0; i--) {
            const post = posts[i];

            const postCtl = (
                <Post
                    ref={post.id}
                    key={'post ' + (post.id || post.pending_post_id)}
                    post={post}
                    lastPostCount={(i >= 0 && i < Constants.TEST_ID_COUNT) ? i : -1}
                />
            );

            const currentPostDay = Utils.getDateForUnixTicks(post.create_at);
            if (currentPostDay.toDateString() !== previousPostDay.toDateString()) {
                postCtls.push(
                    <div
                        key={currentPostDay.toDateString()}
                        className='date-separator'
                    >
                        <hr className='separator__hr'/>
                        <div className='separator__text'>
                            <FormattedDate
                                value={currentPostDay}
                                weekday='short'
                                month='short'
                                day='2-digit'
                                year='numeric'
                            />
                        </div>
                    </div>
                );
            }

            if (post.user_id !== currentUserId &&
                    lastViewed !== 0 &&
                    post.create_at > lastViewed &&
                    !Utils.isPostEphemeral(post) &&
                    !renderedLastViewed) {
                renderedLastViewed = true;

                // Temporary fix to solve ie11 rendering issue
                let newSeparatorId = '';
                if (!UserAgent.isInternetExplorer()) {
                    newSeparatorId = 'new_message_' + post.id;
                }
                postCtls.push(
                    <div
                        id={newSeparatorId}
                        key='unviewed'
                        ref='newMessageSeparator'
                        className='new-separator'
                    >
                        <hr
                            className='separator__hr'
                        />
                        <div className='separator__text'>
                            <FormattedMessage
                                id='posts_view.newMsg'
                                defaultMessage='New Messages'
                            />
                        </div>
                    </div>
                );
            }

            postCtls.push(postCtl);
            previousPostDay = currentPostDay;
        }

        return postCtls;
    }

    render() {
        if (this.props.posts == null) {
            return (
                <LoadingScreen
                    position='absolute'
                    key='loading'
                />
            );
        }

        let topRow;
        if (this.state.loadingMorePosts) {
            topRow = (
                <FormattedMessage
                    id='posts_view.loadingMore'
                    defaultMessage='Loading more messages...'
                />
            );
        } else if (this.state.atEnd) {
            topRow = createChannelIntroMessage(this.props.channel, this.props.fullWidth);
        }

        return (
            <div id='post-list'>
                <div
                    ref='postlist'
                    className='post-list-holder-by-time'
                    key={'postlist-' + this.props.channel.id}
                    onScroll={this.handleScroll}
                >
                    <div className='post-list__table'>
                        <div
                            ref='postlistcontent'
                            className='post-list__content'
                        >
                            {topRow}
                            {this.createPosts(this.props.posts)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
