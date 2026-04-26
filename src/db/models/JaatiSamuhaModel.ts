import { db } from "../db";

export interface IJaatiSamuha {
  id?: number;
  name: string;
  status: number;
}
export class JaatiSamuha {
  id: number;
  name: string;
  status: number;

  constructor(data: IJaatiSamuha) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.jaati_samuhas.mapToClass(JaatiSamuha);
  }
  save() {
    return db.jaati_samuhas.put(this);
  }
}

export async function addNewJaatiSamuha(data: IJaatiSamuha) {
  await db.transaction("rw", db.jaati_samuhas, async function () {
    await db.jaati_samuhas.put(
      new JaatiSamuha({...data})
    );
  });
}

export async function getAllJaatiSamuhas() {
  return await db.transaction("r", db.jaati_samuhas, async function () {
    let samuhas = await db.jaati_samuhas.toArray();
    return samuhas;
  });
}

export async function getJaatiSamuhaById(id: string) {
  return await db.jaati_samuhas.get(parseInt(id));
}

export async function getJaatiSamuhaByName(name: string) {
  return await db.jaati_samuhas.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}
