import { db } from "../db";

export interface ISabikWard {
  id?: number;
  name: string;
  status: number;
  wardId: number;
}
export class SabikWard {
  id: number;
  name: string;
  status: number;
  wardId: number;

  constructor(name: string, status: number, wardId: number, id?: number) {
    this.name = name;
    this.status = status;
    this.wardId = wardId;
    if (id) this.id = id;
    db.sabikWards.mapToClass(SabikWard);
  }
  save() {
    return db.sabikWards.put(this);
  }
}

export async function addNewSabikWard(data: ISabikWard) {
  console.log("new" + data)
  await db.transaction("rw", db.sabikWards, async function () {
    await db.sabikWards.put(
      new SabikWard(data.name, data.status, data.wardId, data.id)
    );
  });
}

export async function getAllSabikWard() {
  return await db.transaction("r", db.sabikWards, async function () {
    let sabikWards = await db.sabikWards.toArray();
    return sabikWards;
  });
}

export async function getSabikWardById(id: string) {
   console.log("swid" +db.sabikWards.get(parseInt(id)))
   return await db.sabikWards.get(parseInt(id));
}

export async function getSabikWardByName(name: string) {
    console.log("====data==" +db.sabikWards.where('name').startsWithAnyOfIgnoreCase(name).toArray())
    return await db.sabikWards.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function getSabikWardByWardId(wardId: any) {
  console.log("sabikward" + db.sabikWards.where({wardId: parseInt(wardId)}) )
  return await db.sabikWards.where({wardId: parseInt(wardId)}).toArray();
}

export async function updateSabikWard(data: ISabikWard) {
  return await db.sabikWards.put({
    id: data.id,
    name: data.name,
    status: data.status,
    wardId: data.wardId,
  });
}
