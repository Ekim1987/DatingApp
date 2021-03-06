import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/_message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages()
  }
  loadMessages() {
    const currentUserId = +this.authService.decodeToken.nameid;
    this.userService.getMessageThread(this.authService.decodeToken.nameid, this.recipientId)
      .pipe(tap(message => {
        for (let i = 0; i < message.length; i++) {
          if (message[i].isRead === false && message[i].recipentId === currentUserId) {
            this.userService.markAsRead(currentUserId, message[i].id)
          }
        }
      }))
      .subscribe(messages => {
        this.messages = messages
      });
    error => {
      this.alertify.error(error);
    }
  }
  sendMessage() {
    this.newMessage.recipentId = this.recipientId;
    this.userService.sendMessage(this.authService.decodeToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        debugger;
        this.messages.unshift(message);
        this.newMessage.content = '';

      }, error => {
        this.alertify.error(error);
      })
  }
}

