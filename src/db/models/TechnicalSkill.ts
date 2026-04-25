import { db } from "../db";
import { technical_skills as staticTechnicalSkills } from "../../enums";

export interface ITechnicalSkill {
  id?: number;
  name: string;
  status: number;
}
export class TechnicalSkill {
  id: number;
  name: string;
  status: number;

  constructor(data: ITechnicalSkill) {
    this.name = data.name;
    this.status = data.status;
    if (data.id) this.id = data.id;
    db.technicalSkills.mapToClass(TechnicalSkill);
  }
  save() {
    return db.technicalSkills.put(this);
  }
}

export async function addNewTechnicalSkill(data: ITechnicalSkill) {
  await db.transaction("rw", db.technicalSkills, async function () {
    await db.technicalSkills.add(
      new TechnicalSkill({...data})
    );
  });
}

export async function getAllTechnicalSkills() {
  return await db.transaction("rw", db.technicalSkills, async function () {
    let technicalSkills = await db.technicalSkills.toArray();
    if (!technicalSkills.length) {
      technicalSkills = staticTechnicalSkills.map((skill: any) => ({
        id: Number(skill.id),
        name: skill.name,
        status: 1,
      }));
      await db.technicalSkills.bulkPut(technicalSkills);
    }
    return technicalSkills;
  });
}

export async function getTechnicalSkillById(id: string) {
  return await db.technicalSkills.get(id);
}

export async function getTechnicalSkillByName(name: string) {
  return await db.technicalSkills.where('name').startsWithAnyOfIgnoreCase(name).toArray();
}

export async function updateTechnicalSkill(data: ITechnicalSkill) {
  return await db.technicalSkills.put({...data});
}
