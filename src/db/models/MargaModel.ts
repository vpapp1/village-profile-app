import { db } from "../db";

export interface IMarga {
  id?: number;
  name: string;
  status: number;
  wardId: number;
  sabikWardId: number;
  bastiId: number;
}
export class Marga {
  id: number;
  name: string;
  status: number;
  sabikWardId: number;
  wardId: number;
  bastiId: number;

  constructor(data: IMarga) {
    this.name = data.name;
    this.status = data.status;
    this.wardId = data.wardId;
    this.sabikWardId = data.sabikWardId;
    this.bastiId = data.bastiId;
    if (data.id) this.id = data.id;
    db.margas.mapToClass(Marga);
  }
  save() {
    return db.margas.put(this);
  }
}

export async function addNewMarga(data: IMarga) {
  await db.transaction("rw", db.margas, async function () {
    await db.margas.add(
      new Marga({...data})
    );
  });
}

export async function getAllMarga() {
  return await db.transaction("r", db.margas, async function () {
    let margas = await db.margas.toArray();
    return margas;
  });
}

export async function getMargaById(id: string) {
  return await db.margas.get(parseInt(id));
}

export async function getMargaByName(name: string) {
  return await db.margas.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function getMargaByWardId(wardId: any) {
  return await db.margas.where({wardId: parseInt(wardId)}).toArray();
}

export async function getMargaBySabikWardId(sabikWardId: any) {
  return await db.margas.where({sabikWardId: parseInt(sabikWardId)}).toArray();
}

export async function getMargaByBastiId(bastiId: any) {
  console.log("margaID" + db.margas.where({bastiId: parseInt(bastiId)}).toArray());
  return await db.margas.where({bastiId: parseInt(bastiId)}).toArray();
}

export async function updateMarga(data: IMarga) {
  return await db.margas.put({...data});
}
