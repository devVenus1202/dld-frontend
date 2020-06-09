import React, {PureComponent} from 'react';
import AddComment from './AddComment';
import ViewComment from './ViewComment';
import * as moment from 'moment';
import _ from 'lodash';
import qs from 'query-string';
import {ToastStore} from "react-toasts";
import scrollToElement from 'scroll-into-view';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {ApiHelper} from '../../../helpers/ApiHelper';
import {InfiniteLoader} from '../Common/Loader/Loader';
import DeleteModel from "../Common/AuthModel/DeleteModel";
import * as Style from './ProductComment.css';
import ReportCommentPopup from '../../../container/ReportCommentPopup';


const COMMENT_MAX_LENGTH = 1000;
const COMMENT_SHOW_LESS_SIZE = 250;

class ProductComments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      isLoggedIn: false,
      displayReplayFormId: null,
      displayReplayInnerFormId: null,
      displayReplayInnerForm: false,
      isLoading: false,
      comment_open: [],
      skip: 0,
      limit: 1000,
      hasMore: true,
      commentError: "",
      isSubmitted: false,
      displayEditFormId: null,
      displayDeleteModel: false,
      currentDeleteId: "",
      addCommentButtonLoading: false,
      openReportPopup: null,
      commentReplied: false,
      commentReviewed: false,
    };
    this.getComments = this.getComments.bind(this);
  }

  componentWillMount() {
    const storageSession = JSON.parse(localStorage.getItem('localStorageVal'));
    if (storageSession) {
      this.setState({
        isLoggedIn: true
      });
    }
    this.getComments('first');
  }

  componentDidUpdate() {
    const {
      comments,
      commentReplied,
      commentReviewed,
    } = this.state;
    const {search} = window.location;
    const queryString = search.substr(1);
    const queryParams = qs.parse(queryString);

    if (!commentReplied && comments.length && queryParams.replycomment) {
      const time = 1000;
      const elementToScroll = document.querySelector(`.li-comment-${queryParams.replycomment}`);

      if (elementToScroll) {
        scrollToElement(elementToScroll, {
          time,
        });
        setTimeout(() => {
          const replyBtn = document.querySelector(`.reply-btn-${queryParams.replycomment}`);

          if (replyBtn) {
            replyBtn.click();
          }

          const textarea = document.querySelector('.new-comment-textarea');

          if (textarea) {
            textarea.focus();
          }
        }, time);
      }

      this.setState({
        commentReplied: true,
      });
    }

    if (!commentReviewed && comments.length && queryParams.reviewcomment) {
      const time = 1000;
      const elementToScroll = document.querySelector(`.li-comment-${queryParams.reviewcomment}`);

      if (elementToScroll) {
        scrollToElement(elementToScroll, {
          time,
        });

        setTimeout(() => {
          elementToScroll.style.animation = 'colorchange 0.75s';

          setTimeout(() => {
            elementToScroll.style.animation = '';
          }, 750);
        }, time);
      }

      this.setState({
        commentReviewed: true,
      });
    }
  }

  async getComments(dataQueue) {
    const {productId} = this.props;
    this.setState({productId, isLoading: dataQueue === "first" ? true : false});
    const api = new ApiHelper();
    const result = await api.FetchFromServer('/', 'comments', 'GET', true, {
      productId,
      limit: this.state.limit, skip: this.state.skip
    });
    if (result.isError) {
      setTimeout(
        function () {
          this.setState({isLoading: false});
        }.bind(this),
        3000
      );
      return;
    }

    let commentData = result.data.data;

    this.setState({
      isLoading: false,
      comments: commentData
    });

    if (dataQueue === "main_commentId") {
      setTimeout(
        function () {
          var element = document.getElementById("scrollableDiv");
          element.scrollTop = element.scrollHeight;
        },
        1000
      );
    }


    // this.setState({
    // 	comments: result.data.data && result.data.data.length ? [...result.data.data] : this.state.comments
    // });
  };

  addComment = async (userComment, parentId, divId) => {
    this.setState({addCommentButtonLoading: true});
    var getID = document.getElementsByClassName('commentError');
    for (var i = getID.length - 1; i >= 0; i--) {
      getID[i].innerHTML = "";
    }

    userComment = userComment.trim();
    if (userComment.length === 0) {
      this.setState({isLoading: false, addCommentButtonLoading: false});
      document.getElementById(divId).innerHTML = 'Comment cannot be empty';
      return;
    }

    if (userComment.length > COMMENT_MAX_LENGTH) {
      this.setState({isLoading: false, addCommentButtonLoading: false});
      document.getElementById(divId).innerHTML = 'Too long message, maximum 1000 characters';
      return;
    }

    this.setState({isLoading: false, commentError: "", isSubmitted: false});
    const {productId} = this.props;
    const result = await new ApiHelper().FetchFromServer('/', 'comments', 'POST', true, undefined, {
      userComment,
      parentId,
      productId
    });
    if (result.isError) {
      this.setState({isLoading: false, addCommentButtonLoading: false});
      document.getElementById(divId).innerHTML = result.messages[0];
      return;
    }
    ToastStore.success("Comment successfully added.");
    document.getElementById("unique_comment").value = "";

    this.setState({
      skip: 0,
      limit: this.state.limit,
      hasMore: true,
      displayReplayFormId: null,
      addCommentButtonLoading: false
    });

    this.getComments(divId);
  };

  onLoadMore = () => {
    this.setState({
      skip: this.state.skip + this.state.limit
    }, () => this.getComments())
  };

  replyButton = (e) => {
    this.setState({displayReplayFormId: e, displayEditFormId: null});
  };

  handleShowReportPopup = (data) => () => {
    this.setState({
      openReportPopup: data,
    });
  };

  handleHideReportPopup = () => {
    this.setState({
      openReportPopup: null,
    });
  };

  replyInnerButton = (e) => {
    this.setState({displayReplayInnerFormId: e, displayReplayInnerForm: !this.state.displayReplayInnerForm});
  };

  editComment = async (userComment, parentId, divId) => {
    userComment = userComment.trim();
    if (userComment.length === 0) {
      this.setState({isLoading: false, addCommentButtonLoading: false});
      document.getElementById(divId).innerHTML = 'Comment cannot be empty';
      return;
    }

    if (userComment.length > 1000) {
      this.setState({isLoading: false, addCommentButtonLoading: false});
      document.getElementById(divId).innerHTML = 'Too long message, maximum 1000 characters';
      return;
    }

    const result = await new ApiHelper().FetchFromServer('/', 'comments/updateComments', 'PUT', true, undefined, {
      userComment: userComment,
      commentId: parentId,
    });
    if (result.isError) {
      return;
    }
    this.setState({displayEditFormId: null});
    //this.setState({ skip: 0, limit: 10, hasMore: true });
    ToastStore.success("Comment successfully updated.");

    this.getComments();
  };

  editCommentButton(editButtonId) {
    this.setState({
      displayEditFormId: editButtonId,
      displayReplayFormId: null
    });
  }

  errorHandler = () => {
    setTimeout(() => {
      this.setState({
        disabled: false,
        isSubmitted: false
      });
    }, 3000);
  };

  async deleteComment(commentId) {
    this.setState({displayDeleteModel: true});
    this.setState({currentDeleteId: commentId});

  }

  displayDeleteModelFun = () => {
    this.setState({displayDeleteModel: false});
  }

  performDeleteFun = async (commentId) => {
    const result = await new ApiHelper().FetchFromServer('/', 'comments/delete', 'DELETE', true, {
      commentId: commentId,
    }, undefined);
    if (result.isError) {
      return;
    }
    this.setState({displayDeleteModel: false});
    //this.setState({ skip: 0, limit: 10, hasMore: true });
    this.getComments();
  }

  closeCommentBox = (divId, boxName) => {
    this.setState({
      displayEditFormId: null,
      displayReplayFormId: null
    })
  }

  render() {
    const {catalog, productSlug, profileInfo, openLoginPopup, isLoggedIn} = this.props;
    const {comments, isLoading, openReportPopup} = this.state;

    return isLoading ? (
      <InfiniteLoader/>
    ) : (
      <div className="user-comment-wrap">
        {
          openReportPopup && (
            <ReportCommentPopup
              close={this.handleHideReportPopup}
              {...openReportPopup}
            />
          )
        }
        <div className="user-comment-inner">
          <ul className="user-comment-list">
            {!comments.length ? (
              <li className="comment-list-item">
                <p> No Comments yet </p>
              </li>
            ) : (
              <div id="scrollableDiv" className="scroldivcomment">
                {
                  comments.map((comment, indexOuter) => {
                    return (
                      <li className={`comment-list-item li-comment-${comment.id}`} key={indexOuter}>
                        {' '}
                        <div className="user-comment-content">
                          <div className="left">
                            <OverlayTrigger
                              placement="top"
                              overlay={(
                                <Tooltip>{comment.firstName} {comment.lastName}</Tooltip>
                              )}
                            >
                              <div className="user-name">
                                <span> {comment.firstName.charAt(0).toUpperCase()}</span>
                              </div>
                            </OverlayTrigger>
                          </div>
                          <div className="right">
                            <div className="comment-text" key={indexOuter}>
                              <div>
                                {/* _.unescape(comment.userComment) */}
                                <ViewComment
                                  comment={comment}
                                  commentShowLessSize={COMMENT_SHOW_LESS_SIZE}
                                />
                              </div>

                              {
                                parseInt(comment.userId) === parseInt(profileInfo.profileInfo.id) ?
                                  <div className="comment-edit-text"><span
                                    className="cursor-point"
                                    onClick={this.editCommentButton.bind(this, "outer_" + indexOuter)}> Edit </span> | <span
                                    className="cursor-point"
                                    onClick={() => this.deleteComment(parseInt(comment.id))}> Delete</span>
                                  </div>
                                  : null
                              }
                              {
                                this.state.displayEditFormId === "outer_" + indexOuter && parseInt(comment.userId) === parseInt(profileInfo.profileInfo.id) ?
                                  <div className="edit-comment-box">
                                    <AddComment
                                      onAdd={this.editComment}
                                      parentId={comment.id}
                                      className={'single-comment-box'}
                                      editComment={true}
                                      commentData={_.unescape(comment.userComment)}
                                      divId={"edit_" + indexOuter}
                                      displayCross={true}
                                      closeCommentBox={this.closeCommentBox}
                                      boxName={"edit"}
                                      maxCommentLength={COMMENT_MAX_LENGTH}
                                      addCommentButtonLoading={this.state.addCommentButtonLoading}
                                    />
                                  </div>
                                  : null

                              }
                            </div>
                            <div className="comment-reply">
                              <span className="inline-block">
                                  <span className="text-xt-light">
                                      {''}
                                    {moment(comment.createdAt).fromNow()}{''}
                                  </span>
                              </span>
                              <span className="inline-block">
                                <p
                                  className={`reply-btn reply-btn-${comment.id}`}
                                  onClick={(e) => this.replyButton(indexOuter)}
                                >
                                    <i className="fa fa-reply-all"
                                       aria-hidden="true"/> Reply
                                </p>
                                {
                                  parseInt(comment.userId) !== parseInt(profileInfo.profileInfo.id) && isLoggedIn && (
                                    <p
                                      className="reply-btn report"
                                      onClick={this.handleShowReportPopup({
                                        commentText: comment.userComment,
                                        commentId: comment.id,
                                      })}
                                    >
                                      Report
                                    </p>
                                  )
                                }
                                                            </span>
                            </div>
                          </div>
                        </div>
                        {this.state.displayReplayFormId === indexOuter ? isLoggedIn ? (
                          <div>
                            <AddComment
                              onAdd={this.addComment}
                              parentId={comment.id}
                              className={'single-comment-box'}
                              divId={"sub_" + indexOuter}
                              displayCross={true}
                              closeCommentBox={this.closeCommentBox}
                              boxName={"replay"}
                              maxCommentLength={COMMENT_MAX_LENGTH}
                              addCommentButtonLoading={this.state.addCommentButtonLoading}
                            />

                          </div>
                        ) : (
                          <p>
                            You need to login to reply on comment{' '}
                            <a
                              onClick={openLoginPopup}
                            >
                              Login Here
                            </a>
                          </p>
                        ) : null}
                        {comment.usercomments.length ? (
                          <ul className="sub-user-comment-list">
                            {comment.usercomments.map((itemData, indexInner) => {
                              return (
                                <li className={`sub-comment-list-item li-comment-${itemData.id}`} key={indexInner}>
                                  <div className="user-comment-content">
                                    <div className="left">
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={(
                                          <Tooltip>{itemData.firstName} {itemData.lastName}</Tooltip>
                                        )}
                                      >
                                        <div className="user-name">
                                          <span>{itemData.firstName.charAt(0).toUpperCase()}</span>
                                        </div>
                                      </OverlayTrigger>
                                    </div>
                                    <div className="right">
                                      <div className="comment-text">
                                        <ViewComment
                                          comment={itemData}
                                          commentShowLessSize={COMMENT_SHOW_LESS_SIZE}
                                        />
                                        {
                                          parseInt(itemData.userId) === parseInt(profileInfo.profileInfo.id) ?
                                            <div
                                              className="comment-edit-text">
                                              <span
                                                className="cursor-point"
                                                onClick={this.editCommentButton.bind(this, "inner_" + indexOuter + "_" + indexInner)}> Edit </span> | <span
                                              className="cursor-point"
                                              onClick={() => this.deleteComment(parseInt(itemData.id))}> Delete</span>
                                            </div>
                                            : null
                                        }
                                        {
                                          this.state.displayEditFormId === "inner_" + indexOuter + "_" + indexInner && parseInt(itemData.userId) === parseInt(profileInfo.profileInfo.id) ?
                                            <div
                                              className="edit-comment-box">
                                              <AddComment
                                                onAdd={this.editComment}
                                                parentId={itemData.id}
                                                className={'single-comment-box'}
                                                editComment={true}
                                                commentData={_.unescape(itemData.userComment)}
                                                divId={"edit_" + indexInner}
                                                displayCross={true}
                                                closeCommentBox={this.closeCommentBox}
                                                boxName={"edit"}
                                                addCommentButtonLoading={this.state.addCommentButtonLoading}
                                                maxCommentLength={COMMENT_MAX_LENGTH}
                                              />
                                            </div>
                                            : null
                                        }
                                      </div>
                                      <div className="comment-reply">
                                        <span
                                          className="inline-block">
                                             <span
                                               className="text-xt-light">
                                                {' '}
                                               {moment(
                                                 itemData.createdAt
                                               ).fromNow()}{' '}
                                            </span>
                                          {
                                            !itemData.denyReport && parseInt(itemData.userId) !== parseInt(profileInfo.profileInfo.id) && isLoggedIn && (
                                              <p
                                                className="reply-btn report"
                                                onClick={this.handleShowReportPopup({
                                                  commentText: itemData.userComment,
                                                  commentId: itemData.id,
                                                })}
                                              >Report</p>
                                            )
                                          }
                                        </span>
                                      </div>
                                      <div className="user-comment-box">
                                        <div className="comment-box-group"/>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })
                }
                {/* </InfiniteScroll> */}
              </div>
            )}

          </ul>
          <hr/>
          {isLoggedIn ? (
            <div>
              <h4>Leave a Comment</h4>
              <div className={'row ' + Style['userCommentBox']}>
                <div>
                  <div className="user-comment-content">
                    <div className="left">
                      <div className="user-name">
													<span>
														{' '}
                            {profileInfo && profileInfo.profileInfo && profileInfo.profileInfo.firstName && profileInfo.profileInfo.firstName.charAt(0).toUpperCase()}
													</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={Style['commentUserBox']}>
                  <AddComment onAdd={this.addComment}
                              maxCommentLength={COMMENT_MAX_LENGTH}
                              divId={"main_commentId"}
                              addCommentButtonLoading={this.state.addCommentButtonLoading}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>
              You need to login to add comment{' '}
              <a onClick={openLoginPopup}>Login Here</a>
            </p>
          )}
          <hr/>
        </div>
        <DeleteModel
          displayDeleteModel={this.state.displayDeleteModel}
          displayDeleteModelFun={this.displayDeleteModelFun}
          currentDeleteId={this.state.currentDeleteId}
          performDeleteFun={this.performDeleteFun}
        />

      </div>
    );
  }
}


// class ReadMoreReactCom extends Component {
// 	render () {
// 		const {textData} = this.props;
// 		console.log(textData);
// 		return(
// 			<ReadMoreReact text={textData}
// 			min={283}
// 			ideal={285}
// 			max={290}
// 			readMoreText={"Read More..."}/>
// 		);
// 	}
// }
export default ProductComments;
