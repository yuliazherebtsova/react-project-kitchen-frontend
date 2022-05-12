import React, { useEffect } from 'react';
import { selectCurrentArticle } from 'services/selectors/articles';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'services/hooks';
import { getCurrentArticleData } from 'services/slices/articles';
import { selectCurrentUser } from 'services/selectors/profile';
import ArticleActions from 'components/article/components/article-actions/article-actions';
import ArticleMeta from 'components/article/components/article-meta/article-meta';
import CommentContainer from 'components/article/components/comment-container/comment-container';
import styles from './article.module.scss';

export const ArticlePage: React.FC = (
) => {
  const dispatch = useAppDispatch();
  const article = useAppSelector(selectCurrentArticle);
  const { id } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    console.log(id)
    dispatch(getCurrentArticleData(id));
  }, [dispatch, id]);

  const canModify =
    currentUser && currentUser.username === article?.author?.username;

  return (
    <>
      <ArticleActions
        canModify={canModify}
        article={article}
      />
      <div className={styles.container}>
        <h1 className={styles.container__header}>{article?.title}</h1>
        <ArticleMeta article={article}/>
        <img
          src={article?.link}
          alt={`${article?.title} illustration`}
          className={styles.panel__img} 
        />
        <div className={styles.container__text}>{article?.body}</div>
        <ul className={styles.container__tags}>
          {article?.tagList?.map((tag) => {
            return (
              <li className={styles.container__tag} key={tag}>
                {'# ' + tag}
              </li>
            );
          })}
        </ul>
        <CommentContainer
          comments={article?.comments}
          //errors={commentErrors}
          slug={article?.slug}
          currentUser={currentUser}
        />
      </div>
    </>
  );
};

export default ArticlePage;