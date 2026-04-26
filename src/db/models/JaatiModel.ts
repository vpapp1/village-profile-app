import { db } from "../db";

export interface IJaati {
  id?: number;
  name: string;
  jaati_samuha_id: string;
  status: number;
}
export class Jaati {
  id: number;
  name: string;
  jaati_samuha_id: string;
  status: number;

  constructor(data: IJaati) {
    this.name = data.name;
    this.status = data.status;
    this.jaati_samuha_id = data.jaati_samuha_id;
    if (data.id) this.id = data.id;
    db.jaatis.mapToClass(Jaati);
  }
  save() {
    return db.jaatis.put(this);
  }
}

export async function addNewJaati(data: IJaati) {
  await db.transaction("rw", db.jaatis, async function () {
    await db.jaatis.put(
      new Jaati({...data})
    );
  });
}

export async function getAllJaatis() {
  return await db.transaction("r", db.jaatis, async function () {
    let jaatis = await db.jaatis.toArray();
    return jaatis;
  });
}

export async function getJaatiById(id: string) {
  return await db.jaatis.get(parseInt(id));
}

export async function getJaatiByName(name: string) {
  return await db.jaatis.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function getJaatiBySamuhaId(jaati_samuha_id: number) {
  return await db.jaatis.where({jaati_samuha_id: jaati_samuha_id}).toArray();
}

export async function updateWard(data: IJaati) {
  return await db.jaatis.put({...data});
}
