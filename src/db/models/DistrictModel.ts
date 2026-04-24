import { db } from "../db";

export interface IDistrict {
  id?: number;
  name: string;
  name_ne?: string;
  name_en?: string;
  status: number;
}

export class District {
  id: number;
  name: string;
  name_ne?: string;
  name_en?: string;
  status: number;

  constructor(data: IDistrict) {
    this.name = data.name;
    this.name_ne = data.name_ne;
    this.name_en = data.name_en;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.districts.mapToClass(District);
  }

  save() {
    return db.districts.put(this);
  }
}

export async function addNewDistrict(data: IDistrict) {
  await db.transaction("rw", db.districts, async function () {
    await db.districts.add(new District({ ...data }));
  });
}

export async function upsertDistrict(data: IDistrict) {
  return await db.districts.put({ ...data });
}

export async function getAllDistricts() {
  return await db.transaction("r", db.districts, async function () {
    const districts = await db.districts.toArray();
    return districts;
  });
}

export async function getDistrictByName(name: string) {
  return await db.districts.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}
