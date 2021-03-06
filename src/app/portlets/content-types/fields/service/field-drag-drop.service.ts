import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { filter, map } from 'rxjs/operators';
import { FieldDivider, ContentTypeField } from '@portlets/content-types/fields/shared';
import * as _ from 'lodash';

/**
 * Provide method to handle with the Field Types
 */
@Injectable()
export class FieldDragDropService {
    private static readonly FIELD_BAG_NAME = 'fields-bag';
    private static readonly FIELD_ROW_BAG_NAME = 'fields-row-bag';
    private static readonly FIELD_ROW_BAG_CLASS_OVER = 'row-columns__item--over';

    private _fieldDropFromSource: Observable<DropFieldData>;
    private _fieldDropFromTarget: Observable<DropFieldData>;
    private _fieldRowDropFromTarget: Observable<FieldDivider[]>;

    private currentColumnOvered: Element;

    constructor(private dragulaService: DragulaService) {
        dragulaService
            .over()
            .pipe(
                filter(
                    (group: { name: string; el: Element; container: Element; source: Element }) =>
                        this.isAColumnContainer(group.container)
                )
            )
            .subscribe(
                (group: { name: string; el: Element; container: Element; source: Element }) => {
                    if (!this.currentColumnOvered) {
                        this.currentColumnOvered = group.container;
                    }

                    if (
                        this.itShouldSetCurrentOveredContainer(
                            <HTMLElement>group.container,
                            <HTMLElement>group.source
                        )
                    ) {
                        this.currentColumnOvered.classList.remove(
                            FieldDragDropService.FIELD_ROW_BAG_CLASS_OVER
                        );

                        this.currentColumnOvered = group.container;

                        this.currentColumnOvered.classList.add(
                            FieldDragDropService.FIELD_ROW_BAG_CLASS_OVER
                        );
                    }
                }
            );

        dragulaService
            .dragend()
            .pipe(filter(() => !!this.currentColumnOvered))
            .subscribe(() => {
                this.currentColumnOvered.classList.remove(
                    FieldDragDropService.FIELD_ROW_BAG_CLASS_OVER
                );
            });

        this._fieldRowDropFromTarget = dragulaService.dropModel().pipe(
            filter((data: DragulaDropModel) => this.isFieldBeingDragFromColumns(data)),
            map((data: DragulaDropModel) => data.targetModel)
        );

        this._fieldDropFromTarget = dragulaService.dropModel().pipe(
            filter((data: DragulaDropModel) => this.isDraggingExistingField(data)),
            map((data: DragulaDropModel) => this.getDroppedFieldData(data))
        );

        this._fieldDropFromSource = dragulaService.dropModel().pipe(
            filter((data: DragulaDropModel) => this.isDraggingNewField(data)),
            map((data: DragulaDropModel) => this.getDroppedFieldData(data))
        );
    }

    /**
     * Set options for fields bag and rows bag
     *
     * @memberof FieldDragDropService
     */
    setBagOptions(): void {
        this.setFieldBagOptions();
        this.setFieldRowBagOptions();
    }

    /**
     * Set the options for the 'fields-bag' dragula group
     * @memberof FieldDragDropService
     */
    setFieldBagOptions(): void {
        const fieldBagOpts = this.dragulaService.find(FieldDragDropService.FIELD_BAG_NAME);
        if (!fieldBagOpts) {
            this.dragulaService.createGroup(FieldDragDropService.FIELD_BAG_NAME, {
                copy: this.shouldCopy.bind(this),
                accepts: this.shouldAccepts,
                moves: this.shouldMovesField,
                copyItem: (item: any) => {
                    return _.cloneDeep(item);
                }
            });
        }
    }

    /**
     * Set the options for the 'fields-row-bag' dragula group
     * @memberof FieldDragDropService
     */
    setFieldRowBagOptions(): void {
        const fieldRowBagOpts = this.dragulaService.find(FieldDragDropService.FIELD_ROW_BAG_NAME);
        if (!fieldRowBagOpts) {
            this.dragulaService.createGroup(FieldDragDropService.FIELD_ROW_BAG_NAME, {
                copy: this.shouldCopy.bind(this),
                moves: this.shouldMoveRow.bind(this)
            });
        }
    }

    get fieldDropFromSource$(): Observable<any> {
        return this._fieldDropFromSource;
    }

    get fieldDropFromTarget$(): Observable<any> {
        return this._fieldDropFromTarget;
    }

    get fieldRowDropFromTarget$(): Observable<any> {
        return this._fieldRowDropFromTarget;
    }

    private getDroppedFieldData(data: DragulaDropModel): DropFieldData {
        return {
            item: data.item,
            source: {
                columnId: (<HTMLElement>data.source).dataset.columnid,
                model: data.sourceModel
            },
            target: {
                columnId: (<HTMLElement>data.target).dataset.columnid,
                model: data.targetModel
            }
        };
    }

    private isDraggingNewField(data: DragulaDropModel): boolean {
        return (
            data.name === FieldDragDropService.FIELD_BAG_NAME &&
            this.isDraggingFromSource(<HTMLElement>data.source)
        );
    }

    private isDraggingExistingField(data: DragulaDropModel): boolean {
        return (
            data.name === FieldDragDropService.FIELD_BAG_NAME &&
            (<HTMLElement>data.source).dataset.dragType === 'target'
        );
    }

    private isDraggingFromSource(source: HTMLElement): boolean {
        return source.dataset.dragType === 'source';
    }

    private isFieldBeingDragFromColumns(data: DragulaDropModel): boolean {
        return data.name === FieldDragDropService.FIELD_ROW_BAG_NAME;
    }

    private isAColumnContainer(container: Element): boolean {
        return container.classList.contains('row-columns__item');
    }

    private isANewColumnContainer(container: Element): boolean {
        return this.currentColumnOvered && this.currentColumnOvered !== container;
    }

    private shouldCopy(_el: HTMLElement, source: HTMLElement): boolean {
        return this.isDraggingFromSource(source);
    }

    private shouldMoveRow(
        _el: HTMLElement,
        source: HTMLElement,
        handle: HTMLElement,
        _sibling: HTMLElement
    ): boolean {
        const noDrag = !handle.classList.contains('no-drag');
        const isDragButton =
            handle.parentElement.classList.contains('row-header__drag') ||
            handle.classList.contains('row-header__drag');
        return noDrag && this.shouldDrag(source, isDragButton);
    }

    private shouldDrag(source: HTMLElement, isDragButton: boolean): boolean {
        return this.isDraggingFromSource(source) || isDragButton;
    }

    private shouldAccepts(
        _el: HTMLElement,
        source: HTMLElement,
        _handle: HTMLElement,
        _sibling: HTMLElement
    ): boolean {
        return source.dataset.dragType !== 'source';
    }

    private shouldMovesField(
        el: HTMLElement,
        _source: HTMLElement,
        _handle: HTMLElement,
        _sibling: HTMLElement
    ): boolean {
        return el.dataset.dragType !== 'not_field';
    }

    private itShouldSetCurrentOveredContainer(
        container: HTMLElement,
        source: HTMLElement
    ): boolean {
        return this.isANewColumnContainer(container) || this.isDraggingFromSource(source);
    }
}

interface DragulaDropModel {
    name: string;
    el: Element;
    target: Element;
    source: Element;
    sibling: Element;
    item: any;
    sourceModel: any[];
    targetModel: any[];
    sourceIndex: number;
    targetIndex: number;
}

export interface DropFieldData {
    item: ContentTypeField;
    source?: {
        columnId: string;
        model: ContentTypeField[];
    };
    target: {
        columnId: string;
        model: ContentTypeField[];
    };
}
