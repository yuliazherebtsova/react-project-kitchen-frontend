import ArticleList from '../article-list/article-list';
import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
} from '../../constants/actionTypes';

const EditProfileSettings = ({ isUser }) => {
  if (isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn"
      >
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton = ({ isUser, user, follow, unfollow }) => {
  if (isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (user.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = (ev) => {
    ev.preventDefault();
    if (user.following) {
      unfollow(user.username);
    } else {
      follow(user.username);
    }
  };

  return (
    <button className={classes} onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {user.following ? 'Unfollow' : 'Follow'} {user.username}
    </button>
  );
};

const mapStateToProps = (state) => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  onFollow: (username) =>
    dispatch({
      type: FOLLOW_USER,
      payload: agent.Profile.follow(username),
    }),
  onLoad: (payload) => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnfollow: (username) =>
    dispatch({
      type: UNFOLLOW_USER,
      payload: agent.Profile.unfollow(username),
    }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
});

interface IProfile {
  onLoad: any;
  onUnload: any;
  match: {
    params: {
      username: string;
    }
  };
  profile: {
    username: string;
    bio: string;
    image: string;
  };
  currentUser: {
    username: string;
  };
  onFollow: () => void;
  onUnfollow: () => void;
  pager: any;
  articles: any;
  articlesCount: number;
  currentPage: number;
}

const Profile : FC<IProfile> = ({ 
  onLoad,
  onUnload,
  match,
  profile,
  currentUser,
  onFollow,
  onUnfollow,
  pager,
  articles,
  articlesCount,
  currentPage,
} ) => {
  useEffect(() => {
    onLoad(
      Promise.all([
        agent.Profile.get(match.params.username),
        agent.Articles.byAuthor(match.params.username),
      ])
    )

    return () => onUnload();
  }, [match.params.username, onLoad, onUnload]);

  const isUser = currentUser && profile.username === currentUser.username;

  const renderTabs = () => {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${profile.username}`}
          >
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to={`/@${profile.username}/favorites`}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    )
  };

  return (
    <>
      {!profile ? null 
      : 
      (
        <div className="profile-page">
          <div className="user-info">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <img
                    src={profile.image}
                    className="user-img"
                    alt={profile.username}
                  />
                  <h4>{profile.username}</h4>
                  <p>{profile.bio}</p>

                  <EditProfileSettings isUser={isUser} />
                  <FollowUserButton
                    isUser={isUser}
                    user={profile}
                    follow={onFollow}
                    unfollow={onUnfollow}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <div className="articles-toggle">{renderTabs()}</div>

                <ArticleList
                  pager={pager}
                  articles={articles}
                  articlesCount={articlesCount}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </div>
        </div>
      ) }
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
