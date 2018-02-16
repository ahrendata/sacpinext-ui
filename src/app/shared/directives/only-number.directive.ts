import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {

    // Allow decimal numbers. The \. is only allowed once to occur
    private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    DIGITS_REGEXP = new RegExp(/\D/g);
    constructor(private el: ElementRef) {
        // Sanatize clipboard by removing any non-numeric input after pasting
        this.el.nativeElement.onpaste = (e: any) => {
            e.preventDefault();
            let text;
            let clp = (e.originalEvent || e).clipboardData;
            if (clp === undefined || clp === null) {
                text = (<any>window).clipboardData.getData('text') || '';
                if (text !== '') {
                    text = text.replace(this.DIGITS_REGEXP, '');
                    if (window.getSelection) {
                        let newNode = document.createElement('span');
                        newNode.innerHTML = text;
                        window.getSelection().getRangeAt(0).insertNode(newNode);
                    } else {
                        (<any>window).selection.createRange().pasteHTML(text);
                    }
                }
            } else {
                text = clp.getData('text/plain') || '';
                if (text !== '') {
                    text = text.replace(this.DIGITS_REGEXP, '');
                    document.execCommand('insertText', false, text);
                }
            }
        };
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        // Do not use event.keycode this is deprecated.
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}