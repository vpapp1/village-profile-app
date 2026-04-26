import { db } from "../db";

export interface ICountrySamuha {
  id?: number;
  name: string;
}
export class CountrySamuha {
  id: number;
  name: string;

  constructor(data: ICountrySamuha) {
    this.name = data.name;
    if (data.id) this.id = data.id;
    db.country_samuhas.mapToClass(CountrySamuha);
  }
  save() {
    return db.country_samuhas.put(this);
  }
}

export async function addNewCountrySamuha(data: ICountrySamuha) {
  await db.transaction("rw", db.country_samuhas, async function () {
    await db.country_samuhas.put(
      new CountrySamuha({...data})
    );
  });
}

export async function getAllCountrySamuhas() {
  return await db.transaction("r", db.country_samuhas, async function () {
    let samuhas = await db.country_samuhas.toArray();
    return samuhas;
  });
}

export async function getCountrySamuhaById(id: string) {
  return await db.country_samuhas.get(parseInt(id));
}

export async function getCountrySamuhaByName(name: string) {
  return await db.country_samuhas.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}
