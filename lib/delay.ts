export function delay<T>(callback: () => Promise<T>, t: number) : Promise<T> {
    return new Promise(resolve => setTimeout(() => { resolve(callback()) }, t));
};
