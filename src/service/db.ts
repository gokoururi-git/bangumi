export class DB<T> {
    private instance: Promise<IDBObjectStore> | null = null;
    private dbName = '';
    private objName = '';
    private key = 'id';
    constructor(dbName: string, objName: string, key = 'id') {
        this.key = key;
        this.dbName = dbName;
        this.objName = objName;
        this.activeObjectStore();
    }
    /**
     * 每个objectStore创建出来后只能做一件事，每次执行事务前都需要重新激活
     */
    private async activeObjectStore() {
        this.instance = new Promise((resolve, reject) => {
            const controller = window.indexedDB.open(this.dbName, 3);
            controller.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                db.createObjectStore(this.objName, { keyPath: this.key });
            }
            controller.onsuccess = () => {
                resolve(controller.result.transaction(this.objName, "readwrite").objectStore(this.objName));
            }
            controller.onerror = e => {
                reject(e);
            }
        });
    }
    async search(key: string): Promise<T> {
        this.activeObjectStore();
        const result = await this._get(key) as { value: T };
        return result?.value;
    }
    async delete(key: string): Promise<boolean> {
        this.activeObjectStore();
        const db = await this.instance as IDBObjectStore;
        return await new Promise((resolve, reject) => {
            const request = db.delete(key);
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (err) => {
                reject(err);
            }
        });
    }
    async save(key: string, value: T): Promise<boolean> {
        this.activeObjectStore();
        const db = await this.instance as IDBObjectStore;
        return await new Promise((resolve, reject) => {
            const request = db.put({
                [this.key]: key,
                value
            })
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (err) => {
                reject(err);
            }
        });
    }
    private async _get(key: string) {
        this.activeObjectStore();
        const db = await this.instance as IDBObjectStore;
        return await new Promise((resolve, reject) => {
            const request = db.get(key);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (err) => {
                reject(err);
            }
        });
    }
}