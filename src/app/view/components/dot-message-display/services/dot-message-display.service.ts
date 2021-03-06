import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DotcmsEventsService, DotEventData } from 'dotcms-js';
import { DotMessage } from '../model/dot-message.model';
import { map, takeUntil, filter } from 'rxjs/operators';
import { DotRouterService } from '@services/dot-router/dot-router.service';

/**
 *Handle message send by the Backend, this message are sended as Event through the {@link DotcmsEventsService}
 *
 * @export
 * @class DotMessageDisplayService
 */
@Injectable()
export class DotMessageDisplayService {
    private messages$: Observable<DotMessage>;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        dotcmsEventsService: DotcmsEventsService,
        private dotRouterService: DotRouterService
    ) {
        this.messages$ = dotcmsEventsService.subscribeTo('MESSAGE').pipe(
            takeUntil(this.destroy$),
            map((messageEvent: DotEventData) => <DotMessage>messageEvent.data),
            filter((dotMessage: DotMessage) => this.hasPortletIdList(dotMessage))
        );
    }

    /**
     *Allow subscribe to recive new message
     *
     * @returns {Observable<DotMessage>}
     * @memberof DotMessageDisplayService
     */
    messages(): Observable<DotMessage> {
        return this.messages$;
    }

    /**
     *Unsubscribe to service's Observable
     *
     * @memberof DotMessageDisplayService
     */
    unsubscribe(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private hasPortletIdList(dotMessage: DotMessage): boolean {
        return (
            !dotMessage.portletIdList ||
            !dotMessage.portletIdList.length ||
            dotMessage.portletIdList.includes(this.dotRouterService.currentPortlet.id)
        );
    }
}
