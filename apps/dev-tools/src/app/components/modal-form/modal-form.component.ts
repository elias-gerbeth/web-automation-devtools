import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface ModalFormItem {
    label?: string;
    name: string;
    value?: string;
    placeholder?: string;
    type: 'text' | 'selector';
}

@Component({
    selector: 'web-automation-dev-tools-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit {

    @Input() title: string;
    @Input() visible = false;
    @Input() items: ModalFormItem[] = [];
    @Output() onOk = new EventEmitter<ModalFormItem[]>();
    @Output() onCancel = new EventEmitter<void>();

    constructor() { }

    ngOnInit() { }

    ok() {
        this.onOk.emit(this.items);
    }
    cancel() {
        this.onCancel.emit();
    }
}
