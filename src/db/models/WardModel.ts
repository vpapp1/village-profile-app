import { db } from "../db";

export interface IWard {
  id?: number;
  name: string;
  status: number;
}
export class Ward {
  id: number;
  name: string;
  status: number;

  constructor(data: IWard) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.wards.mapToClass(Ward);
  }
  save() {
    return db.wards.put(this);
  }
}

export async function addNewWard(data: IWard) {
  await db.transaction("rw", db.wards, async function () {
    await db.wards.put(
      new Ward({...data})
    );
  });
}

export async function getAllWards() {
  return await db.transaction("r", db.wards, async function () {
    let wards = await db.wards.toArray();
    return wards;
  });
}

export async function getWardById(id: string) {
  return await db.wards.get(parseInt(id));
}

export async function getWardByName(name: string) {
  return await db.wards.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateWard(data: IWard) {
  return await db.wards.put({...data});
}
