"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _true = Symbol('true');
const _false = Symbol('false');
class EBool {
    constructor(bool) {
        this.bool = bool;
    }
}
const _etrue = new EBool(_true);
const _efalse = new EBool(_false);
exports._if = (v) => v ? _true : _false;
exports._elif = (v) => v ? _etrue : _efalse;
exports._else = _etrue;
exports._end = Symbol('end');
function* makeTree(leafs, skeep) {
    let t = null;
    while (!(t = leafs.next()).done) {
        switch (t.value) {
            case _true:
                yield* makeTree(leafs, skeep);
                break;
            case _false:
                yield* makeTree(leafs, true);
                break;
            case exports._end:
                return;
            default:
                if (!skeep) {
                    yield t.value;
                }
                break;
        }
    }
}
function* merge(literals, placeholders) {
    let ifstack = [];
    for (let i = 0; i < literals.length; i++) {
        yield literals[i];
        if (i < placeholders.length) {
            switch (placeholders[i]) {
                case _true:
                case _false:
                    ifstack.push([placeholders[i], placeholders[i] === _true]);
                    yield placeholders[i];
                    break;
                case exports._end:
                    ifstack.pop();
                    yield exports._end;
                    break;
                case _etrue:
                case _efalse:
                    let v = ifstack.pop()[1] ? [_false, true] : [placeholders[i].bool, placeholders[i].bool === _true];
                    ifstack.push(v);
                    yield exports._end;
                    yield v[0];
                    break;
                default:
                    yield placeholders[i];
                    break;
            }
        }
    }
}
function tpl(literals, ...placeholders) {
    return Array.from(makeTree(merge(literals, placeholders), false)).join('');
}
exports.tpl = tpl;
