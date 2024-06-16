import { v4 } from "uuid";
import pluralize from "pluralize";
import crypto from "crypto";
import bytes from "bytes";
import moment from "moment";
import isEven from "is-even";
import isOdd from "is-odd";
import isNumber from "is-number";

export const isTypescript = Symbol.for("ts-node.register.instance") in process;

export const sha256 = (data: any) => {
    return crypto.createHash("sha256").update(stringify(data)).digest().toString("hex");
}

export const md5 = (data: any) => {
    return crypto.createHash("md5").update(stringify(data)).digest().toString("hex");
}

export const hex = (data: any) => {
    return Buffer.from(stringify(data)).toString("hex")
}

export const base64 = (data: any) => {
    return Buffer.from(stringify(data)).toString("base64")
}

export const binary = (data: any) => {
    return Buffer.from(stringify(data)).toString("binary")
}

export const ascii = (data: any) => {
    return Buffer.from(stringify(data)).toString("ascii")
}

export const latin1 = (data: any) => {
    return Buffer.from(stringify(data)).toString("latin1")
}

export const decode = (data: Buffer | string, encoding: BufferEncoding) => {
    return Buffer.from(data.toString(), encoding).toString("utf-8")
}

export const plural = pluralize

export const capitalize = (str: string, eachword = false) => {
    if (!eachword) {
        const capitalletter = str.charAt(0).toUpperCase();
        return capitalletter + str.slice(1);
    } else {
        const words = str.split(/ +/g);
        const finalWords = [] as string[];

        for (const word of words) {
            const capitalletter = word.charAt(0).toUpperCase();
            finalWords.push(capitalletter + word.slice(1));
        }

        return finalWords.join(" ");
    }
}

export const crop = (str: string, charNumber: number) => {
    return `${str.substring(0, charNumber - 3)}${str.length > charNumber ? "..." : ""}`;
}

export const remove = (str: string, ...toRemove: string[])  => {
    let final = str;
    for (const text of toRemove) final = str.replace(text, "");
    return final;
}

export const escape = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


export const first = <T extends unknown>(array: T[], n = 1): T[] => {
    if (n === 1) return [array[0]];
    return array.filter((_: any, index: number) => index < n);
}

export const last = <T extends unknown>(array: T[], n = 1): T[] => {
    if (n === 1) return [array.at(-1)!];
    return array.filter((_: any, index: number) => array.length - index <= n);
}

export const random = <T extends unknown>(array: T[]) => {
    return array[Math.floor(Math.random() * array.length)];
}

export const get = <T extends any>(array: any[], key: string): T[] => {
    return array.map((element: any) => element[key]);
}

export const groupBy = <T extends unknown>(array: T[], key: string): Record<string, T[]> => {
    return array.reduce((group: any, element: any) => {
        const keyValue = element[key];
        return { ...group, [keyValue]: [...(group[keyValue] ?? []), element] };
    }, {});
}

export const group = <T extends unknown>(array: T[], n: number) => {
    const g: T[][] = [];

    for (let i = 0, j = 0; i < array.length; i++) {
        if (i >= n && i % n === 0) j++;
        g[j] = g[j] || [];
        g[j].push(array[i]);
    }

    return g;
}

export const stringify = (arg: any) => {
    if (arg instanceof Error) {
        let msg = `${arg.name}: ${arg.message}`
        if (arg.stack) msg += `\n${arg.stack.replace(`${arg.toString()}\n`, "")}`
        if (arg.cause) msg += `\nCaused by: ${stringify(arg.cause)}`
        return msg;
    }

    if (typeof arg === "object") {
        return JSON.stringify(arg, null, 4);
    }

    if (Array.isArray(arg)) {
        return arg.map(a => stringify(a)).join(", ");
    }

    return arg.toString();
}

export const colors = {
    amethyst: 0x9966CC,
    aqua: 0x1abc9c,
    blue: 0x3498db,
    blurple: 0x5865f2,
    darkAqua: 0x11806a,
    darkBlue: 0x206694,
    darkButNotBlack: 0x2c2f33,
    darkGold: 0xc27c0e,
    darkGreen: 0x1f8b4c,
    darkGrey: 0x979c9f,
    darkNavy: 0x2c3e50,
    darkOrange: 0xa84300,
    darkPurple: 0x71368a,
    darkRed: 0x992d22,
    darkVividPink: 0xad1457,
    darkerGrey: 0x7f8c8d,
    default: 0x000000,
    fuchsia: 0xeb459e,
    gold: 0xf1c40f,
    green: 0x57f287,
    grey: 0x95a5a6,
    greyple: 0x99aab5,
    lightGrey: 0xbcc0c0,
    luminousVividPink: 0xe91e63,
    navy: 0x34495e,
    notQuiteBlack: 0x23272a,
    orange: 0xe67e22,
    purple: 0x9b59b6,
    red: 0xed4245,
    white: 0xffffff,
    yellow: 0xfee75c,
} as const;

export const uuid = v4;

export const randomId = (length: number, mode: "letters" | "lettersLowerCase" | "lettersUppercase" | "numbers" | "both" | "bothUpperCase" | "bothLowerCase" | string = "both") => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", numbers = "0123456789";
    let charset = "", out = ""

    switch (mode) {
        case "letters": charset = letters + letters.toLowerCase(); break;
        case "lettersLowerCase": charset = letters.toLowerCase(); break;
        case "lettersUppercase": charset = letters; break;
        case "numbers": charset = numbers; break;
        case "both": charset = letters + letters.toLowerCase() + numbers; break;
        case "bothUpperCase": charset = letters + numbers; break;
        case "bothLowerCase": charset = letters.toLowerCase() + numbers; break;
        default: charset = mode; break;
    }

    for (let i = 0; i < length; i++) out += charset.charAt(Math.floor(Math.random() * charset.length));

    return out;
}

export const highlight = (str: string, color: ((text: string | number) => string)) => {
    for (const match of str.match(/(\[[^[{}\]]*\]|\([^()]*\)|^[A-Z\d\s]+:|(?:https?:\/\/)[a-z0-9_\-\.]*[a-z0-9_\-]{1,}\.[a-z]{2,}(?:\?(?:\w+=\w+&?)*)?|(?:[a-z-.+]+?:\/\/)(?:[^/:@?&\\](?::[^\/:@?&\\])?@)?[^/:@?&\\]+\.[a-z]{2,})(?:\?(?:\w+=\w+&?)*)?/img) ?? [])
        str = str.replace(match, color(match));

    return str;
}

export {
    bytes,
    moment,
    isEven,
    isOdd,
    isNumber
};

export default {
    isTypescript,
    sha256,
    md5,
    hex,
    base64,
    binary,
    ascii,
    latin1,
    decode,
    plural,
    capitalize,
    crop,
    remove,
    escape,
    first,
    last,
    random,
    get,
    groupBy,
    group,
    stringify,
    colors,
    uuid,
    randomId,
    highlight
}