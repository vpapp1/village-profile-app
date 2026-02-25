import { db } from "../db";

export interface IProfessionCategory {
  id?: number;
  name: string;
  weight?: number;
}

export class ProfessionCategory {
  id: number;
  name: string;
  weight: number;

  constructor(data: IProfessionCategory) {
    this.name = data.name;
    this.weight = data.weight ?? 0;
    if (data.id) this.id = data.id;
    db.professionCategories.mapToClass(ProfessionCategory);
  }

  save() {
    return db.professionCategories.put(this);
  }
}

export async function addNewProfessionCategory(data: IProfessionCategory) {
  await db.transaction("rw", db.professionCategories, async function () {
    await db.professionCategories.add(new ProfessionCategory({ ...data }));
  });
}

export async function getAllProfessionCategories() {
  return await db.transaction("r", db.professionCategories, async function () {
    return await db.professionCategories.toArray();
  });
}

export async function getProfessionCategoryByName(name: string) {
  return await db.professionCategories.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}

