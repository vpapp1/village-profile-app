import { db } from "../db";

export interface IProfession {
  id?: number;
  name: string;
  category_id: number;
}

export class Profession {
  id: number;
  name: string;
  category_id: number;

  constructor(data: IProfession) {
    this.name = data.name;
    this.category_id = data.category_id;
    if (data.id) this.id = data.id;
    db.professions.mapToClass(Profession);
  }

  save() {
    return db.professions.put(this);
  }
}

export async function addNewProfession(data: IProfession) {
  await db.transaction("rw", db.professions, async function () {
    await db.professions.add(new Profession({ ...data }));
  });
}

export async function getAllProfessions() {
  return await db.transaction("r", db.professions, async function () {
    return await db.professions.toArray();
  });
}

export async function getProfessionsByCategoryId(categoryId: string) {
  return await db.professions.where("category_id").equals(parseInt(categoryId, 10)).toArray();
}

export async function getProfessionByName(name: string) {
  return await db.professions.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}

