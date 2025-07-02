import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ChatService } from './chat.service';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';
import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';
import { catchError, throwError } from 'rxjs';
import { ChatComponent } from './chat.component';
import { DataGuardService } from 'app/core/auth/data.guard';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'environments/environment';

/**
 * Conversation resolver
 *
 * @param route
 * @param state
 */
const conversationResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    return chatService.getChatById(route.paramMap.get('id')).pipe(
        // Error here means the requested chat is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};
const makeConnection = () => {
    const dataService = inject(DataGuardService);
    const chatService = inject(ChatService);

    return new Promise<boolean>((resolve, reject) => {
        const existingConnection = chatService._Connection.getValue();

        if (existingConnection && existingConnection.state === 'Connected') {
            // Already connected, no need to reconnect
            console.log('SignalR already connected');
            return resolve(true);
        }

        const token = dataService.getLocalData('accessToken');
        const cleanedToken = token?.replace(/^"|"$/g, '');

        const _hubConnection = new HubConnectionBuilder()
            .withUrl(`${environment.externalApiURL}/chathub`, {
                accessTokenFactory: () => cleanedToken || '',
            })
            .withAutomaticReconnect()
            .build();

        _hubConnection.on('MessageReceived', (message) => {
            console.log('Received:', message);
        });

        _hubConnection
            .start()
            .then(() => {
                console.log('SignalR connection started');
                chatService._Connection.next(_hubConnection);
                resolve(true);
            })
            .catch((err) => {
                console.error('SignalR connection error:', err);
                chatService._Connection.next(null);
                reject(err);
            });
    });
};
const checkThread = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    const threadId = route.paramMap.get('id');

    return new Promise<boolean>((resolve, reject) => {
        let grid  = {
            keyword: "",
            pageNumber: 1,
            pageSize: 250,
            orderBy: "",
            sortOrder: ""
        }
        chatService.getConversion(grid).subscribe({
            next: (res) => {
                const threads = res?.data;

                const found = threads?.some((t: any) => t?.threadGuid === threadId);
                const threadDetail = threads?.filter((t: any) => t?.threadGuid === threadId);
                if (found) {
                    resolve(true); 
                    chatService._threadDetails.next(threadDetail[0]);
                } else {
                    router.navigateByUrl('/chat');
                    reject(false);
                }
            },
            error: (err) => {
                console.error('Failed to fetch threads:', err);
                reject(false);
            }
        });
        
    });
};

export default [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            makeConnection
        },
        children: [
            {
                path: '',
                component: ChatsComponent,
                children: [
                    {
                        path: 'new-chat/:id',
                        // pathMatch: 'full',
                        component: EmptyConversationComponent,
                    },
                    {
                        path: ':id',
                        component: ConversationComponent,
                        resolve: {
                            makeConnection,
                            checkThread
                        },
                    },
                ],
            },
        ],
    },
] as Routes;
