import { NotificationService } from 'patternfly-ng/notification';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Action } from 'patternfly-ng/action/action';
import { NotificationType } from 'patternfly-ng/notification';

@Injectable()
export class NotificationsService {

    public static readonly MAX_TOAST_NOTIFICATIONS = 8;

    constructor(private notificationService: NotificationService) {
    }
    public danger(header: string, message: string, primaryAction?: Action, moreActions?: Action[]) {
        this.dropmessage();
        this.notificationService.message(
            NotificationType.DANGER,
            header,
            message,
            false,
            primaryAction,
            moreActions
        );
    }
    public info(header: string, message: string, primaryAction?: Action, moreActions?: Action[]) {
        this.dropmessage();
        this.notificationService.message(
            NotificationType.DANGER,
            header,
            message,
            false,
            primaryAction,
            moreActions
        );
    }
    public success(header: string, message: string, primaryAction?: Action, moreActions?: Action[]) {
        this.dropmessage();
        this.notificationService.message(
            NotificationType.DANGER,
            header,
            message,
            false,
            primaryAction,
            moreActions
        );
    }
    public warning(header: string, message: string, primaryAction?: Action, moreActions?: Action[]) {
        this.dropmessage();
        this.notificationService.message(
            NotificationType.DANGER,
            header,
            message,
            false,
            primaryAction,
            moreActions
        );
    }

    private dropmessage() {
        if (this.notificationService.getNotifications.length > NotificationsService.MAX_TOAST_NOTIFICATIONS) {
            for (let i: number = this.notificationService.getNotifications().length - 1; i >= 0; i--) {
                if (i >= 8) {
                    this.notificationService.remove(this.notificationService.getNotifications()[i]);
                }
            }
        }
    }

    get current(): any[] {
        return this.notificationService.getNotifications();
    }

    get recent(): Observable<Notification[]> {
        return Observable.empty();
    }
}
