import { db } from "../db";

export interface IEducationStage {
  id?: number;
  name: string;
}

export class EducationStage {
  id: number;
  name: string;

  constructor(data: IEducationStage) {
    this.name = data.name;
    if (data.id) this.id = data.id;
    db.educationStages.mapToClass(EducationStage);
  }

  save() {
    return db.educationStages.put(this);
  }
}

export async function addNewEducationStage(data: IEducationStage) {
  await db.transaction("rw", db.educationStages, async function () {
    await db.educationStages.add(new EducationStage({ ...data }));
  });
}

export async function getAllEducationStages() {
  return await db.transaction("r", db.educationStages, async function () {
    return await db.educationStages.toArray();
  });
}

export async function getEducationStageByName(name: string) {
  return await db.educationStages.where("name").startsWithAnyOfIgnoreCase(name).toArray();
}

