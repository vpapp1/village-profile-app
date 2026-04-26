import { db } from "../db";

export interface IDharma {
  id?: number;
  name: string;
  status: number;
}
export class Dharma {
  id: number;
  name: string;
  status: number;

  constructor(data: IDharma) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.dharmas.mapToClass(Dharma);
  }
  save() {
    return db.dharmas.put(this);
  }
}

export async function addNewDharma(data: IDharma) {
  await db.transaction("rw", db.dharmas, async function () {
    await db.dharmas.put(
      new Dharma({...data})
    );
  });
}

export async function getAllDharmas() {
  return await db.transaction("r", db.dharmas, async function () {
    let dharmas = await db.dharmas.toArray();
    return dharmas;
  });
}

export async function getDharmaById(id: string) {
  return await db.dharmas.get(parseInt(id));
}

export async function getDharmaByName(name: string) {
  return await db.dharmas.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateDharma(data: IDharma) {
  return await db.dharmas.put({...data});
}
