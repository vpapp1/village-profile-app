import { db } from "../db";

export interface IOccupation {
  id?: number;
  name: string;
  status: number;
}
export class Occupation {
  id: number;
  name: string;
  status: number;

  constructor(data: IOccupation) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.occupations.mapToClass(Occupation);
  }
  save() {
    return db.occupations.put(this);
  }
}

export async function addNewOccupation(data: IOccupation) {
  await db.transaction("rw", db.occupations, async function () {
    await db.occupations.put(
      new Occupation({...data})
    );
  });
}

export async function getAllOccupations() {
  return await db.transaction("r", db.occupations, async function () {
    let occupations = await db.occupations.toArray();
    return occupations;
  });
}

export async function getOccupationById(id: string) {
  return await db.occupations.get(id);
}

export async function getOccupationByName(name: string) {
  return await db.occupations.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateOccupation(data: IOccupation) {
  return await db.occupations.put({...data});
}
