import { db } from "../db";

export interface IMotherTongue {
  id?: number;
  name: string;
  status?: number;
}
export class MotherTongue {
  id: number;
  name: string;
  status: number;

  constructor(data: IMotherTongue) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.mother_toungues.mapToClass(MotherTongue);
  }
  save() {
    return db.mother_toungues.put(this);
  }
}

export async function addNewMotherToungue(data: IMotherTongue) {
  await db.transaction("rw", db.mother_toungues, async function () {
    await db.mother_toungues.put(
      new MotherTongue({...data})
    );
  });
}

export async function getAllMotherToungues() {
  return await db.transaction("r", db.mother_toungues, async function () {
    let MotherToungues = await db.mother_toungues.toArray();
    return MotherToungues;
  });
}

export async function getMotherToungueById(id: string) {
  return await db.mother_toungues.get(parseInt(id));
}

export async function getMotherToungueByName(name: string) {
  return await db.mother_toungues.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateWard(data: IMotherTongue) {
  return await db.mother_toungues.put({...data});
}
