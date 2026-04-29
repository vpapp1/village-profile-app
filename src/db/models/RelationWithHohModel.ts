import { db } from "../db";

export interface IRelationWithHoh {
  id?: number;
  name: string;
  status: number;
  order?: number;
  gender_id?: number | string | null;
  gender_name?: string | null;
}

export class RelationWithHoh {
  id: number;
  name: string;
  status: number;
  order: number;
  gender_id: number | string | null;
  gender_name: string | null;

  constructor(data: IRelationWithHoh) {
    this.name = data.name;
    this.status = data.status;
    this.order = data.order ?? 0;
    this.gender_id = data.gender_id ?? null;
    this.gender_name = data.gender_name ?? null;
    if (data.id) this.id = data.id;
    db.relationWithHohs.mapToClass(RelationWithHoh);
  }

  save() {
    return db.relationWithHohs.put(this);
  }
}

export async function addNewRelationWithHoh(data: IRelationWithHoh) {
  await db.transaction("rw", db.relationWithHohs, async function () {
    await db.relationWithHohs.put(new RelationWithHoh({ ...data }));
  });
}

export async function getAllRelationWithHohs() {
  return await db.transaction("r", db.relationWithHohs, async function () {
    const relations = await db.relationWithHohs.toArray();
    return relations;
  });
}

export async function getRelationWithHohById(id: string) {
  return await db.relationWithHohs.get(parseInt(id));
}

export async function getRelationWithHohByName(name: string) {
  return await db.relationWithHohs.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateRelationWithHoh(data: IRelationWithHoh) {
  return await db.relationWithHohs.put({ ...data });
}