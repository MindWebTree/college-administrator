import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChatService } from '../chat.service';
import { Chat } from '../chat.types';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { Subject, takeUntil } from 'rxjs';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DataGuardService } from 'app/core/auth/data.guard';
import { helperService } from 'app/core/auth/helper';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        ContactInfoComponent,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        MatMenuModule,
        NgClass,
        NgTemplateOutlet,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        DatePipe,
        ReactiveFormsModule, FormsModule
    ],
})
export class ConversationComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messageInput') messageInput: ElementRef;
    @ViewChild('chatBox') chatBoxRef!: ElementRef;

    threadData: any;
    chat: any = []; // Initialize as empty array
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    Message: FormControl;
    isConnected: boolean = false;
    userAccount: any;
    private _hubConnection: HubConnection;
    mediaRecorder!: MediaRecorder;
    audioChunks: Blob[] = [];
    isRecording = false;

    // Pagination properties
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;
    hasNextPage = false;
    hasPreviousPage = false;
    isLoading = false;
    private scrollThreshold = 10; // Pixels from top to trigger load
    userDetail: any;

    constructor(
        private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _helperService: helperService,
        private dataService: DataGuardService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone
    ) {
        this._chatService._threadDetails.subscribe(res => {
            this.threadData = res;
        });
        this.Message = new FormControl('');
        this.userAccount = this._helperService.getUserDetail();
        this._hubConnection = this._chatService._Connection.getValue();
        // setInterval(() =>{
            
        //     this.showDesktopNotification("New Message from Lecturer", "data.message");
        // },1000)
        
        // SignalR message handler
        this._hubConnection.on("ReceiveMessage", data => {
            const { senderId, message, sentOn, messageGuid, isOwn, sender, profilePic } = data;
            if(!isOwn){
                this.showDesktopNotification(`New Message from ${data.sender}`, data.message, data.profilePic);
            }
            // Ensure chat is initialized as array
            if (!Array.isArray(this.chat)) {
                this.chat = [];
            }

            // Push to chat list
            this.chat.push({
                senderId,
                message,
                sentOn,
                messageGuid,
                isMine: isOwn,
                id: messageGuid
            });
        
            this._changeDetectorRef.markForCheck();
        
            // Scroll to bottom after Angular renders it
            setTimeout(() => {
                this.scrollToBottom();
            }, 50);
        
            if (!isOwn) {
                // Optionally mark as seen
                // setTimeout(() => markAsSeen(messageGuid), 1000);
            }
        });
    }

    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.messageInput.nativeElement.style.height = 'auto';
                this._changeDetectorRef.detectChanges();
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    ngAfterViewInit(): void {
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            if (this.chatBoxRef?.nativeElement) {
                this.chatBoxRef.nativeElement.addEventListener(
                    'scroll',
                    this.onScroll.bind(this),
                    { passive: true } // Add passive option for better performance
                );
            } else {
                console.warn('chatBoxRef not available in ngAfterViewInit');
            }
        }, 100); // Increased timeout to ensure DOM is ready
    }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
        
            this.mediaRecorder.ondataavailable = (event) => {
              this.audioChunks.push(event.data);
            };
        
            this.mediaRecorder.onstop = () => {
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
              this.sendVoiceNote(audioBlob);
            };
        
            this.mediaRecorder.start();
            this.isRecording = true;
        }).catch(err => {
          alert("Microphone not found")
        });
      }
      stopRecording() {
        this.mediaRecorder?.stop();
        this.isRecording = false;
      }
    sendVoiceNote(blob: Blob) {
        const formData = new FormData();
        formData.append('voiceNote', blob, 'voice-note.webm');
        // this.http.post(`${environment.apiURL}/uploadVoiceNote`, formData).subscribe(
        //     res => {
        //       console.log('Voice note sent');
        //     },
        //     err => {
        //       console.error('Upload failed', err);
        //     }
        //   );
        console.log(formData,"formData")
    }



    onScroll(): void {
        const el = this.chatBoxRef?.nativeElement;
        if (!el) {
            console.log('No chat element found'); // Debug log
            return;
        }

        // Check if scrolled to top (with threshold) and there are more pages
        if (el.scrollTop <= this.scrollThreshold && 
            !this.isLoading && 
            this.hasNextPage) {
            this.loadOlderMessages();
        }
    }

    loadOlderMessages(): void {
        if (this.isLoading || !this.threadData?.threadGuid || !this.hasNextPage) {
            console.log('Cannot load messages:', { 
                isLoading: this.isLoading, 
                threadGuid: this.threadData?.threadGuid,
                hasNextPage: this.hasNextPage 
            });
            return;
        }

        this.isLoading = true;
        const nextPage = this.currentPage + 1;

        const grid = {
            keyword: "",
            pageNumber: nextPage,
            pageSize: 10,
            orderBy: "sentOn", // Order by date
            sortOrder: "desc"  // Newest first (this should be your API's default)
        };

        // Store current scroll position
        const el = this.chatBoxRef.nativeElement;
        const previousScrollHeight = el.scrollHeight;
        const previousScrollTop = el.scrollTop;

        this._chatService.getConversation(this.threadData.threadGuid, grid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response: any) => {
                    const olderMessages = response.data || [];

                    if (olderMessages.length > 0) {
                        // Ensure chat is array
                        if (!Array.isArray(this.chat)) {
                            this.chat = [];
                        }

                        // Since API returns newest first, but we want oldest at top:
                        // Reverse the older messages and prepend them
                        const reversedOlderMessages = [...olderMessages].reverse();
                        this.chat = [...reversedOlderMessages, ...this.chat];
                        
                        // Update pagination info from API response
                        this.currentPage = response.currentPage || nextPage;
                        this.totalPages = response.totalPages || 1;
                        this.totalCount = response.totalCount || 0;
                        this.hasNextPage = response.hasNextPage || false;
                        this.hasPreviousPage = response.hasPreviousPage || false;

                        // Maintain scroll position after DOM update
                        this._changeDetectorRef.detectChanges();
                        
                        setTimeout(() => {
                            const newScrollHeight = el.scrollHeight;
                            const scrollDifference = newScrollHeight - previousScrollHeight;
                            el.scrollTop = previousScrollTop + scrollDifference;
                        }, 0);
                    } else {
                        console.log('No more messages to load');
                    }

                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                },
                error: (error) => {
                    console.error('Error loading older messages:', error);
                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    private scrollToBottom(): void {
        if (this.chatBoxRef?.nativeElement) {
            const chatBox = this.chatBoxRef.nativeElement;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
    showDesktopNotification(title: string, message: string, pic: string) {
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: pic || 'my-images/default-img.png'
          });
        }
      }
      playNotificationSound() {
        const audio = new Audio('assets/notification.mp3');
        audio.play().catch(error => console.error('Audio playback failed:', error));
      }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((params) => {
                const threadId = params.get('id');

                if (threadId) {
                    if ('Notification' in window && Notification.permission !== 'granted') {
                        Notification.requestPermission();
                      }
                    this._chatService.GetThreadDetail(threadId).subscribe(res=>{
                        this.userDetail = res;
                        this._changeDetectorRef.markForCheck();
                    })
                    const threadDetails = this._chatService._threadDetails.getValue();
                    this.threadData = threadDetails;

                    // Reset pagination when loading new thread
                    this.currentPage = 1;
                    this.totalPages = 1;
                    this.totalCount = 0;
                    this.hasNextPage = false;
                    this.hasPreviousPage = false;
                    this.isLoading = false;

                    const grid = {
                        keyword: "",
                        pageNumber: 1,
                        pageSize: 10,
                        orderBy: "sentOn", // Order by date
                        sortOrder: "desc"  // Newest first
                    };

                    this._chatService.getConversation(threadId, grid)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((response: any) => {
                            
                            // API returns newest first, but we want oldest at top for chat
                            // So reverse the initial data
                            const initialMessages = response?.data || [];
                            this.chat = [...initialMessages].reverse();
                            
                            // Set pagination info from API response
                            this.currentPage = response?.currentPage || 1;
                            this.totalPages = response?.totalPages || 1;
                            this.totalCount = response?.totalCount || 0;
                            this.hasNextPage = response?.hasNextPage || false;
                            this.hasPreviousPage = response?.hasPreviousPage || false;
                            
                            this._changeDetectorRef.markForCheck();
                            
                            // Scroll to bottom after initial load (to show newest messages)
                            setTimeout(() => {
                                this.scrollToBottom();
                            }, 100);
                        });
                }
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        
        // Remove scroll event listener
        if (this.chatBoxRef?.nativeElement) {
            this.chatBoxRef.nativeElement.removeEventListener('scroll', this.onScroll);
        }
    }

    openContactInfo(): void {
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }

    async SendMessage() {
        if (!this._hubConnection || !this.Message.value?.trim()) {
            console.error('Cannot send message: SignalR connection is not ready or message is empty.');
            return;
        }

        try {
            let data = {
                receiverId: this.threadData?.userId,
                senderId: this.userAccount?.Id,
                subjectId: this.threadData?.subjectId,
                batchId: this.threadData?.batchId,
                batchYearId: this.threadData?.batchYearId,
                messageText: this.Message.value,
                teamId: this.threadData?.teamId,
            }

            const result = await this._hubConnection.invoke("SendMessage",
                data.receiverId,
                data.senderId,
                data.subjectId,
                data.batchId,
                data.batchYearId,
                data.messageText,
                data.teamId
            );

            if (result && result.messageId && result.sentOn) {
                // Add message to chat array instead of DOM manipulation
                if (!Array.isArray(this.chat)) {
                    this.chat = [];
                }
                
                this.chat.push({
                    senderId: this.userAccount?.Id,
                    message: this.Message.value,
                    sentOn: result.sentOn,
                    messageGuid: result.messageId,
                    isMine: true,
                    id: result.messageId
                });

                this._changeDetectorRef.markForCheck();
                
                setTimeout(() => {
                    this.scrollToBottom();
                }, 50);
            }

            this.Message.setValue('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // Remove DOM manipulation methods - use Angular's data binding instead
    resetChat(): void {
        this._chatService.resetChat();
        this.drawerOpened = false;
        this._changeDetectorRef.markForCheck();
    }

    toggleMuteNotifications(): void {
        this.chat.muted = !this.chat.muted;
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}