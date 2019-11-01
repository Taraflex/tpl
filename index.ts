const _true = Symbol('true');
const _false = Symbol('false');

type SBool = typeof _true | typeof _false;

class EBool {
    constructor(public readonly bool: SBool) { }
}

const _etrue = new EBool(_true);
const _efalse = new EBool(_false);

//todo pach typedefs to remove type
export const _if = (v: any) => v ? _true : _false;
export const _elif = (v: any) => v ? _etrue : _efalse;
export const _else = _etrue;
export const _end = Symbol('end');

function* makeTree(leafs: Generator, skeep: boolean) {
    let t: IteratorResult<any> = null;
    while (!(t = leafs.next()).done) {
        switch (t.value) {
            case _true:
                yield* makeTree(leafs, skeep);
                break;
            case _false:
                yield* makeTree(leafs, true);
                break;
            case _end:
                return;
            default:
                if (!skeep) {
                    yield t.value;
                }
                break;
        }
    }
}

function* merge(literals: TemplateStringsArray, placeholders: any[]) {
    let ifstack: [SBool, boolean][] = [];
    for (let i = 0; i < literals.length; i++) {
        yield literals[i];
        if (i < placeholders.length) {
            switch (placeholders[i]) {
                case _true:
                case _false:
                    ifstack.push([placeholders[i], placeholders[i] === _true]);
                    yield placeholders[i];
                    break;
                case _end:
                    ifstack.pop();
                    yield _end;
                    break;
                case _etrue:
                case _efalse:
                    let v: [SBool, boolean] = ifstack.pop()[1] ? [_false, true] : [placeholders[i].bool, placeholders[i].bool === _true];
                    ifstack.push(v);
                    yield _end;
                    yield v[0];
                    break;
                default:
                    yield placeholders[i];
                    break;
            }
        }
    }
}

export function tpl(literals: TemplateStringsArray, ...placeholders: any[]) {
    return Array.from(makeTree(merge(literals, placeholders), false)).join('');
}