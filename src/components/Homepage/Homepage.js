import React, { Component } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CONSTANTS } from '../../constants/contants'
import "./Homepage.css";
import Auxiliary from '../Auxiliary/Auxiliary';

class Homepage extends Component {
 constructor() {
  super();
  this.state = {
   data: '',
   pageNumber: 0,
   voteCount:{}
  }
  this.fetchAPIData = this.fetchAPIData.bind(this);
  this.previousPage = this.previousPage.bind(this);
  this.nextPage = this.nextPage.bind(this);
  this.updateVoteHandler = this.updateVoteHandler.bind(this);
 }

 componentDidMount() {
  let page = window.location.search !== '' ? window.location.search : this.state.pageNumber
  this.fetchAPIData(page);
 }

 async fetchAPIData(pageNumber) {
  await axios.get(`${CONSTANTS.API.API_URL}${pageNumber}`).then((response) => {
   if (response.status === 200) {
    this.setState({
     data: response.data.hits,
     hide: false
    })
   }
  })
   .catch(function (error) {
   })
 }

 updateVoteHandler(id, votes) {
  let updatedVotes = Number(votes) +1
 localStorage.setItem(id,updatedVotes);
 this.setState({
  voteCount:{"id":id,"votes":updatedVotes}
 })
 }


 previousPage() {
  let page = this.state.pageNumber - 1
  if (this.state.pageNumber > 0) {
   this.setState({
    pageNumber: page
   })
   let next = document.getElementsByClassName("next")[0];
   next.classList.remove("disabled");
   this.fetchAPIData(page);
  } else {
   document.getElementsByClassName("previous")[0].className += " disabled";
  }
 }

 nextPage() {
  let page = this.state.pageNumber + 1
  if (this.state.pageNumber < 50) {
   this.setState({
    pageNumber: page
   })
   let prev = document.getElementsByClassName("previous")[0];
   prev.classList.remove("disabled");
   this.fetchAPIData(page);
  } else {
   document.getElementsByClassName("previous")[0].className += " disabled";
  }
 }
 render() {
  let renderTableCells = (
   this.state.data !== '' ? (this.state.data.map((data, index) => {
    let urlFiltered = data.url !== null ? data.url.split('//')[1] : '';
    let url = urlFiltered !== undefined ? urlFiltered.split('/')[0] : 'No URL Present';
    let time = '';
    let currentDate = new Date();
    let createdDate = new Date(data.created_at);
    let getHours = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours()) - Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate(), createdDate.getHours())) / (1000 * 60 * 60));
    if (getHours > 24) {
     time = Math.floor(getHours / 24) + " days ago";;
    } else if (getHours === 24) {
     time = 1 + " day ago";
    } else {
     time = getHours + " hours ago";
    }
    let title = data.title !== null && data.title !== '' ? data.title : data.story_text;
    let commentsCount = data.num_comments !== null ? data.num_comments : '-';
    let votesCount = this.state.voteCount !=={}?this.state.voteCount.id === data.objectID?this.state.voteCount.votes: localStorage.getItem(data.objectID) !==null?localStorage.getItem(data.objectID):data.points:data.points;
    return (<TableRow key={index}>
     <TableCell className="comments_count">{commentsCount}</TableCell>
     <TableCell className="upVote_count">{votesCount}</TableCell>
     <TableCell className="upVote_icon" onClick={() => this.updateVoteHandler(data.objectID,votesCount)}><i className="fa fa-caret-up"></i></TableCell>
     <TableCell><span className="title">{title}</span><span className="url">{" " + "(" + url + ") by "}</span><span className="author">{data.author}</span>{" "}<span className="time">{time}</span><span className="hide">{" [ hide ]"}</span></TableCell>
    </TableRow>
    )
   })
   ) : ''
  )
  return (
   <Auxiliary>
    {this.state.data !== '' ?
     <Table>
      <TableHead>
       <TableRow>
        <TableCell>Comments</TableCell>
        <TableCell>Vote Count</TableCell>
        <TableCell>UpVote</TableCell>
        <TableCell>News Details</TableCell>
       </TableRow>
      </TableHead>
      <TableBody>
       {renderTableCells}
      </TableBody>
     </Table> : null}
    <div className="pagination">
     <span className="previous disabled" onClick={this.previousPage}>Previous</span>
     <span className="dash"> | </span>
     <span className="next" onClick={this.nextPage}>Next</span>
    </div>
   </Auxiliary>
  );
 }
}

export default Homepage;
