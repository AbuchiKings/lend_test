import cache from '.';

export async function setValue(key: string, value: string | number, expireAfterSecs: number) {
    return cache.set(key, `${value}`, { EX: expireAfterSecs });
}

export async function keyExists(...keys: string[]) {
    return (await cache.exists(keys)) ? true : false;
}

export async function getValue(key: string) {
    return cache.get(key);
}

export async function delByKey(key: string) {
    return cache.del(key);
}

export async function setJson(key: string, value: Record<string, unknown>, expireAfterSecs: number,) {
    const json = JSON.stringify(value);
    return await setValue(key, json, expireAfterSecs);
}

export async function getJson<T>(key: string) {
    const type = await cache.type(key);
    if (type !== 'string') return null;

    const json = await getValue(key);
    if (json) return JSON.parse(json) as T;

    return null;
}