import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

interface ChatMessage {
  id: string;
  time: string;
  user: string;
  message: string;
}

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent {
  canPost: boolean = true;
  sendingStatus: string = ''
  sendingStatusColor: string = '';
  userInput: string = '';
  comments: ChatMessage[] = [];
  serverStatusOk: boolean = false;
  serverStatusReason: string = 'Connecting to the server...';

  addComment(): void {
    if (this.userInput.trim() !== '') {
      this.canPost = false;
      this.sendingStatus = 'Sending...'
      this.sendingStatusColor = 'grey';
      this.apiService.addComment(
        (this.apiService.isLoggedInUser() ? this.apiService.getUsername() : "anonymous"),
        this.userInput.trim()
      )
      .subscribe(
        (response: any) => {
          this.comments = response.messages;
          console.log('POST Response:', response);
          this.userInput = ''; 
          this.canPost = true;
          this.sendingStatus = ''
          this.sendingStatusColor = '';
        },
        (error: any) => {
          this.canPost = true;
          console.error('Error sending POST request:', error);
          this.sendingStatus = 'Error sending comment, please try again later...'
          this.sendingStatusColor = 'red';
        }
      );
    }
  }

  deleteComment(message: ChatMessage): void {
    this.canPost = false;
    this.sendingStatus = 'Deleting...'
    this.sendingStatusColor = 'grey';
    this.apiService.deleteComment(message.id)
    .subscribe(
      (response: any) => {
        this.comments = response.messages;
        console.log('DELETE Response:', response); 
        this.userInput = '';
        this.canPost = true;
        this.sendingStatus = ''
        this.sendingStatusColor = '';
      },
      (error: any) => {
        this.canPost = true;
        console.error('Error sending DELETE request:', error);
        this.sendingStatus = 'Error deleting comment, please try again later...'
        this.sendingStatusColor = 'red';
      }
    );
  }

  constructor(private apiService: ApiService) {
    this.apiService.getComments()
    .subscribe(
      (response: any) => {
        this.comments = response.messages;
        console.log('GET Response:', response);
        this.serverStatusOk = true;
        this.serverStatusReason = 'There are no messages yet...'
      },
      (error: any) => {
        console.error('Error sending GET request:', error);
        this.serverStatusOk = false;
        this.serverStatusReason = 'Error connecting to the server...'
      }
    );
  }
}