import api from "../Api/api";
import { db } from "./db";
import { addNewBasti, getBastiByName } from "./models/BastiModel";
import { addNewSabikWard, getSabikWardByName } from "./models/SabikWardModel";
import { addNewCountry, getCountryByName } from "./models/CountryModel";
import { addNewCountrySamuha, getCountrySamuhaByName } from "./models/CountrySamuhaModel";
import { addNewDharma, getDharmaByName } from "./models/DharmaModel";
import { addNewHousehold, getAllHousehold, IHousehold, updateHousehold } from "./models/Household";
import { addNewJaati, getJaatiByName } from "./models/JaatiModel";
import { addNewJaatiSamuha, getJaatiSamuhaByName } from "./models/JaatiSamuhaModel";
import { addNewMarga, getMargaByName, updateMarga } from "./models/MargaModel";
import { addNewMember, IMember } from "./models/Member";
import { addNewMotherToungue, getMotherToungueByName } from "./models/MotherTongue";
import { addNewOccupation, getOccupationByName } from "./models/Occupation";
import { addNewEducationStage, getEducationStageByName } from "./models/EducationStage";
import { addNewProfessionCategory, getProfessionCategoryByName } from "./models/ProfessionCategory";
import { addNewProfession, getProfessionByName } from "./models/Profession";
import { addNewTechnicalSkill, getTechnicalSkillByName } from "./models/TechnicalSkill";
import { addNewWard, getWardByName } from "./models/WardModel";

export async function getWadas(office_id: String, user_id:String) {
  console.log("Synchronizing Wards25...");
  let res = await api.loadWada(office_id, user_id);
  if (res.status === 200) {
    let wards = res.data;
    wards.map(async (w: any) => {
      let checkWard = await getWardByName(w.name);
      if (checkWard.length === 0) {
        await addNewWard({ name: w.name, status: w.status, id: w.id });
      }
    });
    console.log(wards.length, " Wards Synced.");
    return wards;
  }
  return null;
}

export async function getSabikWards(office_id: String) {
  console.log("Synchronizing SabikWards...");
    let res = await api.loadSabikWada(office_id);
   if (res.status === 200) {
    let sabikWards = res.data;
    
    sabikWards.map(async (w: any) => {
    
            let checksabikWard = await getSabikWardByName(w.name);
            
      if (checksabikWard.length === 0) {
        await addNewSabikWard({
          name: w.name,
          status: w.status,
          id: w.id,
          wardId: w.ward_id,
        });
      }
    });
    console.log(sabikWards.length, " Sabikward Synced.");
  }
}

export async function getBastis(office_id: String) {
  console.log("Synchronizing Basti...");
  let res = await api.loadBasti(office_id);
    if (res.status === 200) {
    let basti = res.data;
    basti.map(async (w: any) => {
      // console.log("sabik==" + w.sabik_ward_id)
      // console.log("hello=="+ basti.map[0])
      let checkBasti = await getBastiByName(w.name);
      if (checkBasti.length === 0) {
                await addNewBasti({
                    name: w.name,
          status: w.status,
          id: w.id,
          wardId: w.ward_id,
          sabikWardId: w.sabik_ward_id,
        });
      }
    });
    console.log(basti.length, " Bastis Synced.");
  }
}

export async function getMargas(office_id: String) {
  console.log("Synchronizing Marga...");
  let res = await api.loadMarga(office_id);
  if (res.status === 200) {
    let margas = res.data;
    margas.map(async (m: any) => {
      const payload = {
        id: m.id,
        name: m.name,
        bastiId: m.basti_id ?? m.bastiId,
        wardId: m.ward_id ?? m.wardId,
        sabikWardId: m.sabik_ward_id ?? m.sabikWardId,
        status: m.status,
      };
      let checkMarga = await getMargaByName(m.name);
      if (checkMarga.length === 0) {
        await addNewMarga(payload);
      } else {
        await updateMarga(payload);
      }
    });
    console.log(margas.length, " Marga Synced.");
  }
}

export async function getMotherToungure() {
  console.log("Synchronizing MT Samuha...");
  let res = await api.loadMotherTongues();
  if (res.status === 200) {
    let mother_tongues = res.data;
    mother_tongues.map(async (m: any) => {
      let checkMt = await getMotherToungueByName(m.name);
      if (checkMt.length === 0) {
        await addNewMotherToungue({ ...m });
      }
    });
    console.log(mother_tongues.length, " MT Synced.");
  }
}
export async function getJaatiSamuha() {
  console.log("Synchronizing Jaati Samuha...");
  let res = await api.loadJaatiSamuhas();
  if (res.status === 200) {
    let jaatis = res.data;
    jaatis.map(async (m: any) => {
      let checkJaati = await getJaatiSamuhaByName(m.name);
      if (checkJaati.length === 0) {
        await addNewJaatiSamuha({ ...m });
      }
    });
    console.log(jaatis.length, " Jaati Samuha Synced.");
  }
}

export async function getJaati() {
  console.log("Synchronizing Jaati...");
  let res = await api.loadJaati();
  if (res.status === 200) {
    let jaatis = res.data;
    jaatis.map(async (m: any) => {
      let checkJaati = await getJaatiByName(m.name);
      if (checkJaati.length === 0) {
        await addNewJaati({ ...m });
      }
    });
    console.log(jaatis.length, " Jaati Synced.");
  }
}
export async function getCountrySamuha() {
  console.log("Synchronizing Country Samuha...");
  let res = await api.loadCountrySamuhas();
  if (res.status === 200) {
    let Countrys = res.data;
    Countrys.map(async (m: any) => {
      let checkCountry = await getCountrySamuhaByName(m.name);
      if (checkCountry.length === 0) {
        await addNewCountrySamuha({ ...m });
      }
    });
    console.log(Countrys.length, " Country Samuha Synced.");
  }
}

export async function getCountry() {
  console.log("Synchronizing Country...");
  let res = await api.loadCountry();
  if (res.status === 200) {
    let Countrys = res.data;
    Countrys.map(async (m: any) => {
      let checkCountry = await getCountryByName(m.name);
      if (checkCountry.length === 0) {
        await addNewCountry({ ...m });
      }
    });
    console.log(Countrys.length, " Country Synced.");
  }
}

export async function getDharma() {
  console.log("Synchronizing Dharma...");
  let res = await api.loadDharma();
  if (res.status === 200) {
    let dharmas = res.data;
    dharmas.map(async (m: any) => {
      let checkDharma = await getDharmaByName(m.name);
      if (checkDharma.length === 0) {
        await addNewDharma({ ...m });
      }
    });
    console.log(dharmas.length, " Dharma Synced.");
  }
}

export async function getOccupation() {
  console.log("Synchronizing Occupation...");
  let res = await api.loadOccupations();
  if (res.status === 200) {
    let occupations = res.data;
    occupations.map(async (m: any) => {
      let checkDharma = await getOccupationByName(m.name);
      if (checkDharma.length === 0) {
        await addNewOccupation({ ...m });
      }
    });
    console.log(occupations.length, " Occupation Synced.");
  }
}

export async function getTechnicalSkill() {
  console.log("Synchronizing Technical Skills...");
  let res = await api.loadTechnicalSkills();
  if (res.status === 200) {
    let technicalSkills = res.data;
    technicalSkills.map(async (m: any) => {
      let checkTS = await getTechnicalSkillByName(m.name);
      if (checkTS.length === 0) {
        await addNewTechnicalSkill({ ...m });
      }
    });
    console.log(technicalSkills.length, " Technical Skills Synced.");
  }
}

export async function getEducationStage() {
  console.log("Synchronizing Education Stages...");
  let res = await api.loadEducationStages();
  if (res.status === 200) {
    let stages = res.data;
    stages.map(async (m: any) => {
      let check = await getEducationStageByName(m.name);
      if (check.length === 0) {
        await addNewEducationStage({ ...m });
      }
    });
    console.log(stages.length, " Education Stages Synced.");
  }
}

export async function getProfessionCategory() {
  console.log("Synchronizing Profession Categories...");
  let res = await api.loadProfessionCategories();
  if (res.status === 200) {
    let categories = res.data;
    categories.map(async (m: any) => {
      let check = await getProfessionCategoryByName(m.name);
      if (check.length === 0) {
        await addNewProfessionCategory({ ...m });
      }
    });
    console.log(categories.length, " Profession Categories Synced.");
  }
}

export async function getProfession() {
  console.log("Synchronizing Professions...");
  let categoryRes = await api.loadProfessionCategories();
  if (categoryRes.status !== 200) return;
  let categories = categoryRes.data ?? [];
  for (const cat of categories) {
    let res = await api.loadProfessions(`${cat.id}`);
    if (res.status === 200) {
      let professions = res.data;
      professions.map(async (m: any) => {
        let check = await getProfessionByName(m.name);
        if (check.length === 0) {
          await addNewProfession({ ...m });
        }
      });
    }
  }
}

const normalizeFlag = (value: any, fallback: string) => {
  if (value === undefined || value === null || value === "") return fallback;
  return `${value}`;
};
const normalizeId = (value: any) => {
  if (value === undefined || value === null || value === "") return "";
  return `${value}`;
};

const extractSyncHouseholds = (data: any) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.households)) return data.households;
  return [];
};

export async function getHouseholdsForSync(office_id: String, user_id: String) {
  console.log("Synchronizing Households...");
  try {
    const res = await api.loadHouseholdsForSync(office_id, user_id);
    if (res.status !== 200) return;

    const syncHouseholds = extractSyncHouseholds(res.data);
    const localHouseholds = await getAllHousehold();
    const householdMap = new Map<string, IHousehold>();
    localHouseholds.forEach((hh) => {
      if (hh.id_string) householdMap.set(hh.id_string, hh);
    });

    for (const remote of syncHouseholds) {
      const serverId = remote?.id;
      if (serverId === undefined || serverId === null) continue;
      const syncKey = `server-${serverId}`;
      const existing = householdMap.get(syncKey);

      const members = Array.isArray(remote.members) ? remote.members : [];
      const householdPayload: IHousehold = {
        ...remote,
        members: [],
        id_string: syncKey,
        server_household_id: serverId,
        ward_id: normalizeId(remote.ward_id),
        sabikWard_id: normalizeId(remote.sabikWard_id),
        basti_id: normalizeId(remote.basti_id),
        marga_id: normalizeId(remote.marga_id),
        is_posted: "0",
        is_complete: normalizeFlag(remote.is_complete, "1"),
        is_deleted: normalizeFlag(remote.is_deleted, "0"),
        user_id: normalizeFlag(remote.user_id, `${user_id}`),
      };

      delete householdPayload.id;
      delete householdPayload.members;

      let localHhId = existing?.id;
      if (localHhId) {
        await updateHousehold({ ...householdPayload, id: localHhId });
      } else {
        localHhId = await addNewHousehold(householdPayload);
        householdMap.set(syncKey, { ...householdPayload, id: localHhId });
      }

      await db.members.where("hh_id").equals(parseInt(`${localHhId}`)).delete();
      for (const member of members) {
        const memberPayload: IMember = { ...member, hh_id: localHhId as any };
        memberPayload.member_id = member.id;
        delete memberPayload.id;
        await addNewMember(memberPayload);
      }
    }
    console.log(syncHouseholds.length, " Households Synced.");
  } catch (e) {
    console.log("Household sync skipped.", e);
  }
}

export async function syncDb(data: any) {
  if (window.navigator.onLine) {
    await getWadas(data.office_id, data.id);
    await getSabikWards(data.office_id);
    await getBastis(data.office_id);
    await getMargas(data.office_id);
    await getJaati();
    await getJaatiSamuha();
    await getDharma();
    await getOccupation();
    await getEducationStage();
    await getProfessionCategory();
    await getProfession();
    await getTechnicalSkill();
    await getMotherToungure();
    await getCountrySamuha()
    await getCountry()
    await getHouseholdsForSync(data.office_id, data.id);
  }
}
